import React from 'react';
import { Plus, Search, Scissors, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ShopSettings } from '../types/order';

interface HeaderProps {
  settings: ShopSettings;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onNewOrder: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewOrder,
  onOpenSettings,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#191919]/95 backdrop-blur-sm border-b border-neutral-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        
        {/* Brand & Mobile Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300 shrink-0">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-100">
                  {settings.shopName}
                </h1>
                <span className="text-[10px] text-neutral-400 px-1.5 py-0.2 rounded bg-neutral-800 border border-neutral-700/50">
                  Atelier
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mobile "New Order" button */}
          <button
            onClick={onNewOrder}
            className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-white text-neutral-900 font-medium text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>
        </div>

        {/* Search, Filter & Settings */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search customer, hotel, order #..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#222222] border border-neutral-800 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-md bg-[#222222] border border-neutral-800 text-neutral-300 focus:outline-none focus:border-neutral-600 cursor-pointer shrink-0"
          >
            <option value="all">All</option>
            <option value="fittings">🧵 In Fitting</option>
            <option value="finished">✨ Finished</option>
            <option value="unpaid">💰 Unpaid</option>
            <option value="delivered">📦 Delivered</option>
          </select>

          {/* Settings & Reset */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenSettings}
              title="Shop & Unit Settings"
              className="p-1.5 rounded-md bg-[#222222] border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-1.5 rounded-md bg-[#222222] border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Create Order button (Desktop / Tablet) */}
          <button
            onClick={onNewOrder}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-white text-neutral-900 font-medium text-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>
        </div>

      </div>
    </header>
  );
};
