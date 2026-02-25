import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Zap, Shield, Search } from 'lucide-react';
import { tools } from '../data/docs';
import { docEntryRoutes, getDocEntryRoute } from '../data/docEntryRoutes';
import { useLanguage } from '../context/LanguageContext';

export const Home = () => {
  const { t, language } = useLanguage();

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-medium text-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
             {t('hero.badge')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 whitespace-pre-line">
            {t('hero.title')}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
            {t('hero.subtitle')}
          </p>
          
          <div className="max-w-md mx-auto relative group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
             <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
             <div className="relative flex items-center bg-card border border-border rounded-lg shadow-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all p-1">
                <Search className="text-muted-foreground ml-3 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder={t('hero.placeholder')}
                  className="w-full h-12 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0 px-3 text-base outline-none"
                />
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  {t('hero.button')}
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t('popular.title')}</h2>
              <Link to={docEntryRoutes.claude} className="text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                 {t('popular.viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.values(tools).map((tool) => (
                <Link 
                  key={tool.id} 
                  to={getDocEntryRoute(tool.id)}
                  className="group relative flex flex-col p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-border">
                     {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{tool[language].name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {tool[language].description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary mt-auto">
                     {t('popular.viewDocs')} <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border bg-background">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t('feature.fast.title')}</h3>
                  <p className="text-muted-foreground">{t('feature.fast.desc')}</p>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                     <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t('feature.secure.title')}</h3>
                  <p className="text-muted-foreground">{t('feature.secure.desc')}</p>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                     <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t('feature.dev.title')}</h3>
                  <p className="text-muted-foreground">{t('feature.dev.desc')}</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
