import json
import re
import time
import unicodedata
from pathlib import Path
from typing import Dict, Tuple
from urllib.parse import quote
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parent.parent
SOURCE_GEMINI = ROOT / "Reference Document" / "Gemini Cli"
SOURCE_CODEX = ROOT / "Reference Document" / "Codex"

TARGET_GEMINI_EN = ROOT / "content" / "gemini-cli" / "en"
TARGET_GEMINI_ZH = ROOT / "content" / "gemini-cli" / "zh"
TARGET_CODEX_EN = ROOT / "content" / "codex" / "en"
TARGET_CODEX_ZH = ROOT / "content" / "codex" / "zh"

CACHE_PATH = ROOT / "scripts" / ".translation_cache.json"
PRESERVE_TERMS = ["Codex", "Gemini", "OpenAI"]


def load_cache() -> Dict[str, str]:
    if CACHE_PATH.exists():
        try:
            return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_cache(cache: Dict[str, str]) -> None:
    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


TRANSLATION_CACHE = load_cache()


def translate_text(text: str, target_lang: str, source_lang: str = "auto") -> str:
    text = text.strip("\n")
    if not text.strip():
        return text

    cache_key = f"{source_lang}|{target_lang}|{text}"
    if cache_key in TRANSLATION_CACHE:
        return TRANSLATION_CACHE[cache_key]

    encoded = quote(text)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl={source_lang}&tl={target_lang}&dt=t&q={encoded}"
    )

    last_error = None
    for attempt in range(4):
        try:
            raw = urlopen(url, timeout=20).read().decode("utf-8")
            payload = json.loads(raw)
            translated = "".join(part[0] for part in payload[0] if part and part[0])
            TRANSLATION_CACHE[cache_key] = translated
            return translated
        except Exception as error:
            last_error = error
            time.sleep(0.7 * (attempt + 1))

    print(f"[warn] translation failed, fallback to original: {last_error}")
    TRANSLATION_CACHE[cache_key] = text
    return text


def has_cjk(text: str) -> bool:
    return bool(re.search(r"[\u3400-\u9fff]", text))


def cjk_ratio(text: str) -> float:
    if not text:
        return 0.0
    cjk = len(re.findall(r"[\u3400-\u9fff]", text))
    return cjk / max(len(text), 1)


