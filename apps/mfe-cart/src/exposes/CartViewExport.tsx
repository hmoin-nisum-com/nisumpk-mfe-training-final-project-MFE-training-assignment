import React from 'react';
import { CartView } from '../components/CartView';
import { ErrorBoundary } from '@ecommerce/shared-ui';

export const CartViewExport: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackTitle="Shopping Cart Unavailable"
      fallbackMessage="Unable to render the Shopping Cart remote component."
    >
      <CartView />
    </ErrorBoundary>
  );
};

export default CartViewExport;
