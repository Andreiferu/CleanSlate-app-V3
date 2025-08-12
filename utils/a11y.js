// Focus management utilities
class FocusManager {
  constructor() {
    this.previousActiveElement = null;
    this.trapStack = [];
  }

  // Salvează elementul curent cu focus și setează focus pe nou element
  saveFocusAndSet(element) {
    this.previousActiveElement = document.activeElement;
    if (element) {
      element.focus();
    }
  }

  // Restaurează focus-ul salvat
  restoreFocus() {
    if (this.previousActiveElement && this.previousActiveElement.focus) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }

  // Trap focus într-un container
  trapFocus(container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    this.trapStack.push({
      container,
      handleKeyDown,
      firstElement
    });

    // Set initial focus
    firstElement.focus();
  }

  // Release focus trap
  releaseFocusTrap() {
    const trap = this.trapStack.pop();
    if (trap) {
      trap.container.removeEventListener('keydown', trap.handleKeyDown);
    }
  }

  // Get all focusable elements in container
  getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]:not([contenteditable="false"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => !el.hidden && el.offsetParent !== null);
  }

  // Anunță screen reader-ului o schimbare
  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Cleanup după 1 secundă
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Utility pentru screen reader only text
export function createScreenReaderOnly(text) {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

// Skip links pentru navigare rapidă
export function addSkipLinks() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 9999;
    transition: top 0.3s;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Keyboard navigation helpers
export function handleEscapeKey(callback) {
  return (event) => {
    if (event.key === 'Escape') {
      callback(event);
    }
  };
}

export function handleEnterKey(callback) {
  return (event) => {
    if (event.key === 'Enter') {
      callback(event);
    }
  };
}

// Color contrast checker
export function checkColorContrast(foreground, background) {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AAA: ratio >= 7
  };
}

export const focusManager = new FocusManager();

// React hooks pentru accessibility
export function useFocusTrap(isActive, containerRef) {
  React.useEffect(() => {
    if (isActive && containerRef.current) {
      focusManager.trapFocus(containerRef.current);
      return () => focusManager.releaseFocusTrap();
    }
  }, [isActive, containerRef]);
}

export function useAnnouncement() {
  return React.useCallback((message, priority = 'polite') => {
    focusManager.announceToScreenReader(message, priority);
  }, []);
}

// CSS pentru screen reader only content
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link:focus {
    position: absolute;
    top: 6px !important;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 9999;
  }
`;
