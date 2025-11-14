// src/components/panels/LazyPanels.js
// Lazy-loaded panel components to optimize bundle size
import React, { lazy, Suspense } from 'react';

// Fallback components for lazy loading
const LoadingFallback = ({ label }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-800/30 rounded-lg p-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
      <p className="text-gray-400 text-sm">{label || 'Memuat...'}</p>
    </div>
  </div>
);

// Error boundary component
class PanelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Panel loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-900/30 rounded-lg p-4">
          <p className="text-red-200">Gagal memuat komponen</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load panel components
export const LazyProductHighlight = (props) => (
  <PanelErrorBoundary>
    <Suspense fallback={<LoadingFallback label="Memuat highlight produk..." />}>
      <ProductHighlightLoader {...props} />
    </Suspense>
  </PanelErrorBoundary>
);

export const LazyNewsPanel = (props) => (
  <PanelErrorBoundary>
    <Suspense fallback={<LoadingFallback label="Memuat berita..." />}>
      <NewsPanelLoader {...props} />
    </Suspense>
  </PanelErrorBoundary>
);

export const LazyEconPanel = (props) => (
  <PanelErrorBoundary>
    <Suspense fallback={<LoadingFallback label="Memuat data ekonomi..." />}>
      <EconPanelLoader {...props} />
    </Suspense>
  </PanelErrorBoundary>
);

export const LazyMiniChart = (props) => (
  <PanelErrorBoundary>
    <Suspense fallback={<LoadingFallback label="Memuat grafik..." />}>
      <MiniChartLoader {...props} />
    </Suspense>
  </PanelErrorBoundary>
);

export const LazyRatePanel = (props) => (
  <PanelErrorBoundary>
    <Suspense fallback={<LoadingFallback label="Memuat suku bunga..." />}>
      <RatePanelLoader {...props} />
    </Suspense>
  </PanelErrorBoundary>
);

const ProductHighlightLoader = lazy(() =>
  import('./ProductHighlight').catch(() => ({
    default: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Gagal memuat</div>
  }))
);

const NewsPanelLoader = lazy(() =>
  import('./NewsPanel').catch(() => ({
    default: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Gagal memuat</div>
  }))
);

const EconPanelLoader = lazy(() =>
  import('./EconPanel').catch(() => ({
    default: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Gagal memuat</div>
  }))
);

const MiniChartLoader = lazy(() =>
  import('./MiniChart').catch(() => ({
    default: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Gagal memuat</div>
  }))
);

const RatePanelLoader = lazy(() =>
  import('./RatePanel').catch(() => ({
    default: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Gagal memuat</div>
  }))
);