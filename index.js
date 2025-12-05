// Utility to report core web vitals
// Usage: useWebVitals((metric) => console.log(metric))

'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        // In production, you would send this to your analytics service
        // e.g., GA4, Vercel Analytics, or custom endpoint
        if (process.env.NODE_ENV === 'development') {
            console.log(metric);
        }

        // Example: Send to Google Analytics
        // if (window.gtag) {
        //   window.gtag('event', metric.name, {
        //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        //     event_label: metric.id,
        //     non_interaction: true,
        //   });
        // }
    });

    return null;
}
