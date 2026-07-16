(function() {
  if (window.CookieConsent && window.CookieConsent.__initialized) {
    return;
  }

  const CONSENT_COOKIE_NAME = 'cookie_consent';
  const SIGNAL_BANNER_DISMISSED_COOKIE_NAME = 'cookie_signal_banner_dismissed';
  const CONSENT_LIFETIME_SECONDS = 60 * 60 * 24 * 365;
  const MESSAGES = {
    bannerDefaultHTML: 'This site uses analytics cookies only if you accept. Read the <a href="/privacy/">Privacy Policy</a> for details.',
    bannerPrivacySignalHTML: 'Analytics are currently disabled because your browser sent a privacy signal (Do Not Track or Global Privacy Control).<br>To explicitly enable analytics, please visit the <a href="/privacy/">Privacy Policy</a> page.',
    managementNoChoice: 'No saved choice. You can accept or reject analytics below.',
    managementPrivacySignalNoChoice: 'Analytics are currently disabled because your browser sent a privacy signal (Do Not Track or Global Privacy Control). You can still choose analytics below.',
    managementManualAcceptWithSignal: 'Analytics cookies are enabled from your explicit choice, even though your browser privacy signal is enabled.',
    managementEnabled: 'Analytics cookies are enabled.',
    managementDisabled: 'Analytics cookies are disabled.'
  };
  const ACCEPT_VALUES = ['1', 'yes', 'true'];

  let analyticsID = null;
  let gaDisableFlag = null;
  let bannerVisibilityOverride = null;
  let initialized = false;
  const listeners = [];

  function escapeRegex(value) {
    return value.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1');
  }

  function readCookie(name) {
    const pattern = new RegExp('(?:^|; )' + escapeRegex(name) + '=([^;]*)');
    const matches = document.cookie.match(pattern);

    return matches ? matches[1] : null;
  }

  function normalizeConsent(consent) {
    if (!consent || typeof consent !== 'object') {
      return null;
    }

    if (typeof consent.analytics !== 'boolean') {
      return null;
    }

    return {
      version: typeof consent.version === 'number' ? consent.version : 2,
      analytics: consent.analytics,
      preferences: typeof consent.preferences === 'boolean' ? consent.preferences : false,
      source: consent.source === 'manual' ? 'manual' : 'manual',
      updatedAt: typeof consent.updatedAt === 'string' ? consent.updatedAt : new Date().toISOString()
    };
  }

  function parseConsent() {
    const storedValue = readCookie(CONSENT_COOKIE_NAME);

    if (!storedValue) {
      return null;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(storedValue));
      return normalizeConsent(parsed);
    } catch (error) {
      return null;
    }
  }

  function storeConsent(consent) {
    document.cookie = CONSENT_COOKIE_NAME + '=' + encodeURIComponent(JSON.stringify(consent)) + '; Max-Age=' + CONSENT_LIFETIME_SECONDS + '; Path=/; SameSite=Lax';
  }

  function clearConsentCookie() {
    document.cookie = CONSENT_COOKIE_NAME + '=; Max-Age=0; Path=/; SameSite=Lax';
  }

  function storeSignalBannerDismissed() {
    document.cookie = SIGNAL_BANNER_DISMISSED_COOKIE_NAME + '=1; Max-Age=' + CONSENT_LIFETIME_SECONDS + '; Path=/; SameSite=Lax';
  }

  function readSignalBannerDismissed() {
    return readCookie(SIGNAL_BANNER_DISMISSED_COOKIE_NAME) === '1';
  }

  function clearSignalBannerDismissed() {
    document.cookie = SIGNAL_BANNER_DISMISSED_COOKIE_NAME + '=; Max-Age=0; Path=/; SameSite=Lax';
  }

  function deleteCookie(name) {
    const hostname = window.location.hostname;
    const expiry = 'Max-Age=0; Path=/; SameSite=Lax';

    document.cookie = name + '=; ' + expiry;
    document.cookie = name + '=; ' + expiry + '; Domain=' + hostname;
    document.cookie = name + '=; ' + expiry + '; Domain=.' + hostname;
  }

  function deleteAnalyticsCookies() {
    const cookieNames = document.cookie.split(';').map(function(cookie) {
      return cookie.split('=')[0].trim();
    });

    cookieNames.forEach(function(name) {
      if (/^_ga($|_)/.test(name) || /^_gid$/.test(name) || /^_gat($|_)/.test(name) || /^__utm/.test(name)) {
        deleteCookie(name);
      }
    });
  }

  function detectPrivacySignal() {
    const dntRaw = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack || '';
    const dntEnabled = ACCEPT_VALUES.indexOf(String(dntRaw).toLowerCase()) !== -1;
    const gpcEnabled = navigator.globalPrivacyControl === true;

    return {
      dnt: dntEnabled,
      gpc: gpcEnabled,
      active: dntEnabled || gpcEnabled
    };
  }

  function getConsentState() {
    const consent = parseConsent();
    const privacySignal = detectPrivacySignal();
    const hasManualConsent = Boolean(consent);
    const informationalMode = !hasManualConsent && privacySignal.active;
    const isSignalBannerDismissed = readSignalBannerDismissed();

    let effectiveAnalytics = false;
    let reason = 'manual-reject';

    if (hasManualConsent && consent.analytics) {
      effectiveAnalytics = true;
      reason = 'manual-accept';
    } else if (informationalMode) {
      reason = 'privacy-signal';
    }

    let showBanner = !hasManualConsent;

    if (informationalMode && isSignalBannerDismissed) {
      showBanner = false;
    }

    if (bannerVisibilityOverride === true) {
      showBanner = true;
    } else if (bannerVisibilityOverride === false) {
      showBanner = false;
    }

    let managementStatusMessage = MESSAGES.managementDisabled;

    if (informationalMode) {
      managementStatusMessage = MESSAGES.managementPrivacySignalNoChoice;
    } else if (!hasManualConsent) {
      managementStatusMessage = MESSAGES.managementNoChoice;
    } else if (consent.analytics && privacySignal.active) {
      managementStatusMessage = MESSAGES.managementManualAcceptWithSignal;
    } else if (consent.analytics) {
      managementStatusMessage = MESSAGES.managementEnabled;
    }

    return {
      consent: consent,
      hasManualConsent: hasManualConsent,
      effectiveAnalytics: effectiveAnalytics,
      privacySignal: privacySignal,
      reason: reason,
      showBanner: showBanner,
      bannerCopyHTML: reason === 'privacy-signal' ? MESSAGES.bannerPrivacySignalHTML : MESSAGES.bannerDefaultHTML,
      managementStatusMessage: managementStatusMessage,
      isSignalBannerDismissed: isSignalBannerDismissed
    };
  }

  function sendInitialPageviewIfNeeded() {
    if (!window.ga || window.__cookieBannerAnalyticsPageviewSent) {
      return;
    }

    window.ga('send', 'pageview');
    window.__cookieBannerAnalyticsPageviewSent = true;
  }

  function startAnalytics() {
    window.GoogleAnalyticsObject = 'ga';
    window.ga = window.ga || function() {
      (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = 1 * new Date();

    window.ga('create', analyticsID, 'auto');
    window.__cookieBannerAnalyticsLoaded = true;
    sendInitialPageviewIfNeeded();
  }

  function loadAnalytics() {
    if (!analyticsID || !gaDisableFlag) {
      return;
    }

    window[gaDisableFlag] = false;

    if (window.__cookieBannerAnalyticsLoaded) {
      sendInitialPageviewIfNeeded();
      return;
    }

    const existingScript = document.querySelector('script[data-cookie-banner-analytics="true"]');

    if (existingScript) {
      return;
    }

    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = 'https://www.google-analytics.com/analytics.js';
    analyticsScript.setAttribute('data-cookie-banner-analytics', 'true');
    analyticsScript.onload = function() {
      if (!window.__cookieBannerAnalyticsLoaded) {
        startAnalytics();
      }
    };

    document.head.appendChild(analyticsScript);
  }

  function notify(state) {
    listeners.forEach(function(listener) {
      listener(state);
    });
  }

  function applyState() {
    const state = getConsentState();

    if (!gaDisableFlag) {
      notify(state);
      return state;
    }

    if (state.effectiveAnalytics) {
      loadAnalytics();
      notify(state);
      return state;
    }

    window[gaDisableFlag] = true;
    window.__cookieBannerAnalyticsPageviewSent = false;
    deleteAnalyticsCookies();
    notify(state);

    return state;
  }

  function createConsent(analyticsAllowed) {
    return {
      version: 2,
      analytics: analyticsAllowed,
      preferences: false,
      source: 'manual',
      updatedAt: new Date().toISOString()
    };
  }

  function initialize(config) {
    if (initialized) {
      return applyState();
    }

    if (!config || !config.analyticsID) {
      return null;
    }

    analyticsID = config.analyticsID;
    gaDisableFlag = 'ga-disable-' + analyticsID;
    window[gaDisableFlag] = true;
    initialized = true;

    return applyState();
  }

  function setConsent(analyticsAllowed) {
    const consent = createConsent(Boolean(analyticsAllowed));

    storeConsent(consent);
    clearSignalBannerDismissed();
    bannerVisibilityOverride = null;
    applyState();

    return consent;
  }

  function clearConsent() {
    clearConsentCookie();
    clearSignalBannerDismissed();
    bannerVisibilityOverride = null;

    return applyState();
  }

  function openBanner() {
    bannerVisibilityOverride = true;

    return applyState();
  }

  function hideBanner() {
    bannerVisibilityOverride = false;

    return applyState();
  }

  function dismissInformationalBanner() {
    storeSignalBannerDismissed();
    bannerVisibilityOverride = false;

    return applyState();
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      return function() {};
    }

    listeners.push(listener);

    return function() {
      const index = listeners.indexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  window.CookieConsent = {
    __initialized: true,
    initialize: initialize,
    getConsent: parseConsent,
    getState: getConsentState,
    applyState: applyState,
    setConsent: setConsent,
    clearConsent: clearConsent,
    openBanner: openBanner,
    hideBanner: hideBanner,
    dismissInformationalBanner: dismissInformationalBanner,
    subscribe: subscribe,
    getMessages: function() {
      return Object.assign({}, MESSAGES);
    }
  };
})();
