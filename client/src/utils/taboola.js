/**
 * Taboola Pixel Tracking Utility
 * Account ID: 2059429
 * 
 * Usage:
 *   import { tbolaTrack } from '../utils/taboola';
 *   tbolaTrack('lead');           // Fire a lead conversion
 *   tbolaTrack('page_view');      // Fire a page view (SPA navigation)
 */

const TABOOLA_ACCOUNT_ID = 2059429;

export function tbolaTrack(eventName, eventData = {}) {
  try {
    window._tfa = window._tfa || [];
    window._tfa.push({
      notify: 'event',
      name: eventName,
      id: TABOOLA_ACCOUNT_ID,
      ...eventData,
    });
  } catch (e) {
    // Silently fail — don't break the app if pixel isn't loaded
    console.warn('Taboola tracking error:', e);
  }
}

/**
 * Fire page_view on SPA route changes.
 * Call this in a useEffect that watches location changes.
 */
export function tbolaPageView() {
  tbolaTrack('page_view');
}

/**
 * Fire lead/conversion event when a form is submitted successfully.
 */
export function tbolaLead() {
  tbolaTrack('lead');
}

export default { tbolaTrack, tbolaPageView, tbolaLead };
