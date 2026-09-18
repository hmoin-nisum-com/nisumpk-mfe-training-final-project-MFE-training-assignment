import React, { useState } from 'react';
import { Product } from '@ecommerce/shared-types';
import { Card, Button, Badge } from '@ecommerce/shared-ui';
import { NISUM } from '@ecommerce/events';
import { useAppStore } from '@ecommerce/state';
import { formatCurrency } from '@ecommerce/utilities';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Read reactive global state for currency and conversion
  const currency = useAppStore((state) => state.currency);
  const exchangeRates = useAppStore((state) => state.exchangeRates);
  const incrementCartCount = useAppStore((state) => state.incrementCartCount);
  const addToast = useAppStore((state) => state.addToast);

  const formattedPrice = formatCurrency(product.price, currency, exchangeRates);

  const handleAddToCart = () => {
    setIsAdding(true);

    // 1. Cross-MFE Event: Emit cart:item-added via global NISUM event bus
    NISUM.emit('cart:item-added', {
      product,
      quantity: 1,
      timestamp: Date.now()
    });

    // 2. Cross-MFE Event: Emit notification:show for Gateway toast
    NISUM.emit('notification:show', {
      message: `Added "${product.name}" to cart!`,
      type: 'success',
      duration: 3000
    });

    // 3. Global Shared State: Increment shared cart counter
    incrementCartCount(1);
    addToast({
      message: `Added "${product.name}" to cart!`,
      type: 'success'
    });

    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }, 250);
  };

  return (
    <Card hoverable className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          loading="lazy"
        />
        {product.badge && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <Badge variant="primary">{product.badge}</Badge>
          </div>
        )}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <Badge variant={product.stock > 10 ? 'success' : 'warning'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </Badge>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.category}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ★ {product.rating.toFixed(1)}
        </span>
      </div>

      <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', fontWeight: 600, color: 'var(--color-text-main)' }}>
        {product.name}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0', flex: 1, lineHeight: 1.5 }}>
        {product.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
            Price ({currency})
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
            {formattedPrice}
          </span>
        </div>

        <Button
          variant={justAdded ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleAddToCart}
          isLoading={isAdding}
          disabled={product.stock === 0}
        >
          {justAdded ? 'Added ✓' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
};
