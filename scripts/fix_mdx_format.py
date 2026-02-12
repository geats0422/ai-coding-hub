from pathlib import Path
import re


ROOTS = [
    Path("content/gemini-cli"),
    Path("content/codex"),
]


def normalize(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"<!--\s*([\s\S]*?)\s*-->", r"{/* \1 */}", text)
    text = re.sub(
        r"([^\n])(<(?:Callout|AdPlaceholder|WorkflowSteps|ToggleSection)\b)",
        r"\1\n\2",
        text,
    )
    text = re.sub(
        r"(</(?:Callout|WorkflowSteps|ToggleSection)>)([^\n])", r"\1\n\2", text
    )
    text = re.sub(r"([^\n])(```[A-Za-z0-9_-]*)", r"\1\n\2", text)
    text = re.sub(r"(```[A-Za-z0-9_-]*)([^\n])", r"\1\n\2", text)
    text = re.sub(r"(\n```)([A-Za-z]{2,10})\n([A-Za-z])\n", r"\1\2\n", text)
    text = re.sub(r"```###", "```\n###", text)
    text = re.sub(r"```For", "```\nFor", text)
    text = re.sub(r"```This", "```\nThis", text)
    text = re.sub(r"```To", "```\nTo", text)
    text = re.sub(r"```After", "```\nAfter", text)
    text = re.sub(r"(<a\s+href=[^>]*>)([\s\S]*?)(</a>)", r"\2", text)
    text = re.sub(r"<(DIRECTORY|stdio|full|feature)>", r"`<\1>`", text)
    text = re.sub(
        r"^(#{1,6}[^\n<]+)<(Callout|ToggleSection|WorkflowSteps)\b",
        r"\1\n<\2",
        text,
        flags=re.M,
    )
    return text


def main() -> None:
    changed = 0
    for root in ROOTS:
        for file in root.rglob("*.mdx"):
            source = file.read_text(encoding="utf-8", errors="ignore")
            target = normalize(source)
            if target != source:
                file.write_text(target, encoding="utf-8")
                changed += 1
    print(changed)


if __name__ == "__main__":
    main()
