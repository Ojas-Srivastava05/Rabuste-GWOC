// Analytics utility functions for tracking events
import { analytics } from './firebase';
import { logEvent, EventParams } from 'firebase/analytics';

/**
 * Track section views
 */
export const trackSectionView = (sectionName: string) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'section_view', {
      section_name: sectionName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track VR scene interactions
 */
export const trackVRSceneInteraction = (sceneName: string, interactionType: 'view' | 'navigate' | 'close') => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'vr_scene_interaction', {
      scene_name: sceneName,
      interaction_type: interactionType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track workshop clicks
 */
export const trackWorkshopClick = (workshopId: string, workshopTitle: string) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'workshop_click', {
      workshop_id: workshopId,
      workshop_title: workshopTitle,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Generic event tracking
 */
export const trackEvent = (eventName: string, params?: EventParams) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};
