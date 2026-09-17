import React from 'react';
import { Order, ShopSettings } from '../types/order';

interface StatsSummaryProps {
  orders: Order[];
  settings: ShopSettings;
  activeFilter: string;
  onFilterSelect: (filterKey: string) => void;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  orders,
  settings,
  activeFilter,
  onFilterSelect,
}) => {
  const totalOrders = orders.length;
  const inFitting = orders.filter(
    o => o.status === 'fitting1' || o.status === 'fitting2' || o.status === 'fitting3'
  ).length;
  const readyCount = orders.filter(o => o.status === 'finished').length;
  const unpaidCount = orders.filter(o => (o.balance || 0) > 0 && o.status !== 'delivered').length;
  const totalBalanceDue = orders
    .filter(o => o.status !== 'delivered')
    .reduce((sum, o) => sum + (o.balance || 0), 0);

  const formatMoney = (amount: number) => {
    return `${settings.currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 my-4 sm:my-5">
      
      {/* 1. Total Orders Card */}
      <button
        type="button"
        onClick={() => onFilterSelect('all')}
        className={`text-left rounded-lg p-3 transition-all cursor-pointer border ${
          activeFilter === 'all'
            ? 'bg-neutral-800 border-neutral-600'
            : 'bg-[#202020] border-neutral-800/90 hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-1">
          <span>📋</span>
          <span className="truncate">Total Orders</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-semibold text-neutral-100">
            {totalOrders}
          </span>
          {activeFilter === 'all' && (
            <span className="text-[10px] text-neutral-400 hidden sm:inline">· Active</span>
          )}
        </div>
      </button>

      {/* 2. Fittings Needed Card */}
      <button
        type="button"
        onClick={() => onFilterSelect('fittings')}
        className={`text-left rounded-lg p-3 transition-all cursor-pointer border ${
          activeFilter === 'fittings'
            ? 'bg-neutral-800 border-neutral-600'
            : 'bg-[#202020] border-neutral-800/90 hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-1">
          <span>🧵</span>
          <span className="truncate">In Fitting</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-semibold text-neutral-100">
            {inFitting}
          </span>
          <span className="text-[10px] text-neutral-500 hidden sm:inline">pending</span>
        </div>
      </button>

      {/* 3. Ready for Pickup Card */}
      <button
        type="button"
        onClick={() => onFilterSelect('finished')}
        className={`text-left rounded-lg p-3 transition-all cursor-pointer border ${
          activeFilter === 'finished'
            ? 'bg-neutral-800 border-neutral-600'
            : 'bg-[#202020] border-neutral-800/90 hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-1">
          <span>✨</span>
          <span className="truncate">Ready Pickup</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-semibold text-neutral-100">
            {readyCount}
          </span>
          <span className="text-[10px] text-neutral-500 hidden sm:inline">ready</span>
        </div>
      </button>

      {/* 4. Balance Due Card */}
      <button
        type="button"
        onClick={() => onFilterSelect('unpaid')}
        className={`text-left rounded-lg p-3 transition-all cursor-pointer border ${
          activeFilter === 'unpaid'
            ? 'bg-neutral-800 border-neutral-600'
            : 'bg-[#202020] border-neutral-800/90 hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-1">
          <span>💰</span>
          <span className="truncate">Balance Due ({unpaidCount})</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-semibold font-mono text-neutral-100 truncate">
            {formatMoney(totalBalanceDue)}
          </span>
        </div>
      </button>

    </div>
  );
};
