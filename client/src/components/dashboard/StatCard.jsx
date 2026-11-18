import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'slate' }) => {
  const iconColorStyles = {
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconColorStyles[color] || iconColorStyles.slate}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
