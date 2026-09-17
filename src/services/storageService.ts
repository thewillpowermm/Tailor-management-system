import { Order, ShopSettings } from '../types/order';
import { INITIAL_ORDERS, DEFAULT_SETTINGS } from './sampleData';

const ORDERS_KEY = 'mfa_tailor_orders_v1';
const SETTINGS_KEY = 'mfa_tailor_settings_v1';

export const storageService = {
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) {
        // Initialize with realistic sample data
        this.saveOrders(INITIAL_ORDERS);
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading orders from localStorage', e);
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  },

  saveOrder(order: Order): Order {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);

    const updatedOrder: Order = {
      ...order,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      orders[existingIndex] = updatedOrder;
    } else {
      updatedOrder.createdAt = new Date().toISOString();
      orders.unshift(updatedOrder);
    }

    this.saveOrders(orders);
    return updatedOrder;
  },

  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    if (filtered.length !== orders.length) {
      this.saveOrders(filtered);
      return true;
    }
    return false;
  },

  getNextOrderNumber(): string {
    const orders = this.getOrders();
    if (orders.length === 0) return '1837';
    
    // Find highest numeric order number
    const numbers = orders
      .map(o => parseInt(o.orderNumber.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));

    if (numbers.length === 0) return '1837';
    return (Math.max(...numbers) + 1).toString();
  },

  getSettings(): ShopSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: ShopSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  exportBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      orders: this.getOrders(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.orders)) {
        this.saveOrders(parsed.orders);
        if (parsed.settings) {
          this.saveSettings(parsed.settings);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import backup failed', e);
      return false;
    }
  },

  resetToDefaultData(): void {
    this.saveOrders(INITIAL_ORDERS);
    this.saveSettings(DEFAULT_SETTINGS);
  }
};
