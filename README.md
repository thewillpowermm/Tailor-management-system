# MFA Bespoke Tailor — Digital Atelier & Order Management System

A minimalist, modern, premium web application built for bespoke tailor shops. It acts as the exact digital twin of physical tailor order books (MFA Order Slip), allowing tailors to create, manage, track, and print customer orders and cutter measurements digitally.

---

## 📸 Based on Physical Order Slip (№ 1834)

This digital system replicates the exact multi-section layout of the bespoke tailoring book:
1. **Header & Fitting Tracker:** Order № (red stamp), Date, Fitting Stages `1` · `2` · `3`, and Status (`1st Fitting`, `2nd Fitting`, `Ready`, `Delivered`).
2. **Customer Information:** Name, Gender (`Male / ชาย`, `Female / หญิง`), Hotel, Room Number, Phone, Email, and Address.
3. **Itemized Garments & Billing:** Standard bespoke items (Suit, Pant, Jacket, Coat, Vest, Shirt, Tie, Blouse, Skirt, Dress) with Quantity, Price, Total, Deposit (Advance), and Balance Due.
4. **3 Master Cutter Measurement Cards:**
   - 🧥 **Jacket, Coat & Vest (`แจ็คเก็ต / โค้ต / เสื้อกั๊ก`)**: Neck, Chest, Shoulder-Chest, Bust Span, Waist, Shoulder-Waist, Hips, Shoulders, Arms (R/L), Front, Back, Length, Vest Length, Coat Length.
   - 👖 **Pants & Skirt (`กางเกง / กระโปรง`)**: Waist, Hips, Crotch, Thigh, Length, Leg Bottom, Skirt Length, Short Pant.
   - 👔 **Shirt (`เสื้อ Shirt`)**: Neck, Chest, Shoulder-Chest, Bust Span, Waist, Shoulder-Waist, Hips, Shoulders, Arms (R/L), Front, Back, Length, Short Sleeves.
5. **Printable Slip:** One-click digital receipt and cutter sheet formatted for printing on paper/PDF.

---

## 🚀 How to Run Locally

### 1. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`

### 2. Build for Production / Local Distributable
```bash
npm run build
npm run preview
```

---

## 💾 Local Storage & Data Safety

- **Zero Server Setup Needed for Demo:** All orders, settings, and measurements are saved automatically in the browser's `localStorage`.
- **Pre-Loaded Sample Data:** Pre-seeded with realistic orders, including the exact order `№ 1834` from the physical book page.
- **Export Backup:** Click the **Download (Export)** icon in the header to download a JSON file of all orders and measurements.
- **Import Backup:** Click the **Upload (Import)** icon in the header to restore or transfer data to any other computer or browser.
- **Reset Data:** Click the **Reset** button to restore initial sample records anytime.

---

## ⚙️ Shop Customization

Click the **Sliders (Settings)** icon in the top header to configure:
- **Shop Name**: Default is `MFA Bespoke Tailor` (customize to your client's shop name).
- **Currency**: Switch between `฿ (Thai Baht)`, `$ (USD)`, `€ (EUR)`, `£ (GBP)`, etc.
- **Units**: Switch between `Inches (in)` (traditional bespoke standard) and `Centimeters (cm)`.

---

## ☁️ Future Cloud Upgrade Path (Supabase + Cloudflare R2)

When your client approves the demo and is ready to go live with multi-device cloud sync:
1. Replace `storageService.ts` with Supabase Client SDK calls (`supabase.from('orders').select('*')`).
2. Add Cloudflare R2 bucket for fabric swatch photos and style sketches.
3. Enable user authentication (Owner & Staff logins).
