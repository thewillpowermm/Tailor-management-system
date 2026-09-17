import React, { useState } from 'react';
import { ShopSettings } from '../types/order';
import { X, Save, Sliders, DollarSign, Ruler, Store } from 'lucide-react';

interface SettingsModalProps {
  settings: ShopSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ShopSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<ShopSettings>({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-black/80 backdrop-blur-sm sm:p-4 overflow-hidden">
      <div className="bg-[#202020] border-0 sm:border sm:border-neutral-800 rounded-none sm:rounded-xl w-full sm:max-w-md h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-100">
        
        {/* Header */}
        <div className="px-5 pt-safe pb-3.5 sm:py-3.5 bg-[#242424] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-100">
              Shop & Atelier Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto p-5 space-y-3.5 text-xs">
          
          <div className="space-y-3.5">
            <div>
              <label className="text-neutral-400 font-medium block mb-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-neutral-500" />
                <span>Shop Name</span>
              </label>
              <input
                type="text"
                value={form.shopName}
                onChange={e => setForm(prev => ({ ...prev, shopName: e.target.value }))}
                placeholder="e.g. MFA Bespoke Tailor"
                className="w-full px-3 py-1.5 rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 font-medium block mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Currency</span>
                </label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={e => setForm(prev => ({ ...prev, currency: e.target.value }))}
                  placeholder="$ or ฿"
                  className="w-full px-3 py-1.5 rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:border-neutral-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-neutral-400 font-medium block mb-1 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Unit</span>
                </label>
                <select
                  value={form.unit}
                  onChange={e => setForm(prev => ({ ...prev, unit: e.target.value as 'in' | 'cm' }))}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-200 focus:border-neutral-500 focus:outline-none"
                >
                  <option value="in">Inches (in)</option>
                  <option value="cm">Centimeters (cm)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+66 81 234 5678"
                className="w-full px-3 py-1.5 rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1">Shop Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Sukhumvit Soi 11, Bangkok"
                className="w-full px-3 py-1.5 rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 pb-safe border-t border-neutral-800 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-md bg-neutral-100 hover:bg-white text-neutral-900 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
