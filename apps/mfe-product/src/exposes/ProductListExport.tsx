import React from 'react';
import { ProductList } from '../components/ProductList';
import { ErrorBoundary } from '@ecommerce/shared-ui';

export const ProductListExport: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackTitle="Product Catalog Unavailable"
      fallbackMessage="Unable to render the Product Catalog remote component."
    >
      <ProductList />
    </ErrorBoundary>
  );
};

export default ProductListExport;
