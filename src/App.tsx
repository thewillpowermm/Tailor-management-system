import React, { useState, useEffect } from 'react';
import { Order, ShopSettings } from './types/order';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { OrderCard } from './components/OrderCard';
import { OrderFormModal } from './components/OrderFormModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { SettingsModal } from './components/SettingsModal';
import { Plus, Inbox } from 'lucide-react';

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(storageService.getSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load orders on mount
  useEffect(() => {
    const loadedOrders = storageService.getOrders();
    setOrders(loadedOrders);
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter === 'fittings') {
      if (order.status !== 'fitting1' && order.status !== 'fitting2' && order.status !== 'fitting3') {
        return false;
      }
    } else if (statusFilter === 'finished') {
      if (order.status !== 'finished') return false;
    } else if (statusFilter === 'unpaid') {
      if ((order.balance || 0) <= 0 || order.status === 'delivered') return false;
    } else if (statusFilter === 'delivered') {
      if (order.status !== 'delivered') return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customer.name.toLowerCase().includes(q);
      const matchHotel = (order.customer.hotel || '').toLowerCase().includes(q);
      const matchRoom = (order.customer.room || '').toLowerCase().includes(q);
      const matchPhone = (order.customer.phone || '').toLowerCase().includes(q);
      const matchSpecial = (order.specialRequest || '').toLowerCase().includes(q);
      const matchItems = order.items.some(i => i.name.toLowerCase().includes(q));

      return matchNum || matchName || matchHotel || matchRoom || matchPhone || matchSpecial || matchItems;
    }

    return true;
  });

  // Action handlers
  const handleSaveOrder = (orderToSave: Order) => {
    storageService.saveOrder(orderToSave);
    setOrders(storageService.getOrders());
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    const target = orders.find(o => o.id === id);
    const confirmMsg = target 
      ? `Are you sure you want to delete order #${target.orderNumber} for ${target.customer.name}?` 
      : 'Delete this order?';

    if (window.confirm(confirmMsg)) {
      storageService.deleteOrder(id);
      setOrders(storageService.getOrders());
    }
  };

  const handleSaveSettings = (newSettings: ShopSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all orders back to initial sample records? Current data will be replaced.')) {
      storageService.resetToDefaultData();
      setOrders(storageService.getOrders());
      setSettings(storageService.getSettings());
      setStatusFilter('all');
    }
  };

  const nextOrderNumber = storageService.getNextOrderNumber();

  return (
    <div className="min-h-screen bg-[#191919] text-neutral-100 flex flex-col font-sans selection:bg-neutral-700 selection:text-white">
      
      {/* Top Header */}
      <Header
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewOrder={() => {
          setEditingOrder(null);
          setIsFormOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 pb-16">
        
        {/* Interactive Stats Cards */}
        <StatsSummary
          orders={orders}
          settings={settings}
          activeFilter={statusFilter}
          onFilterSelect={(filterKey) => setStatusFilter(filterKey)}
        />

        {/* Section Title & Subheader */}
        <div className="flex items-center justify-between mt-6 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-neutral-100 tracking-tight flex items-center gap-2">
              <span>Orders</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/60">
                {filteredOrders.length}
              </span>
            </h2>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs text-neutral-400 hover:text-white underline ml-1"
              >
                Clear filter
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setEditingOrder(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-medium text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Order #{nextOrderNumber}</span>
          </button>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                settings={settings}
                onView={ord => setDetailOrder(ord)}
                onEdit={ord => {
                  setEditingOrder(ord);
                  setIsFormOpen(true);
                }}
                onPrint={ord => setPrintOrder(ord)}
                onDelete={handleDeleteOrder}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-8 sm:mt-12 bg-[#202020] border border-neutral-800 rounded-lg p-8 sm:p-12 text-center max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400 mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-neutral-200 text-sm">No orders found</h3>
            <p className="text-xs text-neutral-400 mt-1 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try clearing your search or status filter.'
                : 'Get started by creating your first tailor order.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setEditingOrder(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Order</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-4 text-center text-xs text-neutral-500 px-4">
        <p className="flex flex-wrap items-center justify-center gap-1.5">
          <span>{settings.shopName}</span>
          <span>·</span>
          <span>Auto-Saved Locally</span>
          <span>·</span>
          <span>Cloud Ready</span>
        </p>
      </footer>

      {/* Modals */}
      <OrderFormModal
        isOpen={isFormOpen}
        order={editingOrder}
        nextOrderNumber={nextOrderNumber}
        settings={settings}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
      />

      <OrderDetailModal
        isOpen={Boolean(detailOrder)}
        order={detailOrder}
        settings={settings}
        onClose={() => setDetailOrder(null)}
        onEdit={ord => {
          setDetailOrder(null);
          setEditingOrder(ord);
          setIsFormOpen(true);
        }}
        onPrint={ord => {
          setDetailOrder(null);
          setPrintOrder(ord);
        }}
      />

      <PrintSlipModal
        isOpen={Boolean(printOrder)}
        order={printOrder}
        settings={settings}
        onClose={() => setPrintOrder(null)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

    </div>
  );
};

export default App;
