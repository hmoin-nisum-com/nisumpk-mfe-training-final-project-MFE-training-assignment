import React from 'react';
import { useAppStore } from '@ecommerce/state';
import { Currency } from '@ecommerce/shared-types';
import { RemoteBoundary } from './components/RemoteBoundary';
import { ArchitectureView } from './components/ArchitectureView';
import { ToastContainer } from './components/ToastContainer';
import '@ecommerce/shared-ui';

// Dynamically import remote micro frontend components via Module Federation
const RemoteProductList = React.lazy(() => import('mfe_product/ProductList'));
const RemoteCartView = React.lazy(() => import('mfe_cart/CartView'));
const RemoteCartBadge = React.lazy(() => import('mfe_cart/CartBadge'));

const MFE_PRODUCT_URL = process.env.MFE_PRODUCT_URL || 'http://localhost:4201';
const MFE_CART_URL = process.env.MFE_CART_URL || 'http://localhost:4202';

export const App: React.FC = () => {
  const activeView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const currency = useAppStore((state) => state.currency);
  const setCurrency = useAppStore((state) => state.setCurrency);
  const user = useAppStore((state) => state.user);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Main Gateway Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'var(--color-bg-glass)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          padding: '12px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Brand Logo & Architecture Subtitle */}
          <div
            onClick={() => setActiveView('products')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
              }}
            >
              N
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                NISUM STORE
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Micro Frontend Platform
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setActiveView('products')}
              style={{
                background: activeView === 'products' ? 'var(--color-primary)' : 'transparent',
                color: activeView === 'products' ? '#ffffff' : 'var(--color-text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Catalog (MFE 1)
            </button>

            <button
              onClick={() => setActiveView('cart')}
              style={{
                background: activeView === 'cart' ? 'var(--color-primary)' : 'transparent',
                color: activeView === 'cart' ? '#ffffff' : 'var(--color-text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Shopping Cart (MFE 2)
            </button>

            <button
              onClick={() => setActiveView('architecture')}
              style={{
                background: activeView === 'architecture' ? 'var(--color-primary)' : 'transparent',
                color: activeView === 'architecture' ? '#ffffff' : 'var(--color-text-muted)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Architecture & Health
            </button>
          </nav>

          {/* Right utility toolbar: Currency, User, Cart Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Global Currency Selector (Zustand) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                style={{
                  backgroundColor: 'var(--color-bg-main)',
                  color: 'var(--color-text-main)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* User Profile Capsule */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '999px',
                border: '1px solid var(--color-border)',
                fontSize: '0.8rem'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#ffffff'
                }}
              >
                {user.name.charAt(0)}
              </div>
              <span style={{ fontWeight: 500 }}>{user.name}</span>
            </div>

            {/* Remote Cart Badge loaded from MFE 2 via Module Federation */}
            <RemoteBoundary remoteName="mfe-cart (CartBadge)" expectedUrl={MFE_CART_URL}>
              <RemoteCartBadge onClick={() => setActiveView('cart')} />
            </RemoteBoundary>
          </div>
        </div>
      </header>

      {/* Main Content Area: Renders remote MFEs or Architecture view based on navigation */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {activeView === 'products' && (
          <RemoteBoundary remoteName="mfe-product (ProductList)" expectedUrl={MFE_PRODUCT_URL}>
            <RemoteProductList />
          </RemoteBoundary>
        )}

        {activeView === 'cart' && (
          <RemoteBoundary remoteName="mfe-cart (CartView)" expectedUrl={MFE_CART_URL}>
            <RemoteCartView />
          </RemoteBoundary>
        )}

        {activeView === 'architecture' && <ArchitectureView />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginTop: 'auto'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Nisum MFE Training Final Project</strong> — Scenario 1 E-Commerce
          </div>
          <div>
            Module Federation • React 18 • Express • Zustand • window.NISUM Events
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
