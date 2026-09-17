import React from 'react';
import { Order, ShopSettings } from '../types/order';
import { X, Printer, Edit3, Hotel, Phone, Mail, MapPin, Calendar, Clock, MessageSquare } from 'lucide-react';
import { getDaysLeft } from '../utils/dateUtils';

interface OrderDetailModalProps {
  order: Order | null;
  settings: ShopSettings;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (order: Order) => void;
  onPrint: (order: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  settings,
  isOpen,
  onClose,
  onEdit,
  onPrint,
}) => {
  if (!isOpen || !order) return null;

  const fittingDays = getDaysLeft(order.fittingDate);
  const deliveryDays = getDaysLeft(order.deliveryDate);

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-black/80 backdrop-blur-sm sm:p-4 overflow-hidden">
      <div className="bg-[#202020] border-0 sm:border sm:border-neutral-800 rounded-none sm:rounded-xl w-full sm:max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-100">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 pt-safe pb-3 sm:py-3 bg-[#242424] border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-neutral-200 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 shrink-0">
              #{order.orderNumber}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-semibold text-neutral-100 tracking-tight truncate">
                  {order.customer.name}
                </h2>
                <span className="text-xs">
                  {order.customer.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
                <Calendar className="w-3 h-3 text-neutral-500 shrink-0" />
                <span>{order.date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onPrint(order)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(order);
              }}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 pb-safe overscroll-contain">
          
          {/* Customer & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-[#252525] p-3 rounded-lg border border-neutral-800 text-xs">
            {(order.customer.hotel || order.customer.room) && (
              <div className="flex items-start gap-2">
                <Hotel className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-medium">Hotel / Room</p>
                  <p className="font-medium text-neutral-200">
                    {order.customer.hotel || 'Hotel'} {order.customer.room ? `· Rm ${order.customer.room}` : ''}
                  </p>
                </div>
              </div>
            )}

            {order.customer.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-medium">Phone</p>
                  <p className="font-medium text-neutral-200">{order.customer.phone}</p>
                </div>
              </div>
            )}

            {order.customer.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-medium">Email</p>
                  <p className="font-medium text-neutral-200 truncate">{order.customer.email}</p>
                </div>
              </div>
            )}

            {order.customer.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-medium">Address</p>
                  <p className="font-medium text-neutral-200">{order.customer.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Schedule & Days Left Box */}
          {(order.fittingDate || order.deliveryDate) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#252525] p-3 rounded-lg border border-neutral-800">
              {order.fittingDate && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-medium block">Trial Fitting</span>
                      <span className="font-medium text-neutral-200">{order.fittingDate}</span>
                    </div>
                  </div>
                  {fittingDays && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {fittingDays.text}
                    </span>
                  )}
                </div>
              )}

              {order.deliveryDate && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📦</span>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-medium block">Final Delivery</span>
                      <span className="font-medium text-neutral-200">{order.deliveryDate}</span>
                    </div>
                  </div>
                  {deliveryDays && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {deliveryDays.text}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Special Request by Customer (shown ABOVE in View Mode) */}
          {Boolean(order.specialRequest?.trim()) && (
            <div className="bg-[#262626] border border-neutral-700/80 p-3 rounded-lg space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium text-[11px]">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                <span>Special Request by Customer:</span>
              </div>
              <p className="text-neutral-200 pl-5 leading-relaxed">
                "{order.specialRequest}"
              </p>
            </div>
          )}

          {/* Items & Payment Breakdown */}
          <div className="bg-[#252525] p-3 sm:p-4 rounded-lg border border-neutral-800 space-y-2.5">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Ordered Garments & Billing
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[300px]">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-[11px]">
                    <th className="pb-1.5">ITEM</th>
                    <th className="pb-1.5 text-center">QTY</th>
                    <th className="pb-1.5 text-right">PRICE</th>
                    <th className="pb-1.5 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium text-neutral-200">{item.name}</td>
                      <td className="py-2 text-center text-neutral-400 font-mono">{item.quantity}</td>
                      <td className="py-2 text-right text-neutral-400 font-mono">
                        {settings.currency} {item.price.toLocaleString()}
                      </td>
                      <td className="py-2 text-right font-mono font-medium text-neutral-100">
                        {settings.currency} {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2.5 border-t border-neutral-800 flex flex-wrap justify-end gap-4 text-xs font-mono">
              <div>
                <span className="text-neutral-400">Total: </span>
                <span className="font-semibold text-neutral-100">{settings.currency} {order.total.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-neutral-400">Deposit: </span>
                <span className="font-semibold text-neutral-300">{settings.currency} {order.deposit.toLocaleString()}</span>
              </div>
              <div className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                <span className="text-neutral-400">Balance: </span>
                <span className="font-bold text-neutral-100">{settings.currency} {order.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Measurements Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Bespoke Measurements ({settings.unit})
              </h3>
              <span className="text-[11px] text-neutral-500">Cutter Sheet</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* 1. Jacket */}
              <div className="bg-[#252525] border border-neutral-800 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-xs text-neutral-200 pb-1.5 border-b border-neutral-800 flex items-center gap-1">
                  <span>🧥</span> Jacket / Coat / Vest
                </h4>
                {order.jacketCoatVest && Object.values(order.jacketCoatVest).some(v => Boolean(v)) ? (
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px]">
                    {order.jacketCoatVest.neck && <div><span className="text-neutral-400">Neck:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.neck}</span></div>}
                    {order.jacketCoatVest.chest && <div><span className="text-neutral-400">Chest:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.chest}</span></div>}
                    {order.jacketCoatVest.shoulderToChest && <div><span className="text-neutral-400">Sh-Chest:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.shoulderToChest}</span></div>}
                    {order.jacketCoatVest.bustSpan && <div><span className="text-neutral-400">Bust Span:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.bustSpan}</span></div>}
                    {order.jacketCoatVest.waist && <div><span className="text-neutral-400">Waist:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.waist}</span></div>}
                    {order.jacketCoatVest.shoulderToWaist && <div><span className="text-neutral-400">Sh-Waist:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.shoulderToWaist}</span></div>}
                    {order.jacketCoatVest.hips && <div><span className="text-neutral-400">Hips:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.hips}</span></div>}
                    {order.jacketCoatVest.shoulders && <div><span className="text-neutral-400">Shoulders:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.shoulders}</span></div>}
                    {order.jacketCoatVest.armRight && <div><span className="text-neutral-400">Arm (R):</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.armRight}</span></div>}
                    {order.jacketCoatVest.armLeft && <div><span className="text-neutral-400">Arm (L):</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.armLeft}</span></div>}
                    {order.jacketCoatVest.frontChest && <div><span className="text-neutral-400">Front:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.frontChest}</span></div>}
                    {order.jacketCoatVest.back && <div><span className="text-neutral-400">Back:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.back}</span></div>}
                    {order.jacketCoatVest.length && <div><span className="text-neutral-400">Length:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.length}</span></div>}
                    {order.jacketCoatVest.vestLength && <div><span className="text-neutral-400">Vest L.:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.vestLength}</span></div>}
                    {order.jacketCoatVest.coatLength && <div><span className="text-neutral-400">Coat L.:</span> <span className="font-mono text-neutral-100 font-medium">{order.jacketCoatVest.coatLength}</span></div>}
                    {order.jacketCoatVest.notes && (
                      <div className="col-span-2 pt-1 border-t border-neutral-800 text-neutral-300 italic">
                        Style: {order.jacketCoatVest.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-xs italic">No measurements recorded</p>
                )}
              </div>

              {/* 2. Pant */}
              <div className="bg-[#252525] border border-neutral-800 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-xs text-neutral-200 pb-1.5 border-b border-neutral-800 flex items-center gap-1">
                  <span>👖</span> Pant & Skirt
                </h4>
                {order.pantSkirt && Object.values(order.pantSkirt).some(v => Boolean(v)) ? (
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px]">
                    {order.pantSkirt.waist && <div><span className="text-neutral-400">Waist:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.waist}</span></div>}
                    {order.pantSkirt.hips && <div><span className="text-neutral-400">Hips:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.hips}</span></div>}
                    {order.pantSkirt.crotch && <div><span className="text-neutral-400">Crotch:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.crotch}</span></div>}
                    {order.pantSkirt.thigh && <div><span className="text-neutral-400">Thigh:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.thigh}</span></div>}
                    {order.pantSkirt.length && <div><span className="text-neutral-400">Length:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.length}</span></div>}
                    {order.pantSkirt.bottom && <div><span className="text-neutral-400">Bottom:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.bottom}</span></div>}
                    {order.pantSkirt.skirtLength && <div><span className="text-neutral-400">Skirt L.:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.skirtLength}</span></div>}
                    {order.pantSkirt.shortPant && <div><span className="text-neutral-400">Short Pant:</span> <span className="font-mono text-neutral-100 font-medium">{order.pantSkirt.shortPant}</span></div>}
                    {order.pantSkirt.notes && (
                      <div className="col-span-2 pt-1 border-t border-neutral-800 text-neutral-300 italic">
                        Style: {order.pantSkirt.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-xs italic">No measurements recorded</p>
                )}
              </div>

              {/* 3. Shirt */}
              <div className="bg-[#252525] border border-neutral-800 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-xs text-neutral-200 pb-1.5 border-b border-neutral-800 flex items-center gap-1">
                  <span>👔</span> Shirt
                </h4>
                {order.shirt && Object.values(order.shirt).some(v => Boolean(v)) ? (
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px]">
                    {order.shirt.neck && <div><span className="text-neutral-400">Neck:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.neck}</span></div>}
                    {order.shirt.chest && <div><span className="text-neutral-400">Chest:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.chest}</span></div>}
                    {order.shirt.shoulderToChest && <div><span className="text-neutral-400">Sh-Chest:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.shoulderToChest}</span></div>}
                    {order.shirt.bustSpan && <div><span className="text-neutral-400">Bust Span:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.bustSpan}</span></div>}
                    {order.shirt.waist && <div><span className="text-neutral-400">Waist:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.waist}</span></div>}
                    {order.shirt.shoulderToWaist && <div><span className="text-neutral-400">Sh-Waist:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.shoulderToWaist}</span></div>}
                    {order.shirt.hips && <div><span className="text-neutral-400">Hips:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.hips}</span></div>}
                    {order.shirt.shoulders && <div><span className="text-neutral-400">Shoulders:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.shoulders}</span></div>}
                    {order.shirt.armRight && <div><span className="text-neutral-400">Arm (R):</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.armRight}</span></div>}
                    {order.shirt.armLeft && <div><span className="text-neutral-400">Arm (L):</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.armLeft}</span></div>}
                    {order.shirt.frontChest && <div><span className="text-neutral-400">Front:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.frontChest}</span></div>}
                    {order.shirt.back && <div><span className="text-neutral-400">Back:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.back}</span></div>}
                    {order.shirt.length && <div><span className="text-neutral-400">Length:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.length}</span></div>}
                    {order.shirt.shortSleeves && <div><span className="text-neutral-400">Short Slv:</span> <span className="font-mono text-neutral-100 font-medium">{order.shirt.shortSleeves}</span></div>}
                    {order.shirt.notes && (
                      <div className="col-span-2 pt-1 border-t border-neutral-800 text-neutral-300 italic">
                        Style: {order.shirt.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-xs italic">No measurements recorded</p>
                )}
              </div>
            </div>
          </div>

          {/* Fabric & Swatch Details */}
          {order.fabricNotes && (
            <div className="bg-[#252525] p-3 rounded-lg border border-neutral-800 text-xs text-neutral-300">
              <span className="font-medium text-neutral-400 uppercase text-[10px] block mb-1">
                🧵 Fabric & Swatch:
              </span>
              {order.fabricNotes}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
