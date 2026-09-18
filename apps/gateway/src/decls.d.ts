declare module 'mfe_product/ProductList' {
  import React from 'react';
  const ProductList: React.FC;
  export default ProductList;
}

declare module 'mfe_cart/CartView' {
  import React from 'react';
  const CartView: React.FC;
  export default CartView;
}

declare module 'mfe_cart/CartBadge' {
  import React from 'react';
  export interface CartBadgeProps {
    onClick?: () => void;
  }
  const CartBadge: React.FC<CartBadgeProps>;
  export default CartBadge;
}
