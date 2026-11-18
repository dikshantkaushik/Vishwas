import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Calendar,
  Building2,
  User,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Share2,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AgreementDetailView = ({
  agreement,
  onBack,
  onStatusUpdate,
  updatingStatus,
}) => {
  const [copied, setCopied] = useState(false);

  if (!agreement) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Status Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {/* Status Transitions */}
          {agreement.status === 'Draft' && (
            <button
              onClick={() => onStatusUpdate(agreement._id, 'Pending')}
              disabled={updatingStatus}
              className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
            >
              Activate (Move to Pending)
            </button>
          )}

          {agreement.status === 'Pending' && (
            <button
              onClick={() => onStatusUpdate(agreement._id, 'Confirmed')}
              disabled={updatingStatus}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Agreement</span>
            </button>
          )}

          {agreement.status === 'Confirmed' && (
            <button
              onClick={() => onStatusUpdate(agreement._id, 'Completed')}
              disabled={updatingStatus}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Mark as Completed</span>
            </button>
          )}

          {agreement.status !== 'Completed' && agreement.status !== 'Cancelled' && (
            <button
              onClick={() => onStatusUpdate(agreement._id, 'Cancelled')}
              disabled={updatingStatus}
              className="px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Document-Like Agreement Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Document Header Band */}
        <div className="p-8 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-slate-300">
                  Vishwas Digital Micro-Agreement
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {agreement.transactionTitle}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Mutual trade agreement established under unorganized small-enterprise standard practice
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Agreement Identifier
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400 block mt-0.5">
                {agreement.agreementId}
              </span>
              <div className="mt-2">
                <StatusBadge status={agreement.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-8 space-y-8">
          {/* Parties Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contracting Parties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Provider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                  Service Provider / Merchant
                </span>
                <p className="text-base font-semibold text-slate-900 mt-1">
                  {agreement.merchantName}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 font-mono">
                  {agreement.merchantContact}
                </p>
                <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Originating Business Party</span>
                </div>
              </div>

              {/* Customer */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                  Client / Customer
                </span>
                <p className="text-base font-semibold text-slate-900 mt-1">
                  {agreement.customerName}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 font-mono">
                  {agreement.customerContact}
                </p>
                <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Receiving Contracting Party</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description of Work & Deliverables */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Scope of Work & Deliverables
            </h2>
            <div className="p-5 rounded-xl bg-white border border-slate-200 text-sm leading-relaxed text-slate-800 whitespace-pre-line">
              {agreement.workDescription}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Financial Terms & Payment Breakdown
            </h2>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Financial Component</th>
                    <th className="py-3 px-4 text-right">Amount (INR ₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      Total Agreed Value
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(agreement.totalAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-slate-700">
                      Advance Paid / Deposited
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-700">
                      {formatCurrency(agreement.advanceAmount || 0)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Outstanding Remaining Balance Due
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-base">
                      {formatCurrency(agreement.remainingAmount || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Agreed Payment Schedule & Terms: </span>
                <span>{agreement.paymentTerms}</span>
              </div>
            </div>
          </div>

          {/* Timeline and Dates */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Agreed Timeline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    Start Date
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {formatDate(agreement.startDate)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    Expected Completion Date
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {formatDate(agreement.expectedCompletionDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Mutual Understanding Declaration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800 mb-1">
              Mutual Understanding & Trust Acknowledgment:
            </p>
            <p>
              This digital micro-agreement serves as a mutual written affirmation of the scope, payment conditions, and delivery dates agreed between {agreement.merchantName} and {agreement.customerName}. Any material modifications to the work scope or timeline require mutual confirmation between both parties.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
              <span>Record Created: {new Date(agreement.createdAt).toLocaleString('en-IN')}</span>
              <span>Last Modified: {new Date(agreement.updatedAt).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementDetailView;
