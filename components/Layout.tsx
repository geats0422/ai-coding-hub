import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Github, Moon, Sun, Menu, X, Languages } from 'lucide-react';
import { cn } from '../lib/utils';
import { CommandPalette } from './CommandPalette';
import { CookieConsentBanner } from './CookieConsentBanner';
import { useLanguage } from '../context/LanguageContext';
import { tools } from '../data/docs';
import { docEntryRoutes } from '../data/docEntryRoutes';

interface LayoutProps {
  children: React.ReactNode;
}

const socialLinks = {
  github: 'https://github.com/geats0422',
  bilibili: 'https://space.bilibili.com/338267911?spm_id_from=333.40164.0.0',
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isDocsCategoryActive = (category: 'claude' | 'gemini' | 'opencode' | 'codex' | 'playbook') =>
    location.pathname === `/docs/${category}` || location.pathname.startsWith(`/docs/${category}/`);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <NavLink to="/" className="flex items-center gap-2 group">
                <img src="/images/logo.svg" alt="AI Coding Hub logo" className="h-8 w-8 object-contain group-hover:scale-105 transition-transform" />
                <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
                  AI Coding Hub
                </span>
              </NavLink>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={({isActive}) => cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                {t('nav.home')}
              </NavLink>
              <Link to={docEntryRoutes.claude} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isDocsCategoryActive('claude') ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                {tools.claude[language].name}
              </Link>
              <Link to={docEntryRoutes.gemini} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isDocsCategoryActive('gemini') ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                {tools.gemini[language].name}
              </Link>
              <Link to={docEntryRoutes.opencode} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isDocsCategoryActive('opencode') ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                {tools.opencode[language].name}
              </Link>
              <Link to={docEntryRoutes.codex} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isDocsCategoryActive('codex') ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                {tools.codex[language].name}
              </Link>
              <Link to={docEntryRoutes.playbook} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", isDocsCategoryActive('playbook') ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                {language === 'zh' ? 'AI 实战手册' : 'AI Playbook'}
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 border border-transparent hover:border-border rounded-lg transition-all w-48 lg:w-64 group"
              >
                <Search size={16} />
                <span className="flex-1 text-left">{t('nav.search')}</span>
                <div className="flex items-center gap-0.5 text-[10px] font-mono border rounded px-1 bg-background text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </div>
              </button>
              
              <button 
                 onClick={() => setIsSearchOpen(true)}
                 className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Search size={20} />
              </button>

              <div className="h-6 w-px bg-border hidden sm:block"></div>

              <div className="flex items-center gap-1">
                 <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                 >
                   {isDark ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 
                 <button 
                   onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                   className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                   title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
                 >
                   <Languages size={20} />
                 </button>

                  <a 
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Github size={20} />
                  </a>
                  
                  <a 
                    href={socialLinks.bilibili}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Bilibili"
                  >
                    <svg 
                      className="w-5 h-5" 
                      viewBox="0 0 1024 1024" 
                      version="1.1" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        fill="currentColor"
                        d="M998.4 352.256c-3.072-136.192-121.856-162.304-121.856-162.304s-92.672-0.512-212.992-1.536l87.552-84.48s13.824-17.408-9.728-36.864c-23.552-19.456-25.088-10.752-33.28-5.632-7.168 5.12-112.128 108.032-130.56 126.464-47.616 0-97.28-0.512-145.408-0.512h16.896S323.584 63.488 315.392 57.856s-9.216-13.824-33.28 5.632c-23.552 19.456-9.728 36.864-9.728 36.864l89.6 87.04c-97.28 0-181.248 0.512-220.16 2.048C15.872 225.792 25.6 352.256 25.6 352.256s1.536 271.36 0 408.576c13.824 137.216 119.296 159.232 119.296 159.232s41.984 1.024 73.216 1.024c3.072 8.704 5.632 51.712 53.76 51.712 47.616 0 53.76-51.712 53.76-51.712s350.72-1.536 379.904-1.536c1.536 14.848 8.704 54.272 56.832 53.76 47.616-1.024 51.2-56.832 51.2-56.832s16.384-1.536 65.024 0c113.664-20.992 120.32-154.112 120.32-154.112s-2.048-273.92-0.512-410.112z m-97.792 434.176c0 21.504-16.896 38.912-37.888 38.912h-691.2c-20.992 0-37.888-17.408-37.888-38.912V328.192c0-21.504 16.896-38.912 37.888-38.912h691.2c20.992 0 37.888 17.408 37.888 38.912v458.24z" 
                      />
                      <path 
                        fill="currentColor"
                        d="M409.088 418.816l-203.264 38.912 17.408 76.288 201.216-38.912zM518.656 621.056c-49.664 106.496-94.208 26.112-94.208 26.112l-33.28 21.504s65.536 89.6 128 21.504c73.728 68.096 130.048-22.016 130.048-22.016l-30.208-19.456c0-0.512-52.736 75.776-100.352-27.648zM619.008 495.104l201.728 38.912 16.896-76.288-202.752-38.912z" 
                      />
                    </svg>
                  </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-4 space-y-2 animate-in slide-in-from-top-2">
            <NavLink to="/" className="block px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">{t('nav.home')}</NavLink>
            <NavLink to={docEntryRoutes.claude} className="block px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">{tools.claude[language].name}</NavLink>
            <NavLink to={docEntryRoutes.gemini} className="block px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">{tools.gemini[language].name}</NavLink>
            <NavLink to={docEntryRoutes.opencode} className="block px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">{tools.opencode[language].name}</NavLink>
            <NavLink to={docEntryRoutes.codex} className="block px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">{tools.codex[language].name}</NavLink>
            <NavLink to={docEntryRoutes.playbook} className="block px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium">{language === 'zh' ? 'AI 实战手册' : 'AI Playbook'}</NavLink>
        </div>
      )}

      {children}

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12 mt-auto">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                     <img src="/images/logo.svg" alt="AI Coding Hub logo" className="h-8 w-8 object-contain" />
                     <span className="font-semibold">AI Coding Hub</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Empowering developers to build the future with next-gen AI tools.</p>
               </div>
               <div>
                  <h4 className="font-semibold mb-3 text-sm">{t('footer.resources')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                     <li><Link to={docEntryRoutes.claude} className="hover:text-primary">{tools.claude[language].name}</Link></li>
                     <li><Link to={docEntryRoutes.gemini} className="hover:text-primary">{tools.gemini[language].name}</Link></li>
                     <li><Link to={docEntryRoutes.opencode} className="hover:text-primary">{tools.opencode[language].name}</Link></li>
                     <li><Link to={docEntryRoutes.codex} className="hover:text-primary">{tools.codex[language].name}</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-semibold mb-3 text-sm">{t('footer.community')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                     <li><a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a></li>
                     <li><a href={socialLinks.bilibili} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{language === 'zh' ? '哔哩哔哩' : 'Bilibili'}</a></li>
                  </ul>
               </div>
               <div>
                   <h4 className="font-semibold mb-3 text-sm">{t('footer.legal')}</h4>
                   <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><Link to="/privacy" className="hover:text-primary">{language === 'zh' ? '隐私政策' : 'Privacy Policy'}</Link></li>
                      <li><Link to="/terms" className="hover:text-primary">{language === 'zh' ? '服务条款' : 'Terms of Service'}</Link></li>
                   </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
               <p>{t('footer.rights')}</p>
               <p>{t('footer.design')}</p>
            </div>
         </div>
      </footer>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CookieConsentBanner />
    </div>
  );
};
