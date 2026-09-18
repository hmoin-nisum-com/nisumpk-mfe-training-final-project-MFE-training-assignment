import React from 'react';
import { CartView } from './components/CartView';
import { useAppStore } from '@ecommerce/state';
import { Currency } from '@ecommerce/shared-types';
import '@ecommerce/shared-ui';

export const App: React.FC = () => {
  const currency = useAppStore((state) => state.currency);
  const setCurrency = useAppStore((state) => state.setCurrency);
  const user = useAppStore((state) => state.user);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '32px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
            Standalone MFE 2 (Port 4202)
          </span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>
            Shopping Cart Micro Frontend
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: '8px' }}>
              Currency:
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              style={{
                backgroundColor: 'var(--color-bg-main)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem'
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div
            style={{
              padding: '6px 14px',
              backgroundColor: 'rgba(14, 165, 233, 0.15)',
              borderRadius: '999px',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#7dd3fc'
            }}
          >
            User: {user.name}
          </div>
        </div>
      </header>

      <main>
        <CartView />
      </main>
    </div>
  );
};

export default App;
