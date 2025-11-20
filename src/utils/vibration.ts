/**
 * Vibration and sound utilities for FitTimer
 * Provides haptic feedback with fallback to sound
 */

// Audio context for sound fallback
let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (must be called after user interaction)
 */
export const initAudio = () => {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

/**
 * Play a beep sound as fallback when vibration is not available
 */
const playBeep = (duration: number = 200, frequency: number = 800) => {
  if (!audioContext) {
    initAudio();
  }
  
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
};

/**
 * Vibrate the device or play sound as fallback
 */
export const vibrate = (pattern: number | number[] = 200) => {
  if ('vibrate' in navigator) {
    try {
      const success = navigator.vibrate(pattern);
      if (!success) {
        // Vibration failed, use sound fallback
        if (Array.isArray(pattern)) {
          pattern.forEach((duration, index) => {
            if (index % 2 === 0) {
              setTimeout(() => playBeep(duration), pattern.slice(0, index).reduce((a, b) => a + b, 0));
            }
          });
        } else {
          playBeep(pattern);
        }
      }
    } catch (error) {
      console.warn('Vibration API error:', error);
      playBeep(Array.isArray(pattern) ? pattern[0] : pattern);
    }
  } else {
    // Vibration not supported, use sound
    playBeep(Array.isArray(pattern) ? pattern[0] : pattern);
  }
};

/**
 * Predefined vibration patterns
 */
export const VibrationPatterns = {
  short: 50,
  medium: 200,
  long: 400,
  double: [100, 100, 100] as number[],
  triple: [100, 100, 100, 100, 100] as number[],
  success: [50, 50, 50, 50, 50] as number[],
  warning: [200, 100, 200] as number[],
  error: [400, 200, 400] as number[],
} as const;
