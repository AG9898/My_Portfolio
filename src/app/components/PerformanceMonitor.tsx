"use client";

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const layoutShift = performance.getEntriesByType('layout-shift');

      const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint');
      const largestContentfulPaint = performance.getEntriesByType('largest-contentful-paint')[0];
      const cumulativeLayoutShift = layoutShift.reduce((sum, entry) => sum + (entry as any).value, 0);

      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : 0,
        largestContentfulPaint: largestContentfulPaint ? largestContentfulPaint.startTime : 0,
        cumulativeLayoutShift: cumulativeLayoutShift,
      });

      // Show metrics after 3 seconds
      setTimeout(() => setIsVisible(true), 3000);
    };

    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  if (!isVisible || !metrics) return null;

  const getPerformanceGrade = (metric: number, thresholds: { good: number; needsImprovement: number }) => {
    if (metric <= thresholds.good) return '🟢 Good';
    if (metric <= thresholds.needsImprovement) return '🟡 Needs Improvement';
    return '🔴 Poor';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-md p-4 rounded-lg text-white text-sm z-50 max-w-xs">
      <h3 className="font-semibold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span>{metrics.loadTime.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>DOM Ready:</span>
          <span>{metrics.domContentLoaded.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>First Paint:</span>
          <span>{metrics.firstContentfulPaint.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Largest Paint:</span>
          <span>{metrics.largestContentfulPaint.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Layout Shift:</span>
          <span>{metrics.cumulativeLayoutShift.toFixed(3)}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {getPerformanceGrade(metrics.loadTime, { good: 1000, needsImprovement: 3000 })}
        </div>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );
} 