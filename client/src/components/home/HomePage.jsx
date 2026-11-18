import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  FilePlus,
  FolderKanban,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Sparkles,
  Award,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const HomePage = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* 1. The Big Hero Box (Texts preserved, buttons removed as requested) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-14 border border-slate-800 shadow-xl">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-emerald-300 mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Trust for Indian Micro-Enterprises & Freelancers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Turn Verbal Deals into{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Trusted Agreements
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            Record work scopes, advance payments, and deadlines in seconds via Camera, Voice, or Text.
          </p>

          {/* Micro Trust Bullets */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>₹ INR Denominated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero Legal Jargon</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Slip & Voice AI</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Print & PDF Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3 Large Attractive Buttons: Dashboard, Create Agreement, All Agreements */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Button 1: Dashboard */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="group text-left bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition shadow-xs">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                  {stats?.total || 0} Total
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Track revenue, advance deposits, and active orders.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition">
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Large Button 2: Create Agreement (Centerpiece) */}
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="group text-left bg-gradient-to-b from-white to-emerald-50/40 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 p-6 shadow-xs hover:shadow-xl hover:ring-2 hover:ring-emerald-500/20 transition-all duration-200 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition shadow-xs">
                  <FilePlus className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-300/60">
                  Camera &bull; Voice &bull; Text
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Create Agreement
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Draft in 30 seconds via Camera, Voice, or Text.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition">
              <span>Start New Agreement</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Large Button 3: All Agreements */}
          <button
            type="button"
            onClick={() => onNavigate('agreements')}
            className="group text-left bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-800 p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-slate-100 group-hover:bg-slate-900 text-slate-700 group-hover:text-white flex items-center justify-center transition shadow-xs">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {stats?.confirmed || 0} Active
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-900 transition">
                All Agreements
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Search, filter, view, and print contracts.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:translate-x-1 transition">
              <span>View All Agreements</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* 3. The Problem vs Vishwas Solution */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Why It Matters
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Why India's Tradespeople Need Vishwas
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Informal verbal commitments lead to payment disputes, delayed deliveries, and broken trust.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Without Vishwas */}
          <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100">
            <h3 className="font-bold text-rose-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              The Informal Way (WhatsApp / Verbal)
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-rose-800">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">&times;</span>
                Customer disputes advance deposit amount or claims work was incomplete.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">&times;</span>
                Deliverables change midway without revising payment terms.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">&times;</span>
                No formal written record or receipt when collecting final balances.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">&times;</span>
                Handwritten slips get lost, damaged, or discarded.
              </li>
            </ul>
          </div>

          {/* With Vishwas */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              The Vishwas Way (Digital Trust)
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Clear, immutable Agreement ID (e.g. <code>AGR-20261115-4371</code>).
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Auto-calculated remaining balance from agreed total and advance deposit.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Clean document view ready to print or save as PDF for customer peace of mind.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Live merchant dashboard tracking active, pending, and completed pipeline.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Live Impact Stats from DB */}
      <section className="bg-slate-900 rounded-2xl text-white p-8 sm:p-10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Live Network Metrics
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Active Trade Pipeline on Vishwas
            </h2>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <span>View detailed dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
          <div>
            <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">
              Total Protected Value
            </span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {formatCurrency(stats?.totalAgreedValue || 0)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Total financial commitments tracked</p>
          </div>

          <div>
            <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">
              Advance Collected
            </span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              {formatCurrency(stats?.totalAdvanceReceived || 0)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Secured upfront deposits</p>
          </div>

          <div>
            <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">
              Total Agreements Logged
            </span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {stats?.total || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.confirmed || 0} active &bull; {stats?.completed || 0} completed
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
