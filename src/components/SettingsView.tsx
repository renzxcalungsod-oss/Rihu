import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Store, ShieldCheck, Clock, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShopSettings } from '../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDatabase } = useApp();

  const [formData, setFormData] = useState<ShopSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <span>System & Shop Configuration</span>
        </h2>
        <p className="text-xs text-slate-500">Configure business identity, receipts, work order headers, and warranty terms</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shop Identity Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b pb-2 border-slate-100">
            <Store className="w-4 h-4 text-blue-600" />
            <span>Store Profile & Official Heading</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={formData.shop_name}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax Identification Number (TIN)</label>
              <input
                type="text"
                value={formData.tin_number}
                onChange={(e) => setFormData({ ...formData, tin_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Physical Store Address *</label>
            <input
              type="text"
              required
              value={formData.shop_address}
              onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Contact Number(s) *</label>
              <input
                type="text"
                required
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Support Email *</label>
              <input
                type="email"
                required
                value={formData.email_address}
                onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Operational & Warranty Policies */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b pb-2 border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Warranty Policies & Turnaround Estimates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Warranty Period</label>
              <input
                type="text"
                value={formData.default_warranty}
                onChange={(e) => setFormData({ ...formData, default_warranty: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Turnaround (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.default_estimated_duration_days}
                onChange={(e) => setFormData({ ...formData, default_estimated_duration_days: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Receipt Footer Note / Warranty Disclaimer</label>
            <textarea
              rows={2}
              value={formData.receipt_footer_note}
              onChange={(e) => setFormData({ ...formData, receipt_footer_note: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all settings and database records to initial seed?")) {
                resetDatabase();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database to Initial 200+ Records</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
