import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
  Calendar,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUS_TABS = ['All', 'Draft', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export const AgreementList = ({
  agreements,
  loading,
  onRefresh,
  onSelectAgreement,
  onCreateNew,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agreement Registry</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search and inspect all recorded digital agreements.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            title="Refresh agreements"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Agreement</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, agreement ID, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
            />
          </div>

          {/* Quick Stats Summary indicator */}
          <div className="text-xs text-slate-500 flex items-center gap-1.5 self-center">
            <span>Showing</span>
            <span className="font-semibold text-slate-900">{agreements.length}</span>
            <span>agreement{agreements.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agreements Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            Loading agreements from database...
          </div>
        ) : agreements.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">No matching agreements found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== 'All'
                ? 'Try clearing the search query or changing your status filter.'
                : 'No agreements have been recorded yet. Click below to establish your first agreement.'}
            </p>
            {searchQuery || selectedStatus !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('All');
                }}
                className="mt-4 text-xs font-semibold text-slate-900 hover:underline"
              >
                Reset filters
              </button>
            ) : (
              <button
                onClick={onCreateNew}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900 text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Agreement</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Agreement ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Transaction / Service Title</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Advance / Balance</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agreements.map((agr) => (
                  <tr
                    key={agr._id}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                    onClick={() => onSelectAgreement(agr)}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-900 group-hover:text-emerald-700 transition">
                      {agr.agreementId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{agr.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{agr.customerContact}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">{agr.transactionTitle}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[240px]">{agr.workDescription}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatCurrency(agr.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="text-emerald-700 font-medium">Adv: {formatCurrency(agr.advanceAmount || 0)}</div>
                      <div className="text-slate-500">Bal: {formatCurrency(agr.remainingAmount || 0)}</div>
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
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
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

export default AgreementList;
