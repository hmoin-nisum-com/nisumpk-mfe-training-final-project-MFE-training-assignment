import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@ecommerce/shared-ui';
import { useAppStore } from '@ecommerce/state';
import { NISUM, getEventHistory } from '@ecommerce/events';
import { API_BASE_URL, fetchJson } from '@ecommerce/utilities';

export const ArchitectureView: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const currency = useAppStore((state) => state.currency);
  const cartCount = useAppStore((state) => state.cartCount);

  const [events, setEvents] = useState<any[]>([]);
  const [apiHealth, setApiHealth] = useState<{ status: string; uptimeSeconds?: number } | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);

  // Poll event history
  useEffect(() => {
    const syncEventHistory = () => {
      setEvents(getEventHistory());
    };
    syncEventHistory();
    const interval = setInterval(syncEventHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check API Health
  const fetchApiHealth = async () => {
    setIsHealthLoading(true);
    try {
      const res = await fetchJson<{ status: string; uptimeSeconds: number }>(`${API_BASE_URL}/api/health`);
      setApiHealth(res);
    } catch (err: any) {
      setApiHealth({ status: 'DOWN' });
    } finally {
      setIsHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchApiHealth();
  }, []);

  const handleTriggerTestEvent = () => {
    NISUM.emit('notification:show', {
      message: 'Test event dispatched from Gateway Architecture Inspector!',
      type: 'info',
      duration: 3500
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Architecture Summary Banner */}
      <Card style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderColor: '#4f46e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Badge variant="primary">Architecture Inspection</Badge>
            <h2 style={{ margin: '12px 0 8px 0', fontSize: '1.6rem' }}>
              Micro Frontend Platform Topology
            </h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', maxWidth: '720px', lineHeight: 1.5 }}>
              Runtime composition using Webpack 5 Module Federation, decoupled cross-MFE communication via
              <code style={{ color: '#a5b4fc', margin: '0 4px' }}>window.NISUM</code> CustomEvents, and reactive state sharing via Zustand.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={fetchApiHealth} isLoading={isHealthLoading}>
            Ping Backend API
          </Button>
        </div>
      </Card>

      {/* Topology Nodes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Node 1: Gateway */}
        <Card hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            <Badge variant="success">Host (Active)</Badge>
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Gateway / Shell</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Port: 4200 • Webpack 5 Host
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Loads Remotes via React.lazy, manages global layout, toasts, and shell navigation.
          </div>
        </Card>

        {/* Node 2: MFE 1 */}
        <Card hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>📦</span>
            <Badge variant="primary">Remote 1</Badge>
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Product Catalog MFE</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Port: 4201 • Exposed: <code>./ProductList</code>
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Fetches catalog from API, emits <code>cart:item-added</code> events on purchase.
          </div>
        </Card>

        {/* Node 3: MFE 2 */}
        <Card hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🛒</span>
            <Badge variant="primary">Remote 2</Badge>
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Shopping Cart MFE</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Port: 4202 • Exposed: <code>./CartView</code>
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Listens to <code>cart:item-added</code>, syncs with backend, emits <code>order:created</code>.
          </div>
        </Card>

        {/* Node 4: Backend API */}
        <Card hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <Badge variant={apiHealth?.status === 'UP' ? 'success' : 'danger'}>
              API: {apiHealth?.status || 'CHECKING'}
            </Badge>
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Express Backend</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Port: 3000 • REST Endpoints
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Provides <code>/api/products</code>, <code>/api/cart</code>, <code>/api/orders</code>, <code>/api/health</code>.
          </div>
        </Card>
      </div>

      {/* Live State & Event Bus Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* State Inspector */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧠</span> Global Shared State
            </h3>
            <Badge variant="primary">Zustand Singleton</Badge>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg-main)',
              borderRadius: 'var(--border-radius-md)',
              padding: '14px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>activeUser: </span>
              <span style={{ color: '#6ee7b7' }}>{JSON.stringify(user)}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>selectedCurrency: </span>
              <span style={{ color: '#93c5fd' }}>"{currency}"</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>sharedCartCount: </span>
              <span style={{ color: '#fcd34d' }}>{cartCount} items</span>
            </div>
          </div>
        </Card>

        {/* Event Bus Inspector */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📡</span> window.NISUM Event Stream
            </h3>
            <Button size="sm" variant="outline" onClick={handleTriggerTestEvent}>
              Emit Test Event
            </Button>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg-main)',
              borderRadius: 'var(--border-radius-md)',
              padding: '14px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              border: '1px solid var(--color-border)',
              maxHeight: '220px',
              overflowY: 'auto'
            }}
          >
            {events.length === 0 ? (
              <span style={{ color: 'var(--color-text-muted)' }}>
                No events emitted yet. Interact with the store to stream events here.
              </span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {events.map((e, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      paddingBottom: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{e.event}</span>
                      <span style={{ color: '#64748b' }}>
                        {new Date(e.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                      {JSON.stringify(e.payload)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Data-Sharing Strategy Matrix (Part 17) */}
      <Card>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>
          Data-Sharing Strategy Comparison Matrix
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.875rem'
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>Mechanism</th>
                <th style={{ padding: '10px 14px' }}>Used For</th>
                <th style={{ padding: '10px 14px' }}>Coupling</th>
                <th style={{ padding: '10px 14px' }}>Persistence</th>
                <th style={{ padding: '10px 14px' }}>Advantages</th>
                <th style={{ padding: '10px 14px' }}>Limitations</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                  Global State (Zustand)
                </td>
                <td style={{ padding: '12px 14px' }}>Currency preferences, active cart count, user session</td>
                <td style={{ padding: '12px 14px' }}><Badge variant="warning">Medium</Badge></td>
                <td style={{ padding: '12px 14px' }}>Runtime</td>
                <td style={{ padding: '12px 14px' }}>Instant reactivity, single source of truth across boundaries</td>
                <td style={{ padding: '12px 14px' }}>Requires shared singleton in Module Federation</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-secondary)' }}>
                  Events (window.NISUM)
                </td>
                <td style={{ padding: '12px 14px' }}>Cross-MFE notifications (cart:item-added, notification:show)</td>
                <td style={{ padding: '12px 14px' }}><Badge variant="success">Low</Badge></td>
                <td style={{ padding: '12px 14px' }}>Ephemeral</td>
                <td style={{ padding: '12px 14px' }}>Completely decoupled, standard browser CustomEvents</td>
                <td style={{ padding: '12px 14px' }}>Not persistent, requires listener active before dispatch</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f59e0b' }}>
                  Module Federation
                </td>
                <td style={{ padding: '12px 14px' }}>Runtime composition of remote views (ProductList, CartView)</td>
                <td style={{ padding: '12px 14px' }}><Badge variant="primary">Medium</Badge></td>
                <td style={{ padding: '12px 14px' }}>Runtime</td>
                <td style={{ padding: '12px 14px' }}>Independent deployment, zero duplicate dependencies</td>
                <td style={{ padding: '12px 14px' }}>Network latency on first remote script fetch</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#10b981' }}>
                  Backend REST API
                </td>
                <td style={{ padding: '12px 14px' }}>Catalog data, persistent cart items, order transactions</td>
                <td style={{ padding: '12px 14px' }}><Badge variant="success">Low</Badge></td>
                <td style={{ padding: '12px 14px' }}>Server</td>
                <td style={{ padding: '12px 14px' }}>Authoritative source of truth, secure data validation</td>
                <td style={{ padding: '12px 14px' }}>HTTP latency and network dependency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
