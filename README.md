
# FocusManager Library

The **v-focus-manager** library is a lightweight, customizable JavaScript utility for managing keyboard + TV remote navigation and focus styles for focusable elements. It is ideal for applications requiring easy navigation using keyboard arrow keys, such as web apps for TV remotes, accessibility-focused apps, or grid-based interfaces.

---

## Features

- **Keyboard Navigation**: Navigate focusable elements using arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`).
- **Customizable Styles**: Define focus styles, including borders, colors, background, and animations.
- **Dynamic Focus Management**: Automatically identify focusable elements and adjust focus dynamically based on navigation direction.
- **Scroll Into View**: Ensure the focused element is visible in the viewport.
- **Event Customization**: Override keydown behavior for specific use cases.
- **Notification Support**: Debug focus behavior with in-browser notifications.

---

## Installation

Simply include the script in your project:

```html
<script src="path-to-focus-manager.js"></script>
```

---

## Usage

### Initialization

Create a new `FocusManager` instance:

```javascript
const focusManager = new FocusManager();
```

You can also provide custom key mappings during initialization:

```javascript
const focusManager = new FocusManager({
  'w': 'ArrowUp',
  's': 'ArrowDown',
  'a': 'ArrowLeft',
  'd': 'ArrowRight',
});
```

---

## API Reference

### Constructor

```javascript
new FocusManager(arrowKeyMapping = null)
```

- **`arrowKeyMapping`** (Optional): An object that maps custom keys to navigation directions. If not provided, the default arrow keys are used.

**Default Mapping**:

```javascript
{
  'ArrowUp': 'ArrowUp',
  'ArrowDown': 'ArrowDown',
  'ArrowLeft': 'ArrowLeft',
  'ArrowRight': 'ArrowRight',
}
```

---

### Methods

#### 1. `initialize(initialFocusElement = null)`

Initializes the `FocusManager` by finding all focusable elements and optionally focusing a specified element.

```javascript
focusManager.initialize(document.getElementById('start-element'));
```

---

#### 2. `focusOnElement(element)`

Focuses a specific element and applies the configured focus styles.

```javascript
const targetElement = document.querySelector('.v-focusable');
focusManager.focusOnElement(targetElement);
```

---

#### 3. `moveFocus(direction)`

Moves focus to the nearest focusable element in the specified direction (`up`, `down`, `left`, `right`).

```javascript
focusManager.moveFocus('up');
focusManager.moveFocus('right');
```

---

#### 4. `setCustomKeyDownHandler(handler)`

Sets a custom keydown event handler to override the default behavior.

```javascript
focusManager.setCustomKeyDownHandler((event) => {
  if (event.key === 'Enter') {
    console.log('Custom Enter behavior');
  }
});
```

---

#### 5. `changeFocusStyle(config)`

Updates the focus styles dynamically.

**Example Configuration**:

```javascript
focusManager.changeFocusStyle({
  borderColor: '#ff0000',
  borderThickness: '3px',
  backgroundColor: '#f0f0f0',
  borderRadius: '5px',
  animate: true,
  animationStyle: 'pulse-animation',
  scrollIntoView: false,
});
```

---

#### 6. `overrideNextKeyDown(handler, key = null)`

Overrides the behavior for the next keydown event for a specific key.

```javascript
focusManager.overrideNextKeyDown(() => {
  console.log('Next keydown behavior overridden');
}, 'Enter');
```

---

## Examples

### Example 1: Default Focus Navigation

```html
<div class="v-focusable" tabindex="0">Item 1</div>
<div class="v-focusable" tabindex="0">Item 2</div>
<div class="v-focusable" tabindex="0">Item 3</div>

<script>
  const focusManager = new FocusManager();
  focusManager.initialize();
</script>
```

Use arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) to navigate between items.

---

### Example 2: Custom Key Mapping

```html
<div class="v-focusable" tabindex="0">Item A</div>
<div class="v-focusable" tabindex="0">Item B</div>
<div class="v-focusable" tabindex="0">Item C</div>

<script>
  const focusManager = new FocusManager({
    'w': 'ArrowUp',
    's': 'ArrowDown',
    'a': 'ArrowLeft',
    'd': 'ArrowRight',
  });
  focusManager.initialize();
</script>
```

Use **W**, **A**, **S**, **D** keys to navigate between items.

---

### Example 3: Custom Focus Styles

```html
<div class="v-focusable" tabindex="0">Custom Styled 1</div>
<div class="v-focusable" tabindex="0">Custom Styled 2</div>

<script>
  const focusManager = new FocusManager();
  focusManager.changeFocusStyle({
    borderColor: 'green',
    backgroundColor: 'lightyellow',
    borderRadius: '10px',
    animate: true,
    transitionDuration: '0.5s',
  });
  focusManager.initialize();
</script>
```

The focus style will include a green border, light yellow background, and rounded corners.

---

### Example 4: Custom Keydown Behavior

```html
<div class="v-focusable" tabindex="0">Press Enter</div>

<script>
  const focusManager = new FocusManager();
  focusManager.setCustomKeyDownHandler((event) => {
    if (event.key === 'Enter') {
      alert('Custom Enter key behavior!');
    }
  });
  focusManager.initialize();
</script>
```

Pressing the Enter key triggers a custom behavior.

---

### Debugging

Use the built-in notification system to log debugging messages when focusing an element:

```javascript
focusManager.showNotification('Focus changed!');
```

---

## License

This library is open-source and licensed under the MIT License.

---

## Contributing

Contributions are welcome! If you encounter any bugs or have feature requests, please create an issue or submit a pull request.
