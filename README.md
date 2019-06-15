[![Main Photo](./Photo.png)][Demo]

# RippleTouch

> Touch with a ripple | ES6 Module

![Latest Tag](https://img.shields.io/github/tag-date/PaperFlu/RippleTouch.svg) ![License](https://img.shields.io/github/license/PaperFlu/RippleTouch.svg)

Well, badgers so much.

### Index

- [Example](#example)
- [Usage](#usage)
- [Configuration](#configuration)
- [Limitations](#limitations)
- [Support](#support)
- [License](#license)

---

## Example

Click the image above or [here][Demo] to see the demo. Typical code:

```html
<div class="ripples" style="background: #03dac5;" Ripple>
  Ripples?
</div>
```

and (dynamic import):

```javascript
let Ripple;
import('./RippleTouch/Ripple.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
```

## Usage

First, add attribute `[Ripple]` to select the elements which has the effect. Example:

```html
<button Ripple>Boom Shakalaka</button>
```

Finally, import Ripple in your script. For standard import, remember to give the script a `type="module"`, otherwise the `import` statement will be unusable.

```javascript
import Ripple from './RippleTouch/Ripple.js';
Ripple.load();
```

or use a function-like dynamic `import()` like the [Example](#example) does. **Recommended**. `type="module"` is needless there.

## Configuration

Unnecessary but well-tested configuration.

### Limit Scope

Post an element to `Ripple.load` when load it:

```javascript
const lake = document.getElementById('lake');
Ripple.load(lake);
```

Elements outside `lake` will have no ripple effects even if it has a `[Ripple]` attribute.

### Others


When the animation begins, the diameter of ripple is 60% of the longer between the width and height in default. Change it by using `Ripple.set`. If I want it smaller:

```javascript
Ripple.set({initialScale: 0.3});
```

All settings can be changed are listed here:

```javascript
settings = {
  markWord: 'Ripple', // HTML attribute.
  initialScale: 0.6,
  // Change Ripple.CSS settings seems meaningless.
  // You will always need to edit CSS first.
  CSS: {
    ele: document.createElement('style'),
    URL: modulePath + 'Ripple.css',
    animationNames: {
      running: 'ripple-running',
      ended: 'ripple-ended',
    },
    propertyNames: {
      center: '--ripple-center',
      clickPosition: '--ripple-kiss-point',
      diameter: '--ripple-diameter',
      scale: '--ripple-scale',
    },
  },
};
```

## Limitations

If you use static `import` statement to import modules, you can **NOT** access them outside the scripts marked `type="module"`. So, in my *personal* views, use dynamic import **always** if you have no need to consider such a small browser compatibility difference. (For example, Chrome leaves 61-63 and Firefox takes 60-67. According to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility).)

Haven't been well-adjusted for mobile devices. You can only make **one** ripple at a same time. Use two fingers touch at the two blocks in the [demo][Demo], you will see it.

## Support

Issues will be opened soon.

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

[Demo]: https://paperflu.github.io/RippleTouch
