import React from 'react';
import { useAppStore } from '@ecommerce/state';

export interface CartBadgeProps {
  onClick?: () => void;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  const cartCount = useAppStore((state) => state.cartCount);

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: 'var(--color-bg-card)',
        color: 'var(--color-text-main)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.875rem',
        transition: 'all 0.2s ease'
      }}
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <span style={{ fontSize: '1.1rem' }}>🛒</span>
      <span>Cart</span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '20px',
          height: '20px',
          padding: '0 6px',
          borderRadius: '10px',
          backgroundColor: cartCount > 0 ? 'var(--color-primary)' : '#475569',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 700
        }}
      >
        {cartCount}
      </span>
    </button>
  );
};
