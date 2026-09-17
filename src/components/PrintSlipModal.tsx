import React from 'react';
import { Order, ShopSettings } from '../types/order';
import { X, Printer } from 'lucide-react';
import { getDaysLeft } from '../utils/dateUtils';

interface PrintSlipModalProps {
  order: Order | null;
  settings: ShopSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  order,
  settings,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const fittingDays = getDaysLeft(order.fittingDate);
  const deliveryDays = getDaysLeft(order.deliveryDate);

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-black/80 backdrop-blur-sm sm:p-4 overflow-hidden">
      <div className="bg-[#202020] border-0 sm:border sm:border-neutral-800 rounded-none sm:rounded-xl w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-100">
        
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print px-4 sm:px-6 pt-safe pb-3 sm:py-3 bg-[#242424] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Print Preview:</span>
            <span className="text-xs font-semibold text-neutral-200">Order #{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-medium transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 bg-[#161616] flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 p-5 sm:p-8 shadow-xl border border-slate-300 rounded-sm font-sans text-xs print:p-0 print:border-none print:shadow-none">
            
            {/* Header / Brand & Normal Order Number */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900">
                  {settings.shopName || 'MFA BESPOKE TAILORS'}
                </h1>
                <p className="text-[10px] text-slate-600 tracking-wider uppercase">
                  Custom Hand-Tailored Suits · Shirts · Dresses
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {settings.address} · Tel: {settings.phone}
                </p>
              </div>

              <div className="text-right">
                {/* Clean Normal Looking Order Number */}
                <div className="text-lg font-bold text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1 inline-block rounded">
                  Order #{order.orderNumber}
                </div>
                <div className="mt-1 flex items-center justify-end gap-1.5 text-[11px] font-semibold text-slate-700">
                  <span>Fitting:</span>
                  <span className={`px-1.5 rounded border ${order.fittingStage === 1 ? 'bg-slate-900 text-white' : 'border-slate-400'}`}>1</span>
                  <span className={`px-1.5 rounded border ${order.fittingStage === 2 ? 'bg-slate-900 text-white' : 'border-slate-400'}`}>2</span>
                  <span className={`px-1.5 rounded border ${order.fittingStage === 3 ? 'bg-slate-900 text-white' : 'border-slate-400'}`}>3</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Date: <strong>{order.date}</strong>
                </p>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="my-3 py-2 border-b border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Name</span>
                <strong className="text-slate-900">{order.customer.name} ({order.customer.gender === 'female' ? 'Female' : 'Male'})</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Hotel / Room</span>
                <strong className="text-slate-900">
                  {order.customer.hotel || '-'} {order.customer.room ? `· Rm ${order.customer.room}` : ''}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Phone / Tel</span>
                <strong className="text-slate-900">{order.customer.phone || '-'}</strong>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] block">Email</span>
                <span className="text-slate-900 truncate block">{order.customer.email || '-'}</span>
              </div>
            </div>

            {/* Customer Special Request if present */}
            {order.specialRequest && (
              <div className="mb-3 p-2 bg-amber-50/70 border border-amber-200 rounded text-[10px] text-amber-950">
                <strong>Special Request:</strong> {order.specialRequest}
              </div>
            )}

            {/* Split layout: Items on Left, Measurements on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
              
              {/* Left Column: Items & Payment */}
              <div className="md:col-span-5 border-r md:border-slate-300 pr-3 space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
                  Ordered Items & Billing
                </h3>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-600 text-[10px]">
                      <th className="pb-1">ITEM</th>
                      <th className="pb-1 text-center">QTY</th>
                      <th className="pb-1 text-right">PRICE</th>
                      <th className="pb-1 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1 font-medium">{item.name}</td>
                        <td className="py-1 text-center font-mono">{item.quantity}</td>
                        <td className="py-1 text-right font-mono">{item.price.toLocaleString()}</td>
                        <td className="py-1 text-right font-mono font-semibold">
                          {(item.quantity * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="border-t-2 border-slate-900 pt-2 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-bold">{settings.currency} {order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Deposit:</span>
                    <span className="font-bold">{settings.currency} {order.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-1 text-slate-900 font-bold text-xs">
                    <span>Balance Due:</span>
                    <span>{settings.currency} {order.balance.toLocaleString()}</span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-slate-50 p-2 border border-slate-200 rounded text-[10px] space-y-1 mt-3">
                  <div>
                    <strong>Fitting Date:</strong> {order.fittingDate || 'TBD'} {fittingDays && `(${fittingDays.text})`}
                  </div>
                  <div>
                    <strong>Delivery Date:</strong> {order.deliveryDate || 'TBD'} {deliveryDays && `(${deliveryDays.text})`}
                  </div>
                  {order.fabricNotes && (
                    <div className="pt-1 border-t border-slate-200 text-slate-700">
                      <strong>Fabric:</strong> {order.fabricNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Measurements (3 Cards) */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
                  Master Cutter Measurements ({settings.unit})
                </h3>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  
                  {/* Jacket */}
                  <div className="border border-slate-300 p-2 rounded bg-slate-50/50">
                    <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1 flex items-center justify-between">
                      <span>🧥 Jacket/Vest</span>
                    </div>
                    <div className="space-y-0.5">
                      <div>Neck: <strong>{order.jacketCoatVest?.neck || '-'}</strong></div>
                      <div>Chest: <strong>{order.jacketCoatVest?.chest || '-'}</strong></div>
                      <div>Sh-Chest: <strong>{order.jacketCoatVest?.shoulderToChest || '-'}</strong></div>
                      <div>Bust: <strong>{order.jacketCoatVest?.bustSpan || '-'}</strong></div>
                      <div>Waist: <strong>{order.jacketCoatVest?.waist || '-'}</strong></div>
                      <div>Sh-Waist: <strong>{order.jacketCoatVest?.shoulderToWaist || '-'}</strong></div>
                      <div>Hips: <strong>{order.jacketCoatVest?.hips || '-'}</strong></div>
                      <div>Shoulder: <strong>{order.jacketCoatVest?.shoulders || '-'}</strong></div>
                      <div>Arm (R): <strong>{order.jacketCoatVest?.armRight || '-'}</strong></div>
                      <div>Arm (L): <strong>{order.jacketCoatVest?.armLeft || '-'}</strong></div>
                      <div>Front: <strong>{order.jacketCoatVest?.frontChest || '-'}</strong></div>
                      <div>Back: <strong>{order.jacketCoatVest?.back || '-'}</strong></div>
                      <div>Length: <strong>{order.jacketCoatVest?.length || '-'}</strong></div>
                      <div>Vest L.: <strong>{order.jacketCoatVest?.vestLength || '-'}</strong></div>
                      <div>Coat L.: <strong>{order.jacketCoatVest?.coatLength || '-'}</strong></div>
                    </div>
                  </div>

                  {/* Pants */}
                  <div className="border border-slate-300 p-2 rounded bg-slate-50/50">
                    <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1 flex items-center justify-between">
                      <span>👖 Pant/Skirt</span>
                    </div>
                    <div className="space-y-0.5">
                      <div>Waist: <strong>{order.pantSkirt?.waist || '-'}</strong></div>
                      <div>Hips: <strong>{order.pantSkirt?.hips || '-'}</strong></div>
                      <div>Crotch: <strong>{order.pantSkirt?.crotch || '-'}</strong></div>
                      <div>Thigh: <strong>{order.pantSkirt?.thigh || '-'}</strong></div>
                      <div>Length: <strong>{order.pantSkirt?.length || '-'}</strong></div>
                      <div>Bottom: <strong>{order.pantSkirt?.bottom || '-'}</strong></div>
                      <div>Skirt L.: <strong>{order.pantSkirt?.skirtLength || '-'}</strong></div>
                      <div>Short Pant: <strong>{order.pantSkirt?.shortPant || '-'}</strong></div>
                    </div>
                  </div>

                  {/* Shirt */}
                  <div className="border border-slate-300 p-2 rounded bg-slate-50/50">
                    <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1 flex items-center justify-between">
                      <span>👔 Shirt</span>
                    </div>
                    <div className="space-y-0.5">
                      <div>Neck: <strong>{order.shirt?.neck || '-'}</strong></div>
                      <div>Chest: <strong>{order.shirt?.chest || '-'}</strong></div>
                      <div>Sh-Chest: <strong>{order.shirt?.shoulderToChest || '-'}</strong></div>
                      <div>Bust: <strong>{order.shirt?.bustSpan || '-'}</strong></div>
                      <div>Waist: <strong>{order.shirt?.waist || '-'}</strong></div>
                      <div>Sh-Waist: <strong>{order.shirt?.shoulderToWaist || '-'}</strong></div>
                      <div>Hips: <strong>{order.shirt?.hips || '-'}</strong></div>
                      <div>Shoulder: <strong>{order.shirt?.shoulders || '-'}</strong></div>
                      <div>Arm (R): <strong>{order.shirt?.armRight || '-'}</strong></div>
                      <div>Arm (L): <strong>{order.shirt?.armLeft || '-'}</strong></div>
                      <div>Front: <strong>{order.shirt?.frontChest || '-'}</strong></div>
                      <div>Back: <strong>{order.shirt?.back || '-'}</strong></div>
                      <div>Length: <strong>{order.shirt?.length || '-'}</strong></div>
                      <div>Short Slv: <strong>{order.shirt?.shortSleeves || '-'}</strong></div>
                    </div>
                  </div>

                </div>

                {/* Signature Row */}
                <div className="pt-6 mt-4 border-t border-slate-300 grid grid-cols-2 gap-4 text-[9px] text-slate-500">
                  <div>
                    <div className="border-b border-slate-400 pb-4 mb-1"></div>
                    <span>Customer Signature</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-4 mb-1"></div>
                    <span>Master Tailor</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
