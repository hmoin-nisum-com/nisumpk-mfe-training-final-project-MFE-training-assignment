import React, { useEffect, useState, useMemo } from 'react';
import { Product, ApiResponse } from '@ecommerce/shared-types';
import { ProductCard } from './ProductCard';
import { Loader, Button } from '@ecommerce/shared-ui';
import { fetchJson, API_BASE_URL } from '@ecommerce/utilities';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Audio', 'Wearables', 'Electronics', 'Accessories'];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/products`;
      const res = await fetchJson<ApiResponse<Product[]>>(url);
      if (res.success && res.data) {
        setProducts(res.data);
      } else {
        setError(res.error || 'Failed to fetch products');
      }
    } catch (err: any) {
      console.error('[ProductList fetch error]:', err);
      setError(err.message || 'Network error fetching catalog from API backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div style={{ width: '100%' }}>
      {/* Header controls: Search & Category Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          padding: '18px 20px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px', maxWidth: '350px' }}>
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              backgroundColor: 'var(--color-bg-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--color-text-main)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <Button size="sm" variant="outline" onClick={() => setSearchQuery('')}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Content states */}
      {loading && <Loader label="Loading product catalog from API..." size="lg" />}

      {error && (
        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center',
            color: '#fca5a5'
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>Backend API Connection Issue</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem' }}>{error}</p>
          <Button size="sm" variant="outline" onClick={fetchProducts}>
            Retry Fetch
          </Button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--color-border)'
          }}
        >
          <p style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>No products match your criteria.</p>
          <Button size="sm" variant="outline" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
