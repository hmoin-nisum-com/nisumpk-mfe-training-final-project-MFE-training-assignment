import { useAppStore } from './index';

describe('Global Shared State (Zustand Store)', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      currency: 'USD',
      cartCount: 0,
      activeView: 'products',
      toasts: []
    });
  });

  test('should initialize with default user and currency', () => {
    const state = useAppStore.getState();
    expect(state.currency).toBe('USD');
    expect(state.cartCount).toBe(0);
    expect(state.user.name).toBe('Sarah Jenkins');
    expect(state.user.membership).toBe('Gold VIP');
  });

  test('should update currency and reflect across store', () => {
    useAppStore.getState().setCurrency('EUR');
    expect(useAppStore.getState().currency).toBe('EUR');

    useAppStore.getState().setCurrency('GBP');
    expect(useAppStore.getState().currency).toBe('GBP');
  });

  test('should increment and set cart count safely', () => {
    useAppStore.getState().incrementCartCount(1);
    expect(useAppStore.getState().cartCount).toBe(1);

    useAppStore.getState().incrementCartCount(3);
    expect(useAppStore.getState().cartCount).toBe(4);

    useAppStore.getState().setCartCount(10);
    expect(useAppStore.getState().cartCount).toBe(10);

    // Negative counts should clamp to 0
    useAppStore.getState().setCartCount(-5);
    expect(useAppStore.getState().cartCount).toBe(0);
  });

  test('should manage toast notifications', () => {
    useAppStore.getState().addToast({
      message: 'Item added successfully',
      type: 'success'
    });

    const state = useAppStore.getState();
    expect(state.toasts.length).toBe(1);
    expect(state.toasts[0].message).toBe('Item added successfully');
    expect(state.toasts[0].type).toBe('success');

    const toastId = state.toasts[0].id;
    useAppStore.getState().removeToast(toastId);
    expect(useAppStore.getState().toasts.length).toBe(0);
  });

  test('should switch active view', () => {
    useAppStore.getState().setActiveView('cart');
    expect(useAppStore.getState().activeView).toBe('cart');

    useAppStore.getState().setActiveView('architecture');
    expect(useAppStore.getState().activeView).toBe('architecture');
  });
});
