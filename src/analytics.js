const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
const validGoogleTagId = /^(G|GT)-[A-Z0-9]+$/i.test(measurementId);

export function trackEvent(name, params = {}) {
  if (!validGoogleTagId || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

if (validGoogleTagId && !window.__skywhaleAnalyticsLoaded) {
  window.__skywhaleAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_path: window.location.pathname,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}
