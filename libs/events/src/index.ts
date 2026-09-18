import { NisumEventBus, NisumEventMap } from '@ecommerce/shared-types';

interface RecordedEvent {
  event: string;
  payload: any;
  timestamp: number;
}

const MAX_HISTORY = 50;
const eventHistory: RecordedEvent[] = [];

/**
 * Creates the global NISUM event bus instance attached to window.
 */
function createEventBus(): NisumEventBus {
  // If running in browser and already initialized, reuse
  if (typeof window !== 'undefined' && window.NISUM) {
    return window.NISUM;
  }

  const bus: NisumEventBus = {
    /**
     * Dispatches a global event across MFEs with a typed or untyped payload
     */
    emit<K extends keyof NisumEventMap>(event: K | string, payload?: any): void {
      if (typeof window === 'undefined') return;

      const record: RecordedEvent = {
        event: event as string,
        payload,
        timestamp: Date.now()
      };

      eventHistory.unshift(record);
      if (eventHistory.length > MAX_HISTORY) {
        eventHistory.pop();
      }

      const customEvent = new CustomEvent(`nisum:${event}`, {
        detail: payload,
        bubbles: true,
        cancelable: true
      });

      window.dispatchEvent(customEvent);
    },

    /**
     * Registers a listener for a global event.
     * Returns an unregister function that cleans up the listener.
     */
    listener<K extends keyof NisumEventMap>(
      event: K | string,
      handler: (payload: any) => void
    ): () => void {
      if (typeof window === 'undefined') {
        return () => {};
      }

      const internalHandler = (e: Event) => {
        const customEvent = e as CustomEvent;
        handler(customEvent.detail);
      };

      const eventKey = `nisum:${event}`;
      window.addEventListener(eventKey, internalHandler);

      return () => {
        window.removeEventListener(eventKey, internalHandler);
      };
    },

    /**
     * Retrieves recent event log for architecture inspection and diagnostics
     */
    getHistory(): RecordedEvent[] {
      return [...eventHistory];
    }
  };

  if (typeof window !== 'undefined') {
    window.NISUM = bus;
  }

  return bus;
}

export const NISUM = createEventBus();

// Also export standalone functions for idiomatic ES module usage
export const emit = NISUM.emit.bind(NISUM);
export const listener = NISUM.listener.bind(NISUM);
export const getEventHistory = (NISUM.getHistory || (() => [])).bind(NISUM);

export default NISUM;
