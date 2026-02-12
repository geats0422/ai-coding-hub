import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Info, Check, Copy } from 'lucide-react';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { tools } from '../data/docs';
import { cn, scrollToId } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export const Docs = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { t, language } = useLanguage();
  const tool = tools[toolId as keyof typeof tools] || tools.claude;
  const toolContent = tool[language];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto flex items-start">
      {/* Left Sidebar (Sticky) */}
      <aside className="hidden lg:block w-72 sticky top-16 h-[calc(100vh-4rem)] border-r border-border overflow-y-auto flex flex-col">
        <div className="p-6 flex-1">
           <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                 {toolContent.name}
              </div>
              <ul className="space-y-1">
                 {toolContent.sections.map((section, idx) => (
                    <li key={section.id}>
                       <button
                         onClick={() => scrollToId(section.id)}
                         className={cn(
                           "w-full group flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                           idx === 1 
                             ? "text-primary bg-primary/10 border border-primary/20" 
                             : "text-muted-foreground hover:bg-muted hover:text-foreground"
                         )}
                       >
                          <span>{section.title}</span>
                          {idx === 1 && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]"></span>}
                       </button>
                       {/* Nested items for active section */}
                       {idx === 1 && (
                          <ul className="ml-4 mt-1 border-l border-border pl-4 space-y-1">
                             <li><button onClick={() => scrollToId('prerequisites')} className="block py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">{t('docs.step1.title')}</button></li>
                             <li><button onClick={() => scrollToId('cli-install')} className="block py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">{t('docs.step2.title')}</button></li>
                             <li><button onClick={() => scrollToId('auth')} className="block py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">{t('docs.step3.title')}</button></li>
                          </ul>
                       )}
                    </li>
                 ))}
              </ul>
           </div>
           
           <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                 {t('docs.integrations')}
              </div>
              <ul className="space-y-1">
                 <li><a href="#" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors">VS Code</a></li>
                 <li><a href="#" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors">JetBrains</a></li>
              </ul>
           </div>
        </div>
        
        <div className="p-4 border-t border-border mt-auto sticky bottom-0 bg-background">
           <AdPlaceholder variant="sidebar" className="h-auto py-3 bg-muted/20" label={t('docs.sponsor')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-12 py-10">
         {/* Breadcrumbs */}
         <nav className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors">{t('docs.breadcrumb')}</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground font-medium">{toolContent.name}</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>{t('docs.install.title')}</span>
         </nav>

         <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">{t('docs.install.title')}</h1>
         <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-3xl">
            {t('docs.install.desc', { tool: toolContent.name })}
         </p>

         {/* Ad Slot 2 (Banner) */}
         <div className="mb-12">
            <AdPlaceholder variant="banner" />
         </div>

         {/* Content Body */}
         <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* Step 1 */}
            <div id="prerequisites" className="scroll-mt-24">
               <h2 className="flex items-center group text-2xl font-bold mb-4 mt-12">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm border border-primary/20 mr-3">1</span>
                  {t('docs.step1.title')}
               </h2>
               <p className="text-muted-foreground mb-4">{t('docs.step1.text')}</p>
               <ul className="space-y-2 mb-6 ml-11 list-disc text-muted-foreground">
                  <li><strong className="text-foreground">{t('docs.step1.node')}</strong></li>
                  <li><strong className="text-foreground">{t('docs.step1.npm')}</strong></li>
                  <li>{t('docs.step1.key')}</li>
               </ul>

               <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 ml-11 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                     <h4 className="font-medium text-sm text-blue-500 mb-1">{t('docs.step1.warning.title')}</h4>
                     <p className="text-sm text-blue-500/80 m-0">
                        {t('docs.step1.warning.text', { tool: toolContent.name })}
                     </p>
                  </div>
               </div>
            </div>

            {/* Step 2 */}
            <div id="cli-install" className="scroll-mt-24">
               <h2 className="flex items-center group text-2xl font-bold mb-4 mt-12">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm border border-primary/20 mr-3">2</span>
                  {t('docs.step2.title')}
               </h2>
               <p className="text-muted-foreground mb-6">
                  {t('docs.step2.text', { tool: toolContent.name })}
               </p>
               
               <div className="ml-11 rounded-xl overflow-hidden border border-border bg-[#0d1117] shadow-lg mb-6">
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border-b border-border">
                     <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                     <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-3 h-3" /> Copy
                     </button>
                  </div>
                  <div className="p-4 font-mono text-sm overflow-x-auto text-slate-300">
                     <div className="flex">
                        <span className="text-slate-500 mr-4 select-none">$</span>
                        <span>npm install -g @anthropic-ai/claude-code</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Step 3 */}
            <div id="auth" className="scroll-mt-24">
               <h2 className="flex items-center group text-2xl font-bold mb-4 mt-12">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm border border-primary/20 mr-3">3</span>
                  {t('docs.step3.title')}
               </h2>
               <p className="text-muted-foreground mb-6">
                  {t('docs.step3.text')}
               </p>
               
               <div className="ml-11 rounded-xl overflow-hidden border border-border bg-[#0d1117] shadow-lg mb-6">
                   <div className="p-4 font-mono text-sm overflow-x-auto text-slate-300">
                     <div className="flex">
                        <span className="text-slate-500 mr-4 select-none">$</span>
                        <span>claude login</span>
                     </div>
                  </div>
               </div>
               
               <p className="text-muted-foreground ml-11 mb-6">
                  {t('docs.step3.envText')}
               </p>

               <div className="ml-11 rounded-xl overflow-hidden border border-border bg-[#0d1117] shadow-lg mb-6">
                   <div className="p-4 font-mono text-sm overflow-x-auto text-slate-300">
                     <div className="flex">
                        <span className="text-purple-400 mr-2">export</span>
                        <span className="text-blue-400 mr-2">ANTHROPIC_API_KEY</span>
                        <span className="text-slate-500 mr-2">=</span>
                        <span className="text-green-400">"sk-ant-..."</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <hr className="border-border my-12" />

         {/* Ad Slot 3 */}
         <div className="my-10">
            <div className="bg-card rounded-xl p-6 border border-border flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
               <div className="h-24 w-full md:w-32 bg-muted rounded-lg border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=200&h=200" 
                    alt="AI Infrastructure" 
                    className="w-full h-full object-cover"
                  />
               </div>
               <div className="flex-1 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                     <h4 className="font-bold text-foreground text-lg">{t('docs.ad.title')}</h4>
                     <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded bg-muted/50">Sponsored</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{t('docs.ad.text')}</p>
                  <button className="bg-foreground text-background px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition-opacity">{t('docs.ad.button')}</button>
               </div>
            </div>
         </div>

         {/* Pagination */}
         <div className="flex justify-between items-center pt-6 gap-4">
            <Link to="#" className="group flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all w-1/2">
               <span className="text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors">{t('docs.prev')}</span>
               <div className="flex items-center gap-2 text-foreground font-medium">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {toolContent.sections[0].title}
               </div>
            </Link>
            <Link to="#" className="group flex flex-col items-end p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all w-1/2">
               <span className="text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors">{t('docs.next')}</span>
               <div className="flex items-center gap-2 text-foreground font-medium">
                  Quickstart
                  <ChevronRight className="w-4 h-4" />
               </div>
            </Link>
         </div>
      </main>

      {/* Right Sidebar (Sticky) */}
      <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] p-8 overflow-y-auto">
         <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{t('docs.onThisPage')}</h5>
         <ul className="space-y-3 text-sm border-l border-border pl-4">
            <li><button onClick={() => scrollToId('prerequisites')} className="block text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all text-left">{t('docs.step1.title')}</button></li>
            <li><button onClick={() => scrollToId('cli-install')} className="block text-primary font-medium hover:translate-x-1 transition-all text-left">{t('docs.step2.title')}</button></li>
            <li><button onClick={() => scrollToId('auth')} className="block text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all text-left">{t('docs.step3.title')}</button></li>
         </ul>

         <div className="mt-10 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
               <span className="material-icons text-sm font-bold">{t('docs.proTip')}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
               {t('docs.proTipContent')}
            </p>
         </div>
      </aside>
    </div>
  );
};