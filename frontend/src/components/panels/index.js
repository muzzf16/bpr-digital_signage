// src/components/panels/index.js
// Barrel export for panel components with lazy loading support

export { default as ProductHighlight } from './ProductHighlight';
export { default as NewsPanel } from './NewsPanel';
export { default as EconPanel } from './EconPanel';
export { default as MiniChart } from './MiniChart';
export { default as RatePanel } from './RatePanel';
export { default as WeatherPanel } from './WeatherPanel';
export { default as InfoPanel } from './InfoPanel';
export { default as LocationInfo } from './LocationInfo';
export { LazyProductHighlight, LazyNewsPanel, LazyEconPanel, LazyMiniChart, LazyRatePanel } from './LazyPanels';