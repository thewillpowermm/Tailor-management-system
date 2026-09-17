import React from 'react';
import { Order, ShopSettings } from '../types/order';
import { Eye, Edit3, Printer, Trash2, Hotel, Phone, Calendar, MessageSquare, Clock } from 'lucide-react';
import { getDaysLeft } from '../utils/dateUtils';

interface OrderCardProps {
  order: Order;
  settings: ShopSettings;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onPrint: (order: Order) => void;
  onDelete: (id: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  settings,
  onView,
  onEdit,
  onPrint,
  onDelete,
}) => {
  const getStatusBadge = () => {
    switch (order.status) {
      case 'fitting1':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60">
            <span>🧵</span> 1st Fitting
          </span>
        );
      case 'fitting2':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60">
            <span>🪡</span> 2nd Fitting
          </span>
        );
      case 'fitting3':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60">
            <span>✂️</span> 3rd Fitting
          </span>
        );
      case 'finished':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700/60">
            <span>✨</span> Ready
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-800/60 text-neutral-400 border border-neutral-800">
            <span>📦</span> Delivered
          </span>
        );
    }
  };

  const hasShirt = order.shirt && Object.values(order.shirt).some(v => Boolean(v));
  const hasPant = order.pantSkirt && Object.values(order.pantSkirt).some(v => Boolean(v));
  const hasJacket = order.jacketCoatVest && Object.values(order.jacketCoatVest).some(v => Boolean(v));

  // Days left calculations
  const fittingDays = getDaysLeft(order.fittingDate);
  const deliveryDays = getDaysLeft(order.deliveryDate);

  return (
    <div
      onClick={() => onView(order)}
      className="group bg-[#202020] border border-neutral-800 hover:border-neutral-700 rounded-lg p-3.5 sm:p-4 transition-colors flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="text-neutral-200 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700/60">
              #{order.orderNumber}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Calendar className="w-3 h-3 text-neutral-500" />
              <span>{order.date}</span>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Customer Information */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">
              {order.customer.gender === 'female' ? '👩' : '👨'}
            </span>
            <h3 className="font-medium text-neutral-100 text-sm tracking-tight truncate">
              {order.customer.name}
            </h3>
          </div>

          {/* Hotel & Room */}
          {(order.customer.hotel || order.customer.room) && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-300">
              <Hotel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate">
                {order.customer.hotel}
                {order.customer.room ? ` · Rm ${order.customer.room}` : ''}
              </span>
            </div>
          )}

          {/* Phone */}
          {order.customer.phone && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
              <span>{order.customer.phone}</span>
            </div>
          )}
        </div>

        {/* Ordered Items Pills */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {order.items.map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] px-1.5 py-0.2 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700/50"
            >
              {item.quantity}x {item.name}
            </span>
          ))}
        </div>

        {/* Days Left Badges */}
        {(fittingDays || deliveryDays) && (
          <div className="mt-2.5 pt-2 border-t border-neutral-800/70 flex flex-wrap gap-1.5 text-[11px]">
            {fittingDays && order.status !== 'finished' && order.status !== 'delivered' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                <Clock className="w-3 h-3 text-neutral-400" />
                <span>Fitting: <strong>{fittingDays.text}</strong></span>
              </span>
            )}

            {deliveryDays && order.status !== 'delivered' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                <span>📦</span>
                <span>Delivery: <strong>{deliveryDays.text}</strong></span>
              </span>
            )}
          </div>
        )}

        {/* Special Request snippet strictly if non-empty */}
        {Boolean(order.specialRequest?.trim()) && (
          <div className="mt-2 px-2 py-1 rounded bg-neutral-800/70 border border-neutral-700/60 text-[11px] text-neutral-300 flex items-start gap-1.5">
            <MessageSquare className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 italic">{order.specialRequest}</span>
          </div>
        )}

        {/* Measurement Specs Tags */}
        <div className="mt-2.5 flex items-center gap-1 text-[10px] text-neutral-400">
          <span className="text-neutral-500">Specs:</span>
          {hasShirt && (
            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/50">
              👔 Shirt
            </span>
          )}
          {hasPant && (
            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/50">
              👖 Pant
            </span>
          )}
          {hasJacket && (
            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/50">
              🧥 Jacket
            </span>
          )}
          {!hasShirt && !hasPant && !hasJacket && (
            <span className="text-neutral-500 italic">None logged</span>
          )}
        </div>
      </div>

      {/* Footer: Financials & Action Buttons */}
      <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Balance</span>
          <span className="text-xs font-semibold font-mono text-neutral-200">
            {settings.currency} {order.balance.toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(order)}
            title="View Details"
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(order)}
            title="Edit Order"
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPrint(order)}
            title="Print Slip"
            className="p-1.5 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(order.id)}
            title="Delete Order"
            className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
