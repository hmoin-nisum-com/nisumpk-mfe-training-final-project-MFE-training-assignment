# 🛒 Production-Ready E-Commerce Micro Frontend Platform

[![CI Pipeline](https://github.com/NisumPK/nisumpk-mfe-training-final-project-MFE-training-assignment/actions/workflows/ci.yml/badge.svg)](https://github.com/NisumPK/nisumpk-mfe-training-final-project-MFE-training-assignment/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-v20%20%7C%20v22-brightgreen.svg)](https://nodejs.org)
[![Webpack](https://img.shields.io/badge/Module%20Federation-Webpack%205-blue.svg)](https://webpack.js.org/concepts/module-federation/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

This project is the **Final Project for the Micro Frontend (MFE) Training at Nisum**. It implements a complete, enterprise-grade, scalable **E-Commerce Platform** following **Scenario 1** and strictly complying with all **24 Important Rules** defined in the training specifications.

The platform demonstrates how independently developed, tested, and deployable frontend applications work harmoniously within a unified user experience using **Webpack 5 Module Federation**, a **monorepo workspace**, **Zustand shared global state**, an event-driven **`window.NISUM` event bus**, a resilient **Express REST API backend**, and automated **CI/CD pipelines**.

---

## Business Scenario

### Scenario 1 — E-Commerce Retail Platform

The business scenario models a modern multi-category electronic and accessory storefront:

1. **Gateway / Shell (Host - Port `4200`)**: Acts as the customer-facing orchestrator. Provides responsive layout, navigation between views, currency switching, customer profile badge, dynamic remote loading with error boundaries, and centralized toast notifications.
2. **Product Catalog MFE (Remote - Port `4201`)**: Owned by the Catalog Team. Provides interactive product discovery with category filtering, keyword search, inventory indicators, and dynamic price conversion. When an item is purchased, it triggers decoupled events via `window.NISUM` and updates global state.
3. **Shopping Cart MFE (Remote - Port `4202`)**: Owned by the Checkout & Orders Team. Consumes cross-MFE events, calculates line totals, taxes, discounts, and shipping fees, syncs cart updates with the backend REST API, and executes the final checkout order creation.
4. **Backend API Service (Express - Port `3000`)**: Provides authoritative RESTful endpoints for catalog data, server-persisted cart state, order placement transactions, and health checks.

---

## Architecture

The platform adopts a **Runtime Composition Architecture** with loose coupling between services:

- **Host-Remote Topology**: The Gateway acts as the Module Federation Host. Remotes (`mfe-product` and `mfe-cart`) expose self-contained components compiled into `remoteEntry.js` bundles loaded dynamically at runtime.
- **Shared Dependency Singletons**: Core libraries (`react`, `react-dom`, `zustand`, `@ecommerce/*`) are configured as shared singletons across federation boundaries, ensuring zero duplicate React runtimes and shared memory space for global stores.
- **Fault-Tolerant Fallbacks**: Every remote import is protected by a `RemoteBoundary` containing an `ErrorBoundary` and `Suspense` fallback. If a remote service crashes or experiences network failure, the Shell remains responsive and displays a localized retry control without breaking the rest of the application.
- **Dual-Channel Communication**:
  - **Shared Reactive State**: For persistent, synchronous application-level data (currency selection, active user session, cart total counter).
  - **Event-Driven Communication**: For asynchronous cross-boundary notifications (`cart:item-added`, `cart:updated`, `order:created`, `notification:show`) through standard browser CustomEvents.

---

## Architecture Diagram

```text
                               ┌──────────────────────────────────────────────┐
                               │           Gateway / Shell (Host)             │
                               │          Webpack 5 DevServer :4200           │
                               │  - Layout Shell & Global Navigation          │
                               │  - Currency Selector & Toast System          │
                               │  - Remote Fallback Error Boundaries          │
                               └──────────────┬────────────────┬──────────────┘
                                              │                │
                             Module Federation│                │Module Federation
                             (remoteEntry.js) │                │(remoteEntry.js)
                                              ▼                ▼
                     ┌───────────────────────────┐  ┌───────────────────────────┐
                     │   Product Catalog MFE     │  │     Shopping Cart MFE     │
                     │  Remote / Standalone :4201│  │  Remote / Standalone :4202│
                     │  Exposes: ./ProductList   │  │  Exposes: ./CartView      │
                     │                           │  │           ./CartBadge     │
                     └─────────────┬─────────────┘  └─────────────┬─────────────┘
                                   │                              │
                                   │  NISUM.emit('cart:item-added')│ NISUM.listener(...)
                                   └──────────────┐        ┌──────┘
                                                  ▼        ▼
                                        ┌─────────────────────────┐
                                        │    Global Event Bus     │
                                        │      window.NISUM       │
                                        │  (Browser CustomEvents) │
                                        └─────────────────────────┘
                                                  ▲        ▲
                                                  │        │
                                        ┌─────────┴────────┴────────┐
                                        │    Shared Global State    │
                                        │    @ecommerce/state       │
                                        │     (Zustand Store)       │
                                        └───────────────────────────┘
                                                  │        │
                                                  ▼        ▼
                                        ┌───────────────────────────┐
                                        │      Backend REST API     │
                                        │        Express :3000      │
                                        │  /api/products  /api/cart │
                                        │  /api/orders    /api/health│
                                        └───────────────────────────┘
```

---

## Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| **Micro Frontend Federation** | Webpack 5 `ModuleFederationPlugin` | Runtime module composition, dependency sharing, and independent deployment |
| **Frontend Framework** | React 18.3 (`react`, `react-dom`) | Component-based UI with hooks and lazy loading |
| **Language & Typing** | TypeScript 5.6 | Strict type safety and shared interfaces across apps and libs |
| **State Management** | Zustand 4.5 | Lightweight reactive store shared as a singleton across MFEs |
| **Event System** | `window.NISUM` (Browser CustomEvents) | Loosely coupled pub/sub cross-MFE communication |
| **Backend Server** | Node.js + Express 4.21 | RESTful APIs for catalog, persistent cart, and orders |
| **Monorepo Architecture** | npm Workspaces + Nx | Workspace orchestration, centralized scripts, path aliases |
| **Styling & Design System** | Modern Vanilla CSS & CSS Tokens | Glassmorphism, tailored HSL color tokens, dark mode accents |
| **Testing** | Jest 29 + React Testing Library + Supertest | Unit, component, integration, and API testing |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`) | Automated build, test, lint, and type checking pipeline |

---

## Project Structure

```text
nisumpk-mfe-training-final-project-MFE-training-assignment/
├── apps/
│   ├── gateway/                      # Shell / Host application (Port 4200)
│   │   ├── public/index.html
│   │   ├── src/
│   │   │   ├── components/           # RemoteBoundary, ToastContainer, ArchitectureView
│   │   │   ├── App.tsx               # Main shell layout with remote lazy loading
│   │   │   ├── bootstrap.tsx         # Host bootstrap mount
│   │   │   ├── index.ts              # Async Module Federation entry
│   │   │   ├── App.test.tsx          # Gateway unit/component test suite
│   │   │   └── decls.d.ts            # Remote module TS declarations
│   │   ├── webpack.config.js         # Host federation config
│   │   └── tsconfig.json
│   │
│   ├── mfe-product/                  # Product Catalog MFE (Port 4201)
│   │   ├── public/index.html
│   │   ├── src/
│   │   │   ├── components/           # ProductList, ProductCard
│   │   │   ├── exposes/              # ProductListExport exposed to federation
│   │   │   ├── App.tsx               # Standalone development container
│   │   │   ├── bootstrap.tsx         # Standalone root mount
│   │   │   ├── index.ts              # Async Module Federation entry
│   │   │   └── ProductCard.test.tsx  # Product catalog component test suite
│   │   ├── webpack.config.js         # Remote federation config exposing ./ProductList
│   │   └── tsconfig.json
│   │
│   ├── mfe-cart/                     # Shopping Cart MFE (Port 4202)
│   │   ├── public/index.html
│   │   ├── src/
│   │   │   ├── components/           # CartView, CartBadge
│   │   │   ├── exposes/              # CartViewExport, CartBadgeExport
│   │   │   ├── App.tsx               # Standalone development container
│   │   │   ├── bootstrap.tsx         # Standalone root mount
│   │   │   ├── index.ts              # Async Module Federation entry
│   │   │   └── CartView.test.tsx     # Cart component test suite
│   │   ├── webpack.config.js         # Remote federation config exposing ./CartView, ./CartBadge
│   │   └── tsconfig.json
│   │
│   └── api/                          # Express Backend API Service (Port 3000)
│       ├── src/
│       │   ├── data/                 # In-memory product catalog seed
│       │   ├── routes/               # products.ts, cart.ts, orders.ts, health.ts
│       │   ├── index.ts              # Server bootstrap and CORS middleware
│       │   └── api.test.ts           # Supertest API endpoint tests
│       └── tsconfig.json
│
├── libs/
│   ├── shared-types/                 # Universal TypeScript contracts
│   │   └── src/index.ts              # Product, CartItem, Order, NisumEventMap, etc.
│   ├── shared-ui/                    # Reusable Design System components
│   │   ├── src/
│   │   │   ├── components/           # Button, Card, Badge, Loader, ErrorBoundary, Toast
│   │   │   ├── styles/tokens.css     # CSS custom property design tokens
│   │   │   └── index.ts
│   ├── events/                       # window.NISUM Event Engine
│   │   ├── src/
│   │   │   ├── index.ts              # NISUM.emit, NISUM.listener implementation
│   │   │   └── index.test.ts         # Event bus unit tests
│   ├── state/                        # Shared reactive Zustand store
│   │   ├── src/
│   │   │   ├── index.ts              # useAppStore singleton hook and actions
│   │   │   └── index.test.ts         # Store unit tests
│   └── utilities/                    # Formatters, HTTP client, environment readers
│       ├── src/
│       │   ├── index.ts              # formatCurrency, getEnv, fetchJson
│       │   └── index.test.ts         # Utilities unit tests
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # Automated GitHub Actions CI workflow
├── package.json                      # Monorepo workspaces and unified scripts
├── tsconfig.base.json                # Shared compiler options & path mappings
├── tsconfig.json                     # Root project reference
├── nx.json                           # Workspace metadata
├── jest.config.js                    # Monorepo Jest test configuration
├── jest.setup.ts                     # DOM matchers setup
├── .eslintrc.json                    # ESLint rule configuration
├── .env.example                      # Environment variables template
└── README.md                         # Complete project documentation
```

---

## Applications

### Gateway
- **Role**: Module Federation Host running on port `4200`.
- **Responsibilities**:
  - Dynamically loads `mfe_product/ProductList`, `mfe_cart/CartView`, and `mfe_cart/CartBadge` using runtime URLs.
  - Houses the top application bar with brand mark, user profile pill, and live navigation switcher (`Catalog`, `Shopping Cart`, `Architecture & Health`).
  - Provides a global currency dropdown connected directly to `@ecommerce/state`.
  - Integrates `ToastContainer` listening to cross-MFE `notification:show` events.
  - Wraps remote modules in `RemoteBoundary` to prevent cascading failures.

### MFE 1: Product Catalog (`mfe-product`)
- **Role**: Remote application running on port `4201`.
- **Exposed Module**: `./ProductList` (`ProductListExport.tsx`).
- **Responsibilities**:
  - Fetches catalog data from the Backend API (`GET /api/products`).
  - Provides category filtering (All, Audio, Wearables, Electronics, Accessories) and real-time search.
  - Renders pricing formatted dynamically according to global store currency (`USD`, `EUR`, `GBP`).
  - On clicking "Add to Cart":
    1. Emits `cart:item-added` via `window.NISUM.emit()`.
    2. Emits `notification:show` via `window.NISUM.emit()`.
    3. Increments shared cart counter in `@ecommerce/state`.
- **Standalone Execution**: Run independently at `http://localhost:4201`.

### MFE 2: Shopping Cart (`mfe-cart`)
- **Role**: Remote application running on port `4202`.
- **Exposed Modules**: `./CartView` (`CartViewExport.tsx`), `./CartBadge` (`CartBadgeExport.tsx`).
- **Responsibilities**:
  - Subscribes to `cart:item-added` via `window.NISUM.listener()` and cleans up listener on unmount.
  - Renders line items, supports quantity modification (+ / -) and deletion.
  - Calculates subtotal, sales tax (8%), conditional free shipping (> $100), and VIP member discounts (> $200).
  - Syncs changes with Backend API (`POST /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`).
  - Emits `order:created` and `notification:show` upon order checkout completion.
- **Standalone Execution**: Run independently at `http://localhost:4202`.

### Backend Service (`api`)
- **Role**: RESTful API service running on port `3000`.
- **Responsibilities**:
  - `GET /api/products`: Retrieves catalog with optional category and search query parameters.
  - `GET /api/products/:id`: Retrieves individual product specifications.
  - `GET /api/cart`: Returns current server cart summary.
  - `POST /api/cart`: Adds an item to the persistent cart.
  - `PUT /api/cart/:id`: Modifies item quantity.
  - `DELETE /api/cart/:id`: Deletes single cart item.
  - `DELETE /api/cart`: Clears cart upon order placement.
  - `POST /api/orders`: Validates cart items, generates order ID, and confirms order.
  - `GET /api/health`: Provides service uptime and status for architecture monitoring.

---

## Module Federation

Module Federation is implemented using Webpack 5's native `ModuleFederationPlugin`.

### Gateway Host Configuration (`apps/gateway/webpack.config.js`)
```javascript
new ModuleFederationPlugin({
  name: 'gateway',
  remotes: {
    mfe_product: `mfe_product@${MFE_PRODUCT_URL}/remoteEntry.js`,
    mfe_cart: `mfe_cart@${MFE_CART_URL}/remoteEntry.js`
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.1', eager: false },
    'react-dom': { singleton: true, requiredVersion: '^18.3.1', eager: false },
    zustand: { singleton: true, eager: false },
    '@ecommerce/shared-types': { singleton: true, eager: false },
    '@ecommerce/shared-ui': { singleton: true, eager: false },
    '@ecommerce/events': { singleton: true, eager: false },
    '@ecommerce/state': { singleton: true, eager: false },
    '@ecommerce/utilities': { singleton: true, eager: false }
  }
})
```

### Remote MFE Configuration (`apps/mfe-product/webpack.config.js`)
```javascript
new ModuleFederationPlugin({
  name: 'mfe_product',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductList': './src/exposes/ProductListExport'
  },
  shared: { /* same singletons */ }
})
```

### Remote MFE Configuration (`apps/mfe-cart/webpack.config.js`)
```javascript
new ModuleFederationPlugin({
  name: 'mfe_cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartView': './src/exposes/CartViewExport',
    './CartBadge': './src/exposes/CartBadgeExport'
  },
  shared: { /* same singletons */ }
})
```

---

## Monorepo Architecture

The monorepo uses standard **npm Workspaces** integrated with TypeScript base paths (`tsconfig.base.json`):
- `apps/*`: Application entry points (`gateway`, `mfe-product`, `mfe-cart`, `api`).
- `libs/*`: Reusable libraries (`shared-types`, `shared-ui`, `events`, `state`, `utilities`).

Benefits:
- Single dependency installation via `npm install`.
- Code changes in `libs/*` are instantly reflected across all applications without requiring premature publishing to an npm registry.
- Standardized tooling: single ESLint configuration, single Jest runner, and unified CI pipeline.

---

## Shared Libraries

1. **`@ecommerce/shared-types`**:
   Universal TypeScript interfaces (`Product`, `CartItem`, `Order`, `AppNotification`, `NisumEventMap`). Eliminates drift between MFEs and the backend.
2. **`@ecommerce/shared-ui`**:
   Clean design system components (`Button`, `Card`, `Badge`, `Loader`, `ErrorBoundary`, `Toast`) and global CSS design tokens (`tokens.css`).
3. **`@ecommerce/events`**:
   The `window.NISUM` event engine providing `emit()` and `listener()`.
4. **`@ecommerce/state`**:
   The shared Zustand store providing reactive currency, cart item count, active view, and user session data.
5. **`@ecommerce/utilities`**:
   Common utilities including `formatCurrency()`, `getEnv()`, and resilient `fetchJson()` with HTTP error parsing.

---

## Global State

Implemented using **Zustand** shared as a Module Federation singleton:
- **State Properties**:
  - `currency`: Selected currency (`USD`, `EUR`, `GBP`).
  - `exchangeRates`: Conversion ratios.
  - `cartCount`: Real-time total count of items in cart.
  - `user`: Authenticated customer profile (`Alex Morgan`, `Gold VIP`).
  - `activeView`: Currently displayed view tab (`products`, `cart`, `architecture`).
  - `toasts`: Active notification queue.
- **Why Zustand?**
  Zustand provides a lightweight, hook-based API with zero boilerplate, full TypeScript safety, and outside-React store access (`getState()`, `setState()`). Because Module Federation shares it as a singleton, all MFEs and the Gateway access the exact same store instance in browser memory.

---

## Event-Driven Architecture

Cross-MFE communication uses loose coupling with browser-based events:
- MFEs never directly import each other's internal files.
- The emitting MFE publishes an event onto the event bus without caring which components or remotes are currently listening.
- If a listening MFE is not mounted, events fail silently without breaking execution.

---

## NISUM Event System

Attached to the global `window.NISUM` object, satisfying **Important Rules 11 and 12**:

### Event API
```typescript
// Emitting an event
NISUM.emit('cart:item-added', {
  product: productData,
  quantity: 1,
  timestamp: Date.now()
});

// Registering a listener (returns cleanup function)
const unsubscribe = NISUM.listener('cart:item-added', (data) => {
  console.log('Item added payload:', data);
});

// Unsubscribing (e.g., in React useEffect cleanup)
unsubscribe();
```

### Supported Core Events
- `cart:item-added`: Emitted by `mfe-product`, consumed by `mfe-cart`.
- `cart:updated`: Emitted by `mfe-cart` on quantity changes or deletions.
- `order:created`: Emitted by `mfe-cart` on successful checkout.
- `notification:show`: Emitted across all MFEs, consumed by Gateway `ToastContainer`.
- `currency:changed`: Emitted when global currency switches.

---

## Data-Sharing Strategy

| Mechanism | Used For | Coupling | Persistence | Advantages | Limitations |
|---|---|---|---|---|---|
| **Shared State (Zustand)** | Currency preferences, user session, cart total badge count | Medium | Runtime (in-memory) | Instant reactivity across MFEs; single source of truth | Requires singleton module sharing via federation |
| **Event System (`window.NISUM`)** | Cross-MFE notifications (`cart:item-added`, `notification:show`) | Low | Ephemeral | Completely decoupled; standard DOM `CustomEvent` | Not persistent; requires listener active before dispatch |
| **Module Federation** | Runtime composition of remote views (`ProductList`, `CartView`) | Medium | Runtime | Independent deployment; on-demand script chunk loading | Configuration complexity; network latency on first load |
| **Backend REST API** | Catalog data, persistent cart items, order transactions | Low | Server-side | Authoritative persistence; business logic and security | Network latency; requires backend availability |
| **Browser Storage** | User local preferences fallback | Low | Persistent | Survives page refresh across browser sessions | Client-specific; manual synchronization needed |

---

## Backend/API

The Express backend runs on port `3000` with CORS enabled for `http://localhost:4200`, `http://localhost:4201`, and `http://localhost:4202`.

### Endpoints
- `GET /api/products`: Returns product list. Supports `?category=Audio` and `?search=webcam`.
- `GET /api/products/:id`: Returns single product details.
- `GET /api/cart`: Returns server cart state with calculated tax, shipping, and totals.
- `POST /api/cart`: Adds product to cart. Body: `{ productId, name, price, quantity, image, category }`.
- `PUT /api/cart/:id`: Updates quantity of an item. Body: `{ quantity }`.
- `DELETE /api/cart/:id`: Removes item from cart.
- `DELETE /api/cart`: Clears cart items.
- `POST /api/orders`: Submits order transaction. Body: `{ items, totalAmount, currency, customer }`.
- `GET /api/health`: Health status endpoint returning uptime and service version.

---

## Error Handling

1. **Remote Loading Failures**:
   If a remote MFE is unreachable, `RemoteBoundary` catches the dynamic import error and displays a clear message (e.g., `"Unable to load Remote Micro Frontend: mfe-product"`) with a "Retry Loading" button. The Gateway host and other MFEs continue functioning normally.
2. **Backend Unavailability**:
   Frontend components catch HTTP errors, display user-friendly error cards, and offer "Retry Fetch" buttons.
3. **Event Listener Cleanup**:
   All event listeners registered with `NISUM.listener()` return an unregister callback executed in React `useEffect` cleanups, preventing memory leaks and duplicate handler invocations.

---

## Testing

The project includes an automated test suite across all applications and shared libraries:

```bash
npm test
```

### Test Suites Included:
- **`libs/events` (`index.test.ts`)**: Verifies `NISUM.emit()`, `NISUM.listener()`, payload delivery, unregister cleanup, and event history recording.
- **`libs/state` (`index.test.ts`)**: Verifies Zustand store initialization, currency updates, cart counter clamping, and toast management.
- **`libs/utilities` (`index.test.ts`)**: Verifies currency formatting in USD, EUR, GBP, and environment variable fallbacks.
- **`apps/api` (`api.test.ts`)**: Supertest integration tests verifying `/api/health`, `/api/products` (filtering & search), cart CRUD operations, and `/api/orders`.
- **`apps/mfe-product` (`ProductCard.test.tsx`)**: Verifies product card rendering, price formatting, and clicking "Add to Cart" emits `cart:item-added` and updates store.
- **`apps/mfe-cart` (`CartView.test.tsx`)**: Verifies empty cart rendering, receiving `cart:item-added` events, and displaying line items and totals.
- **`apps/gateway` (`App.test.tsx`)**: Verifies Gateway shell rendering, view switching, and currency selection.

---

## CI/CD

Automated CI is implemented using **GitHub Actions** in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Pipeline Stages:
1. **Checkout Code**: Checks out repository.
2. **Setup Node.js**: Matrix testing across Node.js `20.x` and `22.x`.
3. **Install Dependencies**: Runs `npm ci`.
4. **Linting**: Runs `npm run lint` (`eslint --max-warnings=0`).
5. **Type Checking**: Runs `npm run type-check` (`tsc --noEmit`).
6. **Automated Tests**: Runs `npm test -- --coverage`.
7. **Production Builds**: Compiles and bundles all MFEs and backend (`npm run build`).

---

## Environment Configuration

Configuration is managed through environment variables without hardcoded URLs:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `3000` | Backend API port |
| `API_URL` | `http://localhost:3000` | URL for backend REST API |
| `GATEWAY_PORT` | `4200` | Gateway Host port |
| `MFE_PRODUCT_URL` | `http://localhost:4201` | Product Catalog MFE URL |
| `MFE_CART_URL` | `http://localhost:4202` | Shopping Cart MFE URL |
| `CORS_ORIGIN` | `http://localhost:4200,...` | Allowed CORS origins for API |

Copy template to create local config:
```bash
cp .env.example .env
```

---

## Running the Application

### Prerequisites
- Node.js `v20.x` or `v22.x`
- npm `v10.x` or higher

### Single-Command Startup (Rule 7)
Install dependencies and launch all 4 services concurrently with a single command:

```bash
npm install
npm run dev
```

This starts:
- ✓ **Backend API**: [http://localhost:3000](http://localhost:3000)
- ✓ **Product Catalog MFE**: [http://localhost:4201](http://localhost:4201)
- ✓ **Shopping Cart MFE**: [http://localhost:4202](http://localhost:4202)
- ✓ **Gateway Shell (Main Entry)**: [http://localhost:4200](http://localhost:4200)

### Individual App Scripts
```bash
npm run dev:gateway    # Starts Gateway Host only (Port 4200)
npm run dev:product    # Starts Product MFE only (Port 4201)
npm run dev:cart       # Starts Cart MFE only (Port 4202)
npm run dev:api        # Starts Backend API only (Port 3000)
```

---

## Deployment

### Independent Deployment Strategy
In production, each MFE is packaged and deployed independently:
1. **Remotes Deployment (`mfe-product`, `mfe-cart`)**:
   - Bundled via `npm run build -w @ecommerce/mfe-product`.
   - Assets and `remoteEntry.js` uploaded to CDN / S3 bucket with CORS headers enabled.
   - Example URLs: `https://cdn.example.com/mfe-product/remoteEntry.js`.
2. **Gateway Deployment (`gateway`)**:
   - Reads remote entry URLs from environment variables (`MFE_PRODUCT_URL`, `MFE_CART_URL`) at build or runtime.
   - Deployed to modern hosting (Vercel, AWS CloudFront, Nginx).
3. **Backend API**:
   - Containerized or deployed to cloud app services (AWS ECS, Render, Railway).
4. **Zero Downtime Updates**:
   Because the Gateway dynamically loads `remoteEntry.js` on user requests, updates to `mfe-product` or `mfe-cart` are immediately consumed by users on page load without requiring a redeployment or restart of the Gateway Shell.

---

## Architecture Decisions

### ADR 1: Webpack 5 Module Federation as Core Federation Technology
- **Context**: Need runtime composition of independent React micro frontends.
- **Decision**: Used Webpack 5 `ModuleFederationPlugin`.
- **Rationale**: Industry standard for enterprise micro frontends, robust singleton dependency sharing (`react`, `react-dom`, `zustand`), and dynamic remote loading at runtime.

### ADR 2: Browser CustomEvents for Asynchronous Cross-MFE Communication
- **Context**: Need decoupled communication where Product MFE notifies Cart MFE.
- **Decision**: Implemented `window.NISUM` event bus using browser `CustomEvent`.
- **Rationale**: MFEs remain completely agnostic of each other. No direct package imports between MFEs, preventing tight coupling.

### ADR 3: Zustand for Reactive Shared Application State
- **Context**: Currency, active user session, and cart total badge count need synchronous reactive sharing across the Gateway and MFEs.
- **Decision**: Configured `@ecommerce/state` with Zustand shared as a singleton module.
- **Rationale**: Minimal footprint (< 2KB), works seamlessly across Module Federation boundaries, and allows components to re-render only when selected state slices change.

### ADR 4: Centralized Error Boundaries per Remote MFE
- **Context**: A failure in one remote must not crash the entire application.
- **Decision**: Created `RemoteBoundary` wrapping each `React.lazy()` import.
- **Rationale**: Isolates failures. If the Cart MFE is temporarily down, the customer can still browse the product catalog and view architecture diagnostics.

---

## Challenges & Solutions

1. **Challenge: TypeScript path resolution across monorepo packages**
   - *Problem*: Webpack `ts-loader` threw `TS6059` when importing shared types and components outside the application's root directory.
   - *Solution*: Configured `tsconfig.base.json` with universal path aliases (`@ecommerce/*`) and included `libs/**/*` in the application tsconfigs while omitting restrictive `rootDir` definitions.
2. **Challenge: Cross-MFE React singleton collision**
   - *Problem*: In Module Federation, multiple instances of React loaded by host and remotes can cause "Invalid hook call" errors.
   - *Solution*: Configured `react` and `react-dom` as `{ singleton: true, requiredVersion: '^18.3.1', eager: false }` in all Module Federation plugins, ensuring a single shared React instance in browser memory.
3. **Challenge: Event listener memory leaks**
   - *Problem*: Component re-renders could register duplicate listeners on `window`.
   - *Solution*: `NISUM.listener()` returns an unsubscribe function called in `useEffect` cleanups.

---

## Screenshots / Demo

### 1. Gateway Shell & Product Catalog (MFE 1)
- Host header with branding, user profile, currency selector, and cart badge.
- Interactive catalog loaded from `mfe-product` with category filter buttons and "Add to Cart" actions.

### 2. Shopping Cart (MFE 2) & Checkout
- Cart items dynamically added via `window.NISUM` events.
- Order summary with subtotal, tax, free shipping, and checkout receipt.

### 3. Architecture & Health Inspector
- Built-in live topology dashboard showing active host and remotes.
- Real-time `window.NISUM` event stream log and data-sharing strategy comparison matrix.

---

## Future Improvements

1. **Server-Side Rendering (SSR)**: Implement Next.js or Module Federation SSR for enhanced SEO on product detail pages.
2. **Client-Side Cache Layer**: Integrate React Query or SWR in shared utilities for optimistic UI updates.
3. **Advanced Telemetry**: Centralized OpenTelemetry tracing across Gateway, MFEs, and Backend API.

---

## Conclusion

This project demonstrates a production-oriented, scalable, and resilient Micro Frontend platform. By combining **Module Federation**, **decoupled event-driven messaging (`window.NISUM`)**, **reactive shared state (Zustand)**, and **comprehensive error boundaries**, the platform provides a blueprint for large engineering organizations to build and maintain independent frontends that work seamlessly as one unified product.
