import React, { useState } from 'react';
import { Order, GarmentItem, StandardGarment, ShopSettings } from '../types/order';
import { X, Trash2, Check, MessageSquare, Calendar } from 'lucide-react';
import { getDaysLeft } from '../utils/dateUtils';

interface DatePickerInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  daysBadge?: { text: string; isUrgent: boolean } | null;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  daysBadge,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    const el = inputRef.current as any;
    if (!el) return;
    try {
      if (typeof el.showPicker === 'function') {
        el.showPicker();
      } else {
        el.focus();
      }
    } catch {
      el.focus();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-neutral-400">{label}</label>
        {daysBadge && (
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
            {daysBadge.text}
          </span>
        )}
      </div>
      <div
        onClick={handleOpenPicker}
        className="relative flex items-center bg-[#2a2a2a] border border-neutral-700/80 rounded-md hover:border-neutral-600 focus-within:border-neutral-500 transition-colors cursor-pointer group"
      >
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-3 pr-8 py-1.5 text-xs bg-transparent text-neutral-100 focus:outline-none cursor-pointer"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPicker();
          }}
          className="absolute right-2 p-1 text-neutral-400 group-hover:text-neutral-200 transition-colors"
          title="Open calendar"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface OrderFormModalProps {
  order?: Order | null;
  nextOrderNumber: string;
  settings: ShopSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
}

