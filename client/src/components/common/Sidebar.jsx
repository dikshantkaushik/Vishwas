import React from 'react';
import {
  Home,
  LayoutDashboard,
  FolderKanban,
  FilePlus,
  ShieldCheck,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Sidebar = ({
  currentView,
  setCurrentView,
  isOpen,
  onClose,
  stats,
  onCreateWithMode,
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: stats?.total ? `${stats.total}` : null,
    },
    {
      id: 'agreements',
      label: 'All Agreements',
      icon: FolderKanban,
      badge: null,
    },
    {
      id: 'create',
      label: 'New Agreement',
      icon: FilePlus,
      badge: '3 Modes',
    },
  ];

  const handleNav = (viewId) => {
    setCurrentView(viewId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header on Mobile Drawer */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 lg:hidden">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Vishwas
            </span>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-800 text-emerald-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Creation Modes Direct Shortcuts */}
          <div className="pt-6 px-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-2">
              Smart Creation
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  if (onCreateWithMode) onCreateWithMode('camera');
                  else handleNav('create');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Camera / Slip Scan</span>
              </button>
              <button
                onClick={() => {
                  if (onCreateWithMode) onCreateWithMode('text');
                  else handleNav('create');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Type in Own Words</span>
              </button>
              <button
                onClick={() => {
                  if (onCreateWithMode) onCreateWithMode('speech');
                  else handleNav('create');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                <span>Speech to Agreement</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Metrics / Trust Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected Trade Value</span>
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {formatCurrency(stats?.totalAgreedValue || 0)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Across {stats?.total || 0} active micro-agreements
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
