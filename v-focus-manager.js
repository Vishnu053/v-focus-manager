class FocusManager {
    constructor(arrowKeyMapping = null) {
        this.focusableClass = 'v-focusable';
        this.focusedElement = null;
        this.focusStyleConfig = {
          border: true,
          borderColor: '#0000ff',
          borderThickness: '2px',
          backgroundColor: null,
          borderRadius: '0px',
          animate: false,
          animationStyle: null,
          transitionDuration: '0.3s',
          transitionTimingFunction: 'ease',
          scrollIntoView: true,
        };
        this.nextKeyDownOverride = null;
        this.nextKeyDownOverrideKey = null;
      
        // Allow only one mapping
        this.arrowKeyMapping = arrowKeyMapping || {
          'ArrowUp': 'ArrowUp',
          'ArrowDown': 'ArrowDown',
          'ArrowLeft': 'ArrowLeft',
          'ArrowRight': 'ArrowRight',
        };
      
        this.initialize(null);
      }
  
    initialize(initialFocusElement = null) {
      this.focusableElements = Array.from(document.querySelectorAll(`.${this.focusableClass}`));
      if (this.focusableElements.length > 0) {
        this.focusOnElement(initialFocusElement || this.focusableElements[0]);
      }
      this.addEventListeners();
    }
  
    addEventListeners() {
      const debouncedKeyDownHandler = this.debounce((e) => {
        if (e.repeat) return;
        if (this.shouldHandleNextKeyDownOverride(e)) {
          this.nextKeyDownOverride(e);
          this.nextKeyDownOverride = null;
          this.nextKeyDownOverrideKey = null;
        } else if (this.handleKeyDown) {
          this.handleKeyDown(e);
        } else {
          this.defaultKeyDownHandler(e);
        }
      }, 50);

      document.addEventListener('keydown', debouncedKeyDownHandler);
    }
  
    debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }

    shouldHandleNextKeyDownOverride(e) {
      return this.nextKeyDownOverride && (!this.nextKeyDownOverrideKey || this.nextKeyDownOverrideKey === e.key);
    }

    defaultKeyDownHandler(e) {
      switch (this.arrowKeyMapping[e.key]) {
        case 'ArrowUp':
          e.preventDefault();
          this.moveFocus('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.moveFocus('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.moveFocus('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.moveFocus('right');
          break;
        case 'Enter':
          e.preventDefault();
          if (this.shouldHandleNextKeyDownOverride(e)) {
            this.nextKeyDownOverride(e);
            this.nextKeyDownOverride = null;
            this.nextKeyDownOverrideKey = null;
          } else if (this.focusedElement && this.focusedElement.onFocusEnterPress) {
            this.focusedElement.onFocusEnterPress(e);
          } else if (this.focusedElement) {
            if (this.focusedElement.tagName === 'BUTTON' || (this.focusedElement.tagName === 'INPUT' && this.focusedElement.type === 'checkbox')) {
              this.focusedElement.click();
            } else {
              this.showNotification(`Focused element: ${this.focusedElement.tagName}`);
            }
          }
          break;
      }
    }
  
    showNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.padding = '10px';
      notification.style.backgroundColor = '#333';
      notification.style.color = '#fff';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '1000';
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  
    focusOnElement(element) {
      if (this.focusedElement) {
        this.focusedElement.style.transition = `outline ${this.focusStyleConfig.transitionDuration} ${this.focusStyleConfig.transitionTimingFunction}, background-color ${this.focusStyleConfig.transitionDuration} ${this.focusStyleConfig.transitionTimingFunction}, border-radius ${this.focusStyleConfig.transitionDuration} ${this.focusStyleConfig.transitionTimingFunction}`;
        this.focusedElement.style.outline = '';
        if (this.focusStyleConfig.backgroundColor) {
          this.focusedElement.style.backgroundColor = '';
        }
        if (this.focusStyleConfig.borderRadius) {
          this.focusedElement.style.borderRadius = '';
        }
        if (this.focusStyleConfig.animate) {
          this.focusedElement.classList.remove(this.focusStyleConfig.animationStyle);
        }
      }
      this.focusedElement = element;
      if (this.focusedElement) {
        if (this.focusStyleConfig.scrollIntoView) {
          this.focusedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        this.focusedElement.focus();
        this.focusedElement.style.transition = `outline ${this.focusStyleConfig.transitionDuration} ${this.focusStyleConfig.transitionTimingFunction}, background-color ${this.focusStyleConfig.transitionDuration} ${this.focusStyleConfig.transitionTimingFunction}, border-radius ${this.focusStyleConfig.transitionDuration} ${this.focusStyleConfig.transitionTimingFunction}`;
        if (this.focusStyleConfig.border) {
          this.focusedElement.style.outline = `${this.focusStyleConfig.borderThickness} solid ${this.focusStyleConfig.borderColor}`;
        }
        if (this.focusStyleConfig.backgroundColor) {
          this.focusedElement.style.backgroundColor = this.focusStyleConfig.backgroundColor;
        }
        if (this.focusStyleConfig.borderRadius) {
          this.focusedElement.style.borderRadius = this.focusStyleConfig.borderRadius;
        }
        if (this.focusStyleConfig.animate) {
          this.focusedElement.classList.add(this.focusStyleConfig.animationStyle);
        }
      }
    }
  
    moveFocus(direction) {
      if (!this.focusedElement) return;
  
      let nearestElement = null;
      let minDistance = Infinity;
      const currentRect = this.focusedElement.getBoundingClientRect();
  
      for (let i = 0; i < this.focusableElements.length; i++) {
        const element = this.focusableElements[i];
        if (element === this.focusedElement) continue;
  
        const rect = element.getBoundingClientRect();
        let isValid = false;
        let distance = Infinity;
  
        switch (direction) {
          case 'up':
            if (rect.bottom <= currentRect.top) {
              distance = Math.abs(currentRect.top - rect.bottom) + Math.abs(currentRect.left - rect.left);
              isValid = true;
            }
            break;
          case 'down':
            if (rect.top >= currentRect.bottom) {
              distance = Math.abs(rect.top - currentRect.bottom) + Math.abs(currentRect.left - rect.left);
              isValid = true;
            }
            break;
          case 'left':
            if (rect.right <= currentRect.left) {
              distance = Math.abs(currentRect.left - rect.right) + Math.abs(currentRect.top - rect.top);
              isValid = true;
            }
            break;
          case 'right':
            if (rect.left >= currentRect.right) {
              distance = Math.abs(rect.left - currentRect.right) + Math.abs(currentRect.top - rect.top);
              isValid = true;
            }
            break;
        }
  
        if (isValid && distance < minDistance) {
          minDistance = distance;
          nearestElement = element;
        }
      }
  
      if (nearestElement) {
        this.focusOnElement(nearestElement);
      }
    }
  
    setCustomKeyDownHandler(handler) {
      this.handleKeyDown = handler;
    }
  
    changeFocusStyle(config) {
      this.focusStyleConfig = { ...this.focusStyleConfig, ...config };
    }
  
    overrideNextKeyDown(handler, key = null) {
      this.nextKeyDownOverride = handler;
      this.nextKeyDownOverrideKey = key;
    }
  }
  
  // Initialize FocusManager when the DOM content is loaded
  window.changeFocusStyle = (config) => {
    if (window.focusManager) {
      window.focusManager.changeFocusStyle(config);
    }
  };
