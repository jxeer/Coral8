/**
 * Touch Gestures Hook
 * Provides touch gesture detection for mobile interfaces
 * Supports swipe, tap, and long press gestures with customizable thresholds
 * Optimized for mobile-first interaction patterns in Coral8
 */

import { useRef, useCallback, useEffect } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  longPressDelay?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

/**
 * Custom hook for handling touch gestures on mobile devices
 * @param options - Configuration object for gesture callbacks and thresholds
 * @returns Ref object to attach to the target element
 */
export function useTouchGestures(options: TouchGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    swipeThreshold = 50,
    longPressDelay = 500
  } = options;

  const touchStart = useRef<TouchPoint | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        touchStart.current = null; // Prevent other gestures after long press
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.x - touchStart.current.x;
    const deltaY = touchEnd.y - touchStart.current.y;
    const deltaTime = touchEnd.time - touchStart.current.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine if it's a swipe or tap
    if (absX > swipeThreshold || absY > swipeThreshold) {
      // It's a swipe
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    } else if (deltaTime < 300) {
      // It's a quick tap
      onTap?.();
    }

    touchStart.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, swipeThreshold]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Clear long press timer if finger moves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
      
      // Clean up timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return elementRef;
}

/**
 * Simplified swipe hook for common use cases
 * @param onSwipeLeft - Callback for left swipe
 * @param onSwipeRight - Callback for right swipe
 * @returns Ref object to attach to the target element
 */
export function useSwipe(
  onSwipeLeft?: () => void, 
  onSwipeRight?: () => void
) {
  return useTouchGestures({
    onSwipeLeft,
    onSwipeRight,
    swipeThreshold: 75 // Slightly higher threshold for cleaner swipes
  });
}

/**
 * Pull-to-refresh gesture hook
 * @param onRefresh - Callback when pull-to-refresh is triggered
 * @param threshold - Minimum pull distance to trigger refresh
 * @returns Ref object and refresh state
 */
export function usePullToRefresh(
  onRefresh: () => void, 
  threshold: number = 100
) {
  const isRefreshing = useRef(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  
  const elementRef = useTouchGestures({
    onSwipeDown: () => {
      if (currentY.current - startY.current > threshold && !isRefreshing.current) {
        isRefreshing.current = true;
        onRefresh();
        setTimeout(() => {
          isRefreshing.current = false;
        }, 1000);
      }
    }
  });

  return { ref: elementRef, isRefreshing: isRefreshing.current };
}