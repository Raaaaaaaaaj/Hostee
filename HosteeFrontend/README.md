# Grand Luxe Hotel Management System (HMS) - Premium Frontend Portal

Grand Luxe is a production-grade, ultra-premium Property Management System (PMS) and CRM frontend portal designed for boutique hotels and luxury five-star hospitality portfolios. Built using **Angular 20+**, **PrimeNG v21+**, **TailwindCSS v4**, and **Signals-driven state architecture**, it competes visually and architecturally with industry benchmarks like Mews PMS, Stripe, and Airbnb Host.

---

## 🌟 Visual Inspiration & Styling Philosophy

- **Premium Aesthetics**: Clean interfaces utilizing ambient gradients, custom soft elevations, luxury sans typography (Plus Jakarta Sans & Inter), and modern rounded edges (Cards: `24px`, inputs: `16px`).
- **Interactive Micro-Animations**: Smooth scale/float animations and visual status pulses (vacant, dirty, active checks).
- **Popup-Free Workflows**: Minimizes intrusive modal popups in favor of elegant slide-over drawers, expandable list components, and inline editing grids.

---

## 🛠️ Tech Stack & Version Constraints

- **Core**: Angular 20+, TypeScript, SCSS
- **State Management**: Angular Signals-first (`signal`, `computed`, `linkedSignal`)
- **Control Flow**: Modern template control flow (`@if`, `@for`, `@switch`, `@defer`)
- **Component UI Library**: PrimeNG v21+, PrimeIcons, Chart.js
- **Styling Utility**: TailwindCSS v4

---

## 📂 Scale Folder Structure

```text
src
 ├── app
 │   ├── assets
 │   │   ├── fonts
 │   │   ├── i18n
 │   │   ├── icons
 │   │   └── images
 │
 │   ├── core
 │   │   ├── api
 │   │   │   ├── api-client.service.ts
 │   │   │   ├── api-endpoints.ts
 │   │   │   ├── api.config.ts
 │   │   │   └── api.types.ts
 │   │   ├── auth
 │   │   │   ├── auth.guard.ts
 │   │   │   └── auth.service.ts
 │   │   ├── interceptors
 │   │   │   ├── auth.interceptor.ts
 │   │   │   ├── error.interceptor.ts
 │   │   │   └── loading.interceptor.ts
 │   │   ├── layouts
 │   │   │   └── main-layout.component.ts
 │   │   ├── services
 │   │   │   ├── loading.service.ts
 │   │   │   └── toast.service.ts
 │   │   └── store
 │   │       ├── dashboard.store.ts
 │   │       ├── guests.store.ts
 │   │       ├── housekeeping.store.ts
 │   │       ├── reservations.store.ts
 │   │       └── rooms.store.ts
 │
 │   ├── environments
 │   │   ├── environment.prod.ts
 │   │   └── environment.ts
 │
 │   ├── features
 │   │   ├── ai-assistant
 │   │   │   └── ai-assistant.component.ts
 │   │   ├── auth
 │   │   │   └── login
 │   │   │       └── login.component.ts
 │   │   ├── billing (Merged under settings tab)
 │   │   ├── dashboard
 │   │   │   └── dashboard.component.ts
 │   │   ├── guests
 │   │   │   └── guests.component.ts
 │   │   ├── housekeeping
 │   │   │   └── housekeeping.component.ts
 │   │   ├── reports
 │   │   │   └── reports.component.ts
 │   │   ├── reservations
 │   │   │   └── reservations.component.ts
 │   │   ├── rooms
 │   │   │   └── rooms.component.ts
 │   │   ├── settings
 │   │   │   └── settings.component.ts
 │   │   └── website-builder
 │   │       └── website-builder.component.ts
 │
 │   ├── shared
 │   │   ├── components
 │   │   │   ├── premium-table.component.ts
 │   │   │   ├── stat-card.component.ts
 │   │   │   └── status-badge.component.ts
 │
 │   ├── app.config.ts
 │   ├── app.html
 │   ├── app.routes.ts
 │   ├── app.ts
 │   └── ...
```

---

## 🔒 Security Note on API Endpoints

> [!WARNING]
> Frontend applications execute entirely inside client browsers; therefore, compiled scripts can always be decompiled and analyzed using standard browser DevTools. 
> 
> **CRITICAL SECURITY RULES**:
> 1. **Never expose**: Private database connection strings, JWT signing keys/secrets, payment gateways private keys (e.g., Stripe Private Key), AI assistant parameters (e.g., OpenAI Key), or AWS cloud IAM credentials in your frontend code or environment files.
> 2. **Backend Protection**: All credential verifications, secure tokens generation, transaction gateways execution, and LLM integrations must remain backend-only. The frontend should always communicate with intermediate backend API gateways that securely proxy these services.

---

## 🚀 Setup & Local Execution

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Execute Development Server**:
   ```bash
   npm run start
   ```
   Open `http://localhost:4200` to review portal features.
3. **Trigger Production Build Compiler**:
   ```bash
   npm run build
   ```

---

## 🔮 Future Roadmap

- **Bidirectional Drag-and-Drop Housekeeping Grid**: Integrated drag mechanics allowing managers to schedule cleaners directly by dropping task cards.
- **Offline Ledger Reconciliation**: Integrated Service Workers database to cache transactions locally when internet links suffer packet losses, auto-syncing upon reconnection.
- **Dynamic Site Templates Builder**: Drag-and-drop landing widgets builder with real-time CSS code export.
