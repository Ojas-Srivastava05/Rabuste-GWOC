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
 * Track order placed
 */
export const trackOrderPlaced = (orderData: {
  orderId: string;
  totalAmount: number;
  itemCount: number;
  hasCoupon: boolean;
  couponCode?: string;
  couponDiscount?: number;
  itemTypes: string[];
}) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'purchase', {
      transaction_id: orderData.orderId,
      value: orderData.totalAmount,
      currency: 'INR',
      items: orderData.itemCount,
      coupon: orderData.hasCoupon ? orderData.couponCode : undefined,
      discount: orderData.couponDiscount || 0,
      item_types: orderData.itemTypes.join(','),
    });
    
    // Also track as custom event for more details
    logEvent(analytics, 'order_placed', {
      order_id: orderData.orderId,
      total_amount: orderData.totalAmount,
      item_count: orderData.itemCount,
      has_coupon: orderData.hasCoupon,
      coupon_code: orderData.couponCode || null,
      coupon_discount: orderData.couponDiscount || 0,
      item_types: orderData.itemTypes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track order status update
 */
export const trackOrderStatusUpdate = (orderId: string, oldStatus: string, newStatus: string) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'order_status_update', {
      order_id: orderId,
      old_status: oldStatus,
      new_status: newStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track add to cart
 */
export const trackAddToCart = (itemData: {
  itemId: string;
  itemName: string;
  itemType: 'menu' | 'art';
  price: number;
  quantity: number;
  category?: string;
}) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'add_to_cart', {
      currency: 'INR',
      value: itemData.price * itemData.quantity,
      items: [{
        item_id: itemData.itemId,
        item_name: itemData.itemName,
        item_category: itemData.category || itemData.itemType,
        price: itemData.price,
        quantity: itemData.quantity,
      }],
    });
    
    // Also track as custom event
    logEvent(analytics, 'cart_item_added', {
      item_id: itemData.itemId,
      item_name: itemData.itemName,
      item_type: itemData.itemType,
      price: itemData.price,
      quantity: itemData.quantity,
      category: itemData.category || itemData.itemType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track remove from cart
 */
export const trackRemoveFromCart = (itemId: string, itemName: string, itemType: 'menu' | 'art') => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'remove_from_cart', {
      item_id: itemId,
      item_name: itemName,
      item_type: itemType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track checkout started
 */
export const trackCheckoutStarted = (cartData: {
  itemCount: number;
  totalAmount: number;
  hasCoupon: boolean;
  itemTypes: string[];
}) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'begin_checkout', {
      currency: 'INR',
      value: cartData.totalAmount,
      items: cartData.itemCount,
      item_types: cartData.itemTypes.join(','),
      has_coupon: cartData.hasCoupon,
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = (pageName: string, pagePath: string) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: pagePath,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track menu item view
 */
export const trackMenuItemView = (itemId: string, itemName: string, category: string, price: number) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'view_item', {
      currency: 'INR',
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: price,
      }],
    });
    
    logEvent(analytics, 'menu_item_view', {
      item_id: itemId,
      item_name: itemName,
      category: category,
      price: price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track art item view
 */
export const trackArtItemView = (itemId: string, itemName: string, artist: string, category: string, price: number) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'view_item', {
      currency: 'INR',
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: price,
      }],
    });
    
    logEvent(analytics, 'art_item_view', {
      item_id: itemId,
      item_name: itemName,
      artist: artist,
      category: category,
      price: price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track user login
 */
export const trackUserLogin = (method: 'email' | 'guest') => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'login', {
      method: method,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track user signup
 */
export const trackUserSignup = () => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'sign_up', {
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string, resultCount: number) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  try {
    logEvent(analytics, 'search', {
      search_term: searchTerm,
      result_count: resultCount,
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
