import React from 'react';
import { CartBadge, CartBadgeProps } from '../components/CartBadge';

export const CartBadgeExport: React.FC<CartBadgeProps> = (props) => {
  return <CartBadge {...props} />;
};

export default CartBadgeExport;