const PRESET_GARMENTS: StandardGarment[] = [
  'Suit', 'Pant', 'Jacket', 'Coat', 'Vest', 'Shirt', 'Tie', 'Blouse', 'Skirt', 'Dress'
];

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  order,
  nextOrderNumber,
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // Active measurement category tab
  const [activeTab, setActiveTab] = useState<'shirt' | 'pant' | 'jacket'>('jacket');

  // Form states
  const [orderNumber, setOrderNumber] = useState(order?.orderNumber || nextOrderNumber);
  const [date, setDate] = useState(order?.date || new Date().toISOString().split('T')[0]);
  const [fittingStage, setFittingStage] = useState<1 | 2 | 3>(order?.fittingStage || 1);
  const [status, setStatus] = useState(order?.status || 'fitting1');
  const [fittingDate, setFittingDate] = useState(order?.fittingDate || '');
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate || '');
  const [specialRequest, setSpecialRequest] = useState(order?.specialRequest || '');

  // Customer State
  const [customer, setCustomer] = useState({
    name: order?.customer.name || '',
    gender: order?.customer.gender || 'male',
    hotel: order?.customer.hotel || '',
    room: order?.customer.room || '',
    phone: order?.customer.phone || '',
    email: order?.customer.email || '',
    address: order?.customer.address || '',
  });

  // Ordered Items
  const [items, setItems] = useState<GarmentItem[]>(
    order?.items?.length
      ? order.items
      : [{ id: '1', name: 'Suit', quantity: 1, price: 0 }]
  );

  // Financials
  const [deposit, setDeposit] = useState<number>(order?.deposit || 0);

  // Measurements
  const [shirt, setShirt] = useState(order?.shirt || {});
  const [pantSkirt, setPantSkirt] = useState(order?.pantSkirt || {});
  const [jacketCoatVest, setJacketCoatVest] = useState(order?.jacketCoatVest || {});
  const [fabricNotes, setFabricNotes] = useState(order?.fabricNotes || '');

  // Dynamic calculations
  const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price) || 0), 0);
  const balance = Math.max(0, total - Number(deposit));

  // Days left calculation
  const fittingDays = getDaysLeft(fittingDate);
  const deliveryDays = getDaysLeft(deliveryDate);

  // Handlers for Items
  const handleAddItem = (garmentName: string) => {
    const newItem: GarmentItem = {
      id: Date.now().toString(),
      name: garmentName,
      quantity: 1,
      price: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: 'name' | 'quantity' | 'price', value: any) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      alert('Please enter customer name');
      return;
    }

    const payload: Order = {
      id: order?.id || `ord-${Date.now()}`,
      orderNumber: orderNumber.trim() || nextOrderNumber,
      date,
      fittingStage,
      status,
      customer: {
        ...customer,
        name: customer.name.trim(),
      },
      items,
      total,
      deposit: Number(deposit),
      balance,
      shirt,
      pantSkirt,
      jacketCoatVest,
      specialRequest: specialRequest.trim(),
      fabricNotes,
      fittingDate,
      deliveryDate,
      createdAt: order?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-black/80 backdrop-blur-sm sm:p-4 overflow-hidden">
      <div className="bg-[#202020] border-0 sm:border sm:border-neutral-800 rounded-none sm:rounded-xl w-full sm:max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-100">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-safe pb-3 sm:py-3 bg-[#242424] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2a2a2a] border border-neutral-700 text-neutral-300 text-xs font-mono">
              <span className="text-neutral-500">#</span>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                className="bg-transparent text-neutral-100 font-semibold w-16 focus:outline-none focus:border-b border-neutral-500"
                placeholder="1834"
              />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-neutral-100">
              {order ? 'Edit Order' : 'New Order'}
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
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 overscroll-contain">
          
          {/* 1. Header Metadata & Fitting Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#252525] p-3 rounded-lg border border-neutral-800">
            <DatePickerInput
              label="📅 Order Date"
              value={date}
              onChange={setDate}
            />

            <div>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                🧵 Fitting Stage
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(stage => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => {
                      setFittingStage(stage as 1 | 2 | 3);
                      setStatus(stage === 1 ? 'fitting1' : stage === 2 ? 'fitting2' : 'fitting3');
                    }}
                    className={`flex-1 py-1.5 text-xs rounded-md border transition-all ${
                      fittingStage === stage
                        ? 'bg-neutral-100 text-neutral-900 font-semibold border-white'
                        : 'bg-[#2a2a2a] text-neutral-400 border-neutral-700/80 hover:text-neutral-200'
                    }`}
                  >
                    Stage {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                🏷️ Order Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-200 focus:outline-none focus:border-neutral-500"
              >
                <option value="fitting1">🧵 1st Fitting</option>
                <option value="fitting2">🪡 2nd Fitting</option>
                <option value="fitting3">✂️ 3rd Fitting</option>
                <option value="finished">✨ Finished / Ready</option>
                <option value="delivered">📦 Delivered</option>
              </select>
            </div>
          </div>

          {/* 2. Customer Information */}
          <div className="bg-[#252525] p-3 sm:p-4 rounded-lg border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span>👤</span> Customer Details
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 text-neutral-300 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={customer.gender === 'male'}
                    onChange={() => setCustomer(prev => ({ ...prev, gender: 'male' }))}
                    className="accent-neutral-200"
                  />
                  <span>👨 Male</span>
                </label>
                <label className="flex items-center gap-1 text-neutral-300 cursor-pointer ml-1.5">
                  <input
                    type="radio"
                    name="gender"
                    checked={customer.gender === 'female'}
                    onChange={() => setCustomer(prev => ({ ...prev, gender: 'female' }))}
                    className="accent-neutral-200"
                  />
                  <span>👩 Female</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-1">
                <label className="text-[11px] text-neutral-400 block mb-0.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
                  value={customer.name}
                  onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">🏨 Hotel</label>
                <input
                  type="text"
                  placeholder="e.g. Landmark Bangkok"
                  value={customer.hotel}
                  onChange={e => setCustomer(prev => ({ ...prev, hotel: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">🚪 Room No.</label>
                <input
                  type="text"
                  placeholder="e.g. 1824"
                  value={customer.room}
                  onChange={e => setCustomer(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">📞 Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="e.g. +66 81 234 5678"
                  value={customer.phone}
                  onChange={e => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">✉️ Email</label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={customer.email}
                  onChange={e => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">📍 Address</label>
                <input
                  type="text"
                  placeholder="e.g. London, UK"
                  value={customer.address}
                  onChange={e => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Ordered Items & Pricing */}
          <div className="bg-[#252525] p-3 sm:p-4 rounded-lg border border-neutral-800 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span>✂️</span> Ordered Items & Pricing
              </h3>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-neutral-500 mr-1">Quick Add:</span>
                {PRESET_GARMENTS.slice(0, 6).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleAddItem(g)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60"
                  >
                    +{g}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full text-left text-xs min-w-[320px]">
                <thead>
                  <tr className="text-neutral-400 border-b border-neutral-800 text-[11px]">
                    <th className="pb-1.5 font-medium">ITEM</th>
                    <th className="pb-1.5 font-medium w-16 sm:w-20 text-center">QTY</th>
                    <th className="pb-1.5 font-medium w-24 sm:w-28 text-right">PRICE ({settings.currency})</th>
                    <th className="pb-1.5 font-medium w-24 sm:w-28 text-right">TOTAL</th>
                    <th className="pb-1.5 w-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="py-1.5 pr-1">
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => handleUpdateItem(item.id, 'name', e.target.value)}
                          placeholder="e.g. Suit"
                          className="w-full px-2 py-1 text-xs rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:outline-none focus:border-neutral-500"
                        />
                      </td>
                      <td className="py-1.5 px-1 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className="w-12 sm:w-16 text-center px-1 py-1 text-xs rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:outline-none focus:border-neutral-500"
                        />
                      </td>
                      <td className="py-1.5 px-1 text-right">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.price || ''}
                          onChange={e => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-20 sm:w-24 text-right px-2 py-1 text-xs rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:outline-none focus:border-neutral-500 font-mono"
                        />
                      </td>
                      <td className="py-1.5 pl-1 text-right font-mono font-medium text-neutral-200">
                        {settings.currency} {(item.quantity * item.price).toLocaleString()}
                      </td>
                      <td className="py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="pt-2.5 border-t border-neutral-800 flex flex-wrap items-center justify-end gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Total:</span>
                <span className="font-mono font-semibold text-neutral-100">
                  {settings.currency} {total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Deposit:</span>
                <input
                  type="number"
                  min="0"
                  value={deposit || ''}
                  onChange={e => setDeposit(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 text-right px-2 py-0.5 text-xs rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-200 focus:outline-none focus:border-neutral-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                <span className="text-neutral-400">Balance:</span>
                <span className="font-mono font-bold text-neutral-100">
                  {settings.currency} {balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Measurements Cards */}
          <div className="bg-[#252525] p-3 sm:p-4 rounded-lg border border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span>📏</span> Garment Measurements ({settings.unit})
              </h3>

              {/* Tab Selector */}
              <div className="flex items-center bg-[#2a2a2a] p-0.5 rounded-md border border-neutral-700/70 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('jacket')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all shrink-0 ${
                    activeTab === 'jacket'
                      ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>🧥</span> Jacket / Coat / Vest
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pant')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all shrink-0 ${
                    activeTab === 'pant'
                      ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>👖</span> Pant & Skirt
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shirt')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all shrink-0 ${
                    activeTab === 'shirt'
                      ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>👔</span> Shirt
                </button>
              </div>
            </div>

            {/* Tab 1: Jacket */}
            {activeTab === 'jacket' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in duration-100">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Neck (คอ)</label>
                  <input
                    type="text"
                    placeholder="16.5"
                    value={jacketCoatVest.neck || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, neck: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Chest (อก)</label>
                  <input
                    type="text"
                    placeholder="41.5"
                    value={jacketCoatVest.chest || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, chest: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Sh-Chest (ไหล่-อก)</label>
                  <input
                    type="text"
                    placeholder="11"
                    value={jacketCoatVest.shoulderToChest || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, shoulderToChest: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Bust Span (อกห่าง)</label>
                  <input
                    type="text"
                    placeholder="9"
                    value={jacketCoatVest.bustSpan || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, bustSpan: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Waist (เอว)</label>
                  <input
                    type="text"
                    placeholder="35.5"
                    value={jacketCoatVest.waist || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, waist: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Sh-Waist (ไหล่-เอว)</label>
                  <input
                    type="text"
                    placeholder="18.5"
                    value={jacketCoatVest.shoulderToWaist || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, shoulderToWaist: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Hips (สะโพก)</label>
                  <input
                    type="text"
                    placeholder="42"
                    value={jacketCoatVest.hips || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, hips: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Shoulders (ไหล่)</label>
                  <input
                    type="text"
                    placeholder="19"
                    value={jacketCoatVest.shoulders || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, shoulders: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Arm (R) (แขน ขวา)</label>
                  <input
                    type="text"
                    placeholder="25.5"
                    value={jacketCoatVest.armRight || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, armRight: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Arm (L) (แขน ซ้าย)</label>
                  <input
                    type="text"
                    placeholder="25.5"
                    value={jacketCoatVest.armLeft || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, armLeft: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Front (บ่าหน้า)</label>
                  <input
                    type="text"
                    placeholder="17.5"
                    value={jacketCoatVest.frontChest || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, frontChest: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Back (บ่าหลัง)</label>
                  <input
                    type="text"
                    placeholder="18"
                    value={jacketCoatVest.back || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, back: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Jacket Length (ยาว)</label>
                  <input
                    type="text"
                    placeholder="30"
                    value={jacketCoatVest.length || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Vest Length (ยาวเสื้อกั๊ก)</label>
                  <input
                    type="text"
                    placeholder="24"
                    value={jacketCoatVest.vestLength || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, vestLength: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Coat Length (ยาวเสื้อโค้ต)</label>
                  <input
                    type="text"
                    placeholder="38"
                    value={jacketCoatVest.coatLength || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, coatLength: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Style / Lapel</label>
                  <input
                    type="text"
                    placeholder="Peak lapel, 2 button"
                    value={jacketCoatVest.notes || ''}
                    onChange={e => setJacketCoatVest(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Pants */}
            {activeTab === 'pant' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in duration-100">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Waist (เอว)</label>
                  <input
                    type="text"
                    placeholder="34"
                    value={pantSkirt.waist || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, waist: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Hips (สะโพก)</label>
                  <input
                    type="text"
                    placeholder="41.5"
                    value={pantSkirt.hips || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, hips: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Crotch (เป้า)</label>
                  <input
                    type="text"
                    placeholder="26"
                    value={pantSkirt.crotch || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, crotch: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Thigh (ต้นขา)</label>
                  <input
                    type="text"
                    placeholder="25"
                    value={pantSkirt.thigh || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, thigh: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Length (ยาว)</label>
                  <input
                    type="text"
                    placeholder="41"
                    value={pantSkirt.length || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Bottom (ปลายขา)</label>
                  <input
                    type="text"
                    placeholder="15.5"
                    value={pantSkirt.bottom || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, bottom: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Skirt Length (ยาวกระโปรง)</label>
                  <input
                    type="text"
                    placeholder="24"
                    value={pantSkirt.skirtLength || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, skirtLength: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Short Pant (ขาสั้น)</label>
                  <input
                    type="text"
                    placeholder="18"
                    value={pantSkirt.shortPant || ''}
                    onChange={e => setPantSkirt(prev => ({ ...prev, shortPant: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Shirt */}
            {activeTab === 'shirt' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in duration-100">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Neck (คอ)</label>
                  <input
                    type="text"
                    placeholder="16.5"
                    value={shirt.neck || ''}
                    onChange={e => setShirt(prev => ({ ...prev, neck: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Chest (อก)</label>
                  <input
                    type="text"
                    placeholder="41"
                    value={shirt.chest || ''}
                    onChange={e => setShirt(prev => ({ ...prev, chest: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Sh-Chest (ไหล่-อก)</label>
                  <input
                    type="text"
                    placeholder="10.5"
                    value={shirt.shoulderToChest || ''}
                    onChange={e => setShirt(prev => ({ ...prev, shoulderToChest: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Bust Span (อกห่าง)</label>
                  <input
                    type="text"
                    placeholder="8.5"
                    value={shirt.bustSpan || ''}
                    onChange={e => setShirt(prev => ({ ...prev, bustSpan: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Waist (เอว)</label>
                  <input
                    type="text"
                    placeholder="35"
                    value={shirt.waist || ''}
                    onChange={e => setShirt(prev => ({ ...prev, waist: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Sh-Waist (ไหล่-เอว)</label>
                  <input
                    type="text"
                    placeholder="18"
                    value={shirt.shoulderToWaist || ''}
                    onChange={e => setShirt(prev => ({ ...prev, shoulderToWaist: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Hips (สะโพก)</label>
                  <input
                    type="text"
                    placeholder="42"
                    value={shirt.hips || ''}
                    onChange={e => setShirt(prev => ({ ...prev, hips: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Shoulders (ไหล่)</label>
                  <input
                    type="text"
                    placeholder="18.5"
                    value={shirt.shoulders || ''}
                    onChange={e => setShirt(prev => ({ ...prev, shoulders: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Arm (R) (แขน ขวา)</label>
                  <input
                    type="text"
                    placeholder="25.5"
                    value={shirt.armRight || ''}
                    onChange={e => setShirt(prev => ({ ...prev, armRight: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Arm (L) (แขน ซ้าย)</label>
                  <input
                    type="text"
                    placeholder="25.5"
                    value={shirt.armLeft || ''}
                    onChange={e => setShirt(prev => ({ ...prev, armLeft: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Shirt Length (ยาว)</label>
                  <input
                    type="text"
                    placeholder="31"
                    value={shirt.length || ''}
                    onChange={e => setShirt(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-0.5">Short Sleeve (แขนสั้น)</label>
                  <input
                    type="text"
                    placeholder="10"
                    value={shirt.shortSleeves || ''}
                    onChange={e => setShirt(prev => ({ ...prev, shortSleeves: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 font-mono text-xs focus:border-neutral-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Schedule, Fabric Swatch & Special Customer Request (Down Below) */}
          <div className="bg-[#252525] p-3 sm:p-4 rounded-lg border border-neutral-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <DatePickerInput
                label="🧵 Trial Fitting Date"
                value={fittingDate}
                onChange={setFittingDate}
                daysBadge={fittingDays}
              />

              <DatePickerInput
                label="📦 Final Delivery Date"
                value={deliveryDate}
                onChange={setDeliveryDate}
                daysBadge={deliveryDays}
              />

              <div>
                <label className="text-[11px] text-neutral-400 font-medium block mb-1">🧵 Fabric Roll / Swatch</label>
                <input
                  type="text"
                  placeholder="e.g. Italian Navy 130s (Roll #NV-884)"
                  value={fabricNotes}
                  onChange={e => setFabricNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            {/* Special Request by Customer (shown DOWN BELOW in Edit/New mode) */}
            <div className="pt-2 border-t border-neutral-800 space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                <span>Special Request by Customer</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Deliver to hotel lobby before 4 PM. Extra soft shoulder pads. Hidden passport pocket in lining..."
                value={specialRequest}
                onChange={e => setSpecialRequest(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#2a2a2a] border border-neutral-700/80 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-4 py-3 sm:py-2.5 pb-safe border-t border-neutral-800 flex items-center justify-end gap-2 bg-[#202020] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 sm:py-1.5 text-xs font-medium rounded-md bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 sm:py-1.5 text-xs font-medium rounded-md bg-neutral-100 hover:bg-white text-neutral-900 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{order ? 'Save Changes' : 'Create Order'}</span>
          </button>
        </div>

      </form>

      </div>
    </div>
  );
};
