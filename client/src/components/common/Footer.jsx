import React from 'react';
import { ShieldCheck, Mail, Phone, Clock, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto text-slate-600">
      {/* Full width spacious container matching the extreme left/right edges */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 pb-12 border-b border-slate-100">
          {/* Column 1: Brand & Purpose (Pushed comfortably to the Left) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-bold text-slate-900 text-xl tracking-tight">
                Vishwas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              Empowering India's independent artisans, contractors, and small merchants with simple, legally reliable digital micro-agreements.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70">
              <span>🇮🇳 Built for Bharat's Informal Economy</span>
            </div>
          </div>

          {/* Column 2: Support & Contact (Centered & Well-Spaced) */}
          <div className="space-y-4 md:pl-6 lg:pl-12">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Support & Direct Helpline
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-400">Email:</span>
                <a
                  href="mailto:vishwas@gmail.com"
                  className="font-medium text-slate-900 hover:text-emerald-600 transition"
                >
                  vishwas@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-400">Direct:</span>
                <a
                  href="tel:+9197297XXXXX"
                  className="font-medium text-slate-900 hover:text-emerald-600 transition"
                >
                  +91 97297 XXXXX
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Trust & Compliance Badges (Pushed to the Right) */}
          <div className="space-y-4 md:text-left lg:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Trust & Legal Compliance
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Indian Contract Act, 1872 Compliant</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Immutable & Tamper-Evident Records</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>256-Bit Encrypted Data & Privacy First</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Spacious Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p className="font-medium text-slate-600">
            &copy; 2026 Vishwas. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-slate-500 text-xs">
            <span className="hover:text-slate-900 cursor-pointer transition">
              Privacy Policy
            </span>
            <span>&bull;</span>
            <span className="hover:text-slate-900 cursor-pointer transition">
              Terms of Agreement
            </span>
            <span>&bull;</span>
            <span className="hover:text-slate-900 cursor-pointer transition">
              Dispute Resolution
            </span>
            <span>&bull;</span>
            <span className="hover:text-slate-900 cursor-pointer transition">
              Help Center
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
