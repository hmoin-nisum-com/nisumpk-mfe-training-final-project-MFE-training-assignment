import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="ui-error-boundary" role="alert">
          <h3>{this.props.fallbackTitle || 'Component Error'}</h3>
          <p style={{ margin: '8px 0 16px 0', fontSize: '0.9rem' }}>
            {this.props.fallbackMessage ||
              this.state.error?.message ||
              'An unexpected error occurred while rendering this component.'}
          </p>
          <Button variant="outline" size="sm" onClick={this.handleReset}>
            Retry Loading
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
