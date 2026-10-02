// src/utils/analytics.d.ts
export function getVisitorId(): string;
export function getSessionId(): string;
export function trackEvent(eventName: string, details?: Record<string, unknown>): Promise<void>;
export function trackPageView(title?: string): void;
export function trackLead(leadData?: Record<string, unknown>): void;
export function enableClickTracking(): void;
export function resetScrollTracking(): void;
export function enableScrollTracking(): void;
export function enableFormTracking(): void;
export function enablePageTimeTracking(): void;
export function initAnalytics(): void;
