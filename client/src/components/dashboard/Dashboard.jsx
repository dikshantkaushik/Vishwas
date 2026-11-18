import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  CheckCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  Calendar,
} from 'lucide-react';
import StatCard from './StatCard';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const Dashboard = ({
  stats,
  recentAgreements,
  loading,
  onNavigate,
  onSelectAgreement,
  dbStatus,
}) => {
  return (
    <div className="space-y-8">
      {/* DB Connection Alert if offline */}
      {!dbStatus.connected && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">MongoDB is not connected</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Ensure MongoDB is running locally (e.g. at <code className="bg-amber-100 px-1 py-0.5 rounded">mongodb://127.0.0.1:27017</code>) or add your cloud MongoDB Atlas connection string in <code className="bg-amber-100 px-1 py-0.5 rounded">server/.env</code>.
            </p>
          </div>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your verbal orders, trade commitments, and customer agreements in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Agreement</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Agreements"
          value={loading ? '...' : stats.total || 0}
          subtitle="All micro-agreements logged"
          icon={FileText}
          color="slate"
        />
        <StatCard
          title="Pending Confirmation"
          value={loading ? '...' : stats.pending || 0}
          subtitle="Awaiting client confirmation"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Active & Confirmed"
          value={loading ? '...' : stats.confirmed || 0}
          subtitle="Work currently in progress"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Completed"
          value={loading ? '...' : stats.completed || 0}
          subtitle="Fulfilled & fully settled"
          icon={CheckCheck}
          color="blue"
        />
      </div>

      {/* Financial Overview Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">Total Transaction Pipeline</h2>
          </div>
          <span className="text-xs text-slate-400">Real-time Financial Overview</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total Agreed Value</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalAgreedValue || 0)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Advance Received</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(stats.totalAdvanceReceived || 0)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Outstanding Balance</span>
            <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(stats.totalPendingBalance || 0)}</p>
          </div>
        </div>
      </div>

      {/* Recent Agreements Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Agreements</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The latest micro-agreements created and managed
            </p>
          </div>
          <button
            onClick={() => onNavigate('agreements')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Agreements Table */}
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading records...</div>
        ) : recentAgreements.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No agreements found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Create your first digital micro-agreement to replace informal verbal commitments with clear, documented terms.
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900 text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Agreement Now</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Agreement ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Transaction / Scope</th>
                  <th className="py-3 px-4">Agreed Amount</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAgreements.slice(0, 5).map((agr) => (
                  <tr
                    key={agr._id}
                    className="hover:bg-slate-50/70 transition cursor-pointer"
                    onClick={() => onSelectAgreement(agr)}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-800">
                      {agr.agreementId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {agr.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {agr.transactionTitle}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatCurrency(agr.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(agr.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={agr.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAgreement(agr);
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
