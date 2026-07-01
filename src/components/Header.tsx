import React from 'react';
import { LayoutDashboard, BarChart3, Settings, RefreshCw, PlusCircle, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  currentTab: 'dispatch' | 'analytics';
  setCurrentTab: (tab: 'dispatch' | 'analytics') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  mode: 'mock' | 'live';
  onOpenSettings: () => void;
  onAddMockOrder: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Header({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  mode,
  onOpenSettings,
  onAddMockOrder,
  onRefresh,
  isRefreshing,
}: HeaderProps) {
  const isHe = lang === 'he';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Slogan */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-md shadow-blue-500/10">
            <span className="font-mono text-xl font-bold tracking-tight text-white">S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans text-xl font-extrabold tracking-tight text-slate-900">
                Saban<span className="text-blue-600">OS</span>
              </h1>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                mode === 'live' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {mode === 'live' ? (
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {isHe ? 'לייב (גוגל שיטס)' : 'Live Sheets'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    {isHe ? 'סביבת סימולציה' : 'Sandbox (Mock)'}
                  </span>
                )}
              </span>
            </div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              {isHe ? 'ניהול לוגיסטיקה ושרשרת אספקה' : 'Logistics & Supply Chain Hub'}
            </p>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            id="tab-dispatch-btn"
            onClick={() => setCurrentTab('dispatch')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              currentTab === 'dispatch'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            {isHe ? 'לוח סידור ראשי' : 'Dispatch Dashboard'}
          </button>
          <button
            id="tab-analytics-btn"
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              currentTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {isHe ? 'דוחות וניתוח מוצרים' : 'Product Analytics'}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Quick Mock Order Generation for demo interactivity */}
          {mode === 'mock' && (
            <button
              id="header-mock-order-btn"
              onClick={onAddMockOrder}
              className="group hidden sm:flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:border-blue-300"
              title={isHe ? 'הוסף הזמנת דמו אקראית' : 'Simulate incoming order'}
            >
              <PlusCircle className="h-3.5 w-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span>{isHe ? 'הזמנה חדשה' : '+ Sim Order'}</span>
            </button>
          )}

          {/* Refresh Action */}
          <button
            id="header-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={isHe ? 'רענן נתונים' : 'Refresh Data'}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Language Toggle */}
          <button
            id="header-lang-btn"
            onClick={() => setLang(isHe ? 'en' : 'he')}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            title={isHe ? 'Switch to English' : 'עבור לעברית'}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{isHe ? 'EN' : 'עב'}</span>
          </button>

          {/* Settings Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            title={isHe ? 'הגדרות סנכרון' : 'Sync Configurations'}
          >
            <Settings className="h-4 w-4 text-slate-500 hover:text-slate-800" />
          </button>
        </div>
      </div>

      {/* Mobile navigation bottom bar */}
      <div className="flex md:hidden border-t border-slate-100 bg-slate-50/50 p-1 justify-center gap-1">
        <button
          id="mob-tab-dispatch-btn"
          onClick={() => setCurrentTab('dispatch')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
            currentTab === 'dispatch'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          {isHe ? 'לוח סידור' : 'Dispatch'}
        </button>
        <button
          id="mob-tab-analytics-btn"
          onClick={() => setCurrentTab('analytics')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
            currentTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          {isHe ? 'ניתוח מוצרים' : 'Analytics'}
        </button>
      </div>
    </header>
  );
}
