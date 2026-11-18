import React, { useState } from 'react';
import { Menu, ShieldCheck, User, ChevronDown, LayoutDashboard, FolderKanban, FilePlus } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, onOpenSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Page title mapping for desktop breadcrumbs (null for homepage)
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Merchant Dashboard';
      case 'agreements':
        return 'Agreement Registry';
      case 'create':
        return 'Create Agreement';
      case 'details':
        return 'Agreement Overview';
      default:
        return null;
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
      {/* Full width container spanning to extreme edges */}
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between h-16">
        {/* Extreme Left: Mobile Menu Toggle + Vishwas Logo + Breadcrumb */}
        <div className="flex items-center gap-3">
          {currentView !== 'home' && (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left group"
            title="Return to Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">
              Vishwas
            </span>
          </button>

          {/* Breadcrumb (Only visible when on internal workspace pages) */}
          {pageTitle && (
            <div className="hidden sm:flex items-center text-slate-300 text-sm font-medium ml-3 gap-2">
              <span>/</span>
              <span className="text-slate-600 font-semibold">{pageTitle}</span>
            </div>
          )}
        </div>

        {/* Extreme Right: Profile Icon & Status */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition text-left"
            aria-label="Merchant profile menu"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs border border-slate-200">
                <User className="w-4 h-4 text-slate-200" />
              </div>
              {/* Active status dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Merchant Account
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold leading-none mt-0.5">
                Verified &bull; Online
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Vishwas Merchant</p>
                  <p className="text-[11px] text-slate-500">vishwas@gmail.com</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>MongoDB Atlas Connected</span>
                  </div>
                </div>

                <div className="pt-1.5 space-y-0.5 text-xs text-slate-700">
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-left transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('agreements');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-left transition"
                  >
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    <span>All Agreements</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('create');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 font-medium text-left transition"
                  >
                    <FilePlus className="w-4 h-4 text-slate-400" />
                    <span>Create Agreement</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-semibold text-emerald-700 transition"
                  >
                    &larr; Back to Homepage
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