def slugify(text: str, fallback: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_only = ascii_only.lower()
    ascii_only = re.sub(r"[^a-z0-9]+", "-", ascii_only)
    ascii_only = re.sub(r"-+", "-", ascii_only).strip("-")
    if ascii_only:
        return ascii_only

    fallback = fallback.lower()
    fallback = re.sub(r"[^a-z0-9]+", "-", fallback)
    fallback = re.sub(r"-+", "-", fallback).strip("-")
    return fallback or "doc"


def parse_frontmatter(content: str) -> Tuple[Dict[str, str], str]:
    match = re.match(r"^---\n(.*?)\n---\n?(.*)$", content, flags=re.DOTALL)
    if not match:
        return {}, content

    raw_frontmatter, body = match.groups()
    frontmatter: Dict[str, str] = {}
    for line in raw_frontmatter.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        frontmatter[key] = value
    return frontmatter, body


def quote_yaml(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def normalize_html(text: str) -> str:
    text = text.replace("<br>", "<br />")
    text = text.replace("<br/>", "<br />")
    return text


def remove_imports(body: str) -> str:
    lines = body.splitlines()
    kept = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("import { AdPlaceholder }"):
            continue
        if stripped.startswith("import { Callout }"):
            continue
        kept.append(line)

    while kept and not kept[0].strip():
        kept.pop(0)
    return "\n".join(kept).strip() + "\n"


def apply_codex_image_italic_rule(body: str) -> str:
    lines = body.splitlines()
    out = []
    for line in lines:
        stripped = line.strip()
        looks_like_image_desc = (
            "Image Description" in stripped
            or "image description" in stripped
            or "Codex app showing" in stripped
        )
        if (
            looks_like_image_desc
            and stripped
            and not (stripped.startswith("*") and stripped.endswith("*"))
        ):
            out.append(f"*{stripped}*")
        else:
            out.append(line)
    return "\n".join(out)


def protect_tokens(
    text: str, preserve_terms: bool = True
) -> Tuple[str, Dict[str, str]]:
    mapping: Dict[str, str] = {}
    token_index = 0

    def replace_pattern(pattern: str, value: str) -> None:
        nonlocal token_index, text
        while True:
            found = re.search(pattern, text, flags=re.IGNORECASE)
            if not found:
                break
            token = f"@@P{token_index}@@"
            token_index += 1
            mapping[token] = found.group(0)
            text = text[: found.start()] + token + text[found.end() :]

    replace_pattern(r"`[^`]+`", "inline_code")
    replace_pattern(r"\[[^\]]+\]\([^\)]+\)", "markdown_link")
    replace_pattern(r"https?://[^\s)]+", "url")
    replace_pattern(r"<[^>]+>", "html_tag")

    if preserve_terms:
        for term in PRESERVE_TERMS:
            pattern = rf"\b{re.escape(term)}\b"
            while True:
                found = re.search(pattern, text)
                if not found:
                    break
                token = f"@@P{token_index}@@"
                token_index += 1
                mapping[token] = found.group(0)
                text = text[: found.start()] + token + text[found.end() :]

    return text, mapping


def restore_tokens(text: str, mapping: Dict[str, str]) -> str:
    for token, original in mapping.items():
        text = text.replace(token, original)
    return text


def split_translation_chunks(text: str, max_chars: int = 800) -> list[str]:
    if len(text) <= max_chars:
        return [text]

    pieces = re.split(r"(\n\n+)", text)
    chunks = []
    current = ""

    for piece in pieces:
        if len(current) + len(piece) <= max_chars:
            current += piece
        else:
            if current:
                chunks.append(current)
            current = piece

    if current:
        chunks.append(current)

    return chunks


def translate_text_block(block: str, target_lang: str, source_lang: str) -> str:
    if not block.strip():
        return block

    if target_lang == "en" and not has_cjk(block):
        return block

    translated_chunks = []
    for chunk in split_translation_chunks(block):
        protected, mapping = protect_tokens(
            chunk,
            preserve_terms=(target_lang == "zh-CN"),
        )
        translated = translate_text(
            protected,
            target_lang=target_lang,
            source_lang=source_lang,
        )
        translated = restore_tokens(translated, mapping)
        if target_lang == "zh-CN":
            for term in PRESERVE_TERMS:
                translated = re.sub(
                    rf"\b{re.escape(term)}\b",
                    term,
                    translated,
                    flags=re.IGNORECASE,
                )
        translated_chunks.append(translated)

    return "".join(translated_chunks)


def translate_markdown_body(
    body: str, target_lang: str, source_lang: str = "auto"
) -> str:
    segments = re.split(r"(```[\s\S]*?```)", body)
    translated_segments = []

    for segment in segments:
        if not segment:
            continue
        if segment.startswith("```") and segment.endswith("```"):
            translated_segments.append(segment)
        else:
            translated_segments.append(
                translate_text_block(
                    segment,
                    target_lang=target_lang,
                    source_lang=source_lang,
                )
            )

    return "".join(translated_segments).strip() + "\n"


def ensure_ads(body: str) -> str:
    lines = [line.rstrip() for line in body.strip().splitlines()]
    if not lines:
        return "<AdPlaceholder />\n\n<AdPlaceholder />\n"

    ad = "<AdPlaceholder />"
    ad_count = sum(1 for line in lines if line.strip() == ad)

    if ad_count < 1:
        insert_at = 0
        for idx, line in enumerate(lines):
            if line.strip().startswith("#"):
                insert_at = idx + 1
                break
        lines.insert(insert_at, "")
        lines.insert(insert_at + 1, ad)
        ad_count += 1

    if lines[-1].strip() != ad:
        lines.append("")
        lines.append(ad)
        ad_count += 1

    if ad_count < 2:
        insert_at = 0
        for idx, line in enumerate(lines):
            if line.strip().startswith("#"):
                insert_at = idx + 1
                break
        lines.insert(insert_at, "")
        lines.insert(insert_at + 1, ad)

    return "\n".join(lines).strip() + "\n"


def compose_mdx(frontmatter: Dict[str, str], body: str) -> str:
    fm = [
        "---",
        f"title: {quote_yaml(frontmatter['title'])}",
        f"description: {quote_yaml(frontmatter['description'])}",
        f"tool: {quote_yaml(frontmatter['tool'])}",
        f"slug: {quote_yaml(frontmatter['slug'])}",
        f"locale: {quote_yaml(frontmatter['locale'])}",
        "---",
        "",
        "import { AdPlaceholder } from '@/components/AdPlaceholder'",
        "import { Callout } from '@/components/Callout'",
        "",
    ]
    return "\n".join(fm) + body


def prepare_en_fields(
    frontmatter: Dict[str, str], fallback_stem: str
) -> Tuple[str, str, str]:
    source_title = frontmatter.get("title", fallback_stem)
    source_desc = frontmatter.get("description", source_title)
    source_slug = frontmatter.get("slug", "")

    title_en = source_title
    if has_cjk(title_en):
        title_en = translate_text(title_en, target_lang="en", source_lang="auto")

    desc_en = source_desc
    if has_cjk(desc_en):
        desc_en = translate_text(desc_en, target_lang="en", source_lang="auto")

    slug = source_slug.strip()
    if not slug or re.search(r"[^a-zA-Z0-9-]", slug):
        slug = slugify(title_en, fallback_stem)

    return title_en.strip(), desc_en.strip(), slug.strip()


def translate_filename_to_zh(source_name: str) -> str:
    stem = source_name[:-4] if source_name.lower().endswith(".mdx") else source_name

    if has_cjk(stem):
        return source_name if source_name.lower().endswith(".mdx") else (stem + ".mdx")

    parts = stem.split("-")
    translated_parts = []
    for part in parts:
        core = part.strip()
        if not core:
            translated_parts.append(part)
            continue

        if has_cjk(core):
            translated_parts.append(part)
            continue

        translated = translate_text(core, target_lang="zh-CN", source_lang="en")
        translated_parts.append(part.replace(core, translated))

    translated_stem = "-".join(translated_parts)
    return translated_stem + ".mdx"


def process_one_file(
    source_file: Path,
    target_en_dir: Path,
    target_zh_dir: Path,
    tool: str,
    codex_special: bool,
) -> None:
    raw = source_file.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(raw)
    body = normalize_html(remove_imports(body))

    title_en, desc_en, slug = prepare_en_fields(
        frontmatter, fallback_stem=source_file.stem
    )

    if cjk_ratio(body) > 0.08:
        body_en = translate_markdown_body(body, target_lang="en", source_lang="auto")
    else:
        body_en = body
    body_en = normalize_html(body_en)
    if codex_special:
        body_en = apply_codex_image_italic_rule(body_en)
    body_en = ensure_ads(body_en)

    en_frontmatter = {
        "title": title_en,
        "description": desc_en,
        "tool": tool,
        "slug": slug,
        "locale": "en",
    }
    en_output = compose_mdx(en_frontmatter, body_en)
    en_path = target_en_dir / source_file.name
    en_path.write_text(en_output, encoding="utf-8")

    body_zh = translate_markdown_body(body_en, target_lang="zh-CN", source_lang="en")
    body_zh = normalize_html(body_zh)
    body_zh = ensure_ads(body_zh)

    title_zh = translate_text(title_en, target_lang="zh-CN", source_lang="en")
    desc_zh = translate_text(desc_en, target_lang="zh-CN", source_lang="en")
    for term in PRESERVE_TERMS:
        title_zh = re.sub(
            rf"\b{re.escape(term)}\b", term, title_zh, flags=re.IGNORECASE
        )
        desc_zh = re.sub(rf"\b{re.escape(term)}\b", term, desc_zh, flags=re.IGNORECASE)

    zh_frontmatter = {
        "title": title_zh.strip(),
        "description": desc_zh.strip(),
        "tool": tool,
        "slug": slug,
        "locale": "zh",
    }
    zh_filename = translate_filename_to_zh(source_file.name)
    zh_output = compose_mdx(zh_frontmatter, body_zh)
    zh_path = target_zh_dir / zh_filename
    zh_path.write_text(zh_output, encoding="utf-8")


def process_batch(
    source_dir: Path, target_en: Path, target_zh: Path, tool: str, codex_special: bool
) -> int:
    files = sorted(source_dir.glob("*.mdx"))
    for src in files:
        process_one_file(
            src, target_en, target_zh, tool=tool, codex_special=codex_special
        )
    return len(files)


def main() -> None:
    gemini_count = process_batch(
        SOURCE_GEMINI,
        TARGET_GEMINI_EN,
        TARGET_GEMINI_ZH,
        tool="gemini-cli",
        codex_special=False,
    )
    save_cache(TRANSLATION_CACHE)

    codex_count = process_batch(
        SOURCE_CODEX,
        TARGET_CODEX_EN,
        TARGET_CODEX_ZH,
        tool="codex",
        codex_special=True,
    )
    save_cache(TRANSLATION_CACHE)

    print(f"done: gemini={gemini_count}, codex={codex_count}")


if __name__ == "__main__":
    main()
