[![Main Photo](./Photo.png)][Demo]

# RippleTouch

> Touch with a ripple | ES6 Module

![Latest Tag](https://img.shields.io/github/tag-date/PaperFlu/RippleTouch.svg) ![License](https://img.shields.io/github/license/PaperFlu/RippleTouch.svg)

Ripple, ripple, ripple. A ready-to-use, no cofiguration needed web component for modern browsers. **7.57kb** (v6.1473, unzipped) in total, JSDoc written, it's **fast** and **elegant**. That's it.

### Index 😃

- [Example](#example)
- [Usage](#usage)
- [Configuration](#configuration)
- [Notes](#notes)
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

and script (dynamic import):

```javascript
let Ripple;
import('./RippleTouch/Ripple.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
```

## Usage

First, [click here to download](https://github.com/PaperFlu/RippleTouch/releases/latest/download/RippleTouch.zip) the latest **RippleTouch.zip** asset directly, or go to [the release page](https://github.com/PaperFlu/RippleTouch/releases) to choose another version of it. Then extract the files to your project folder.

Second, add attribute `[Ripple]` to select the elements which has the effect. Example:

```html
<button Ripple>Boom Shakalaka</button>
```

Finally, import module files from where you extracted them. You **only** need to import the script, then it will import CSS automatically from **the same** folder. For standard import method using static `import` statement, **remember** to give the \<script\> a `type="module"`, otherwise the `import` statement will be unusable.

```javascript
// <scrip src="example.js" type="module"></script> in example.html
// Below is example.js
import Ripple from './RippleTouch/Ripple.js';
Ripple.load();
```

or use a function-like dynamic `import()` like the [example](#example) does. It's [**recommended**](#use-dynamic-import). `type="module"` is needless there. Done. 😉

## Configuration

Unnecessary but well-tested adjustments.

### Limit Scope

Post an element to `Ripple.load` after the module is imported:

```javascript
const lake = document.getElementById('lake');
Ripple.load(lake);
```

Elements outside `lake` will have **no ripple effects** even if it has a `[Ripple]` attribute. RippleTouch uses event listeners to set up effects, and the listeners will be added to the element specified. If **no** element been posted, `document.body` will take its place.

Limiting scope may improve performance because outside it will not examine whether the element user interacted has `[Ripple]` or not anymore. You can use `Ripple.load` many times to extend scope for different parts of your page. But usually, a single execution without parameter is totally enough.

### Others

Everything may be changed by `Ripple.set` and their default values are listed here:

```javascript
settings = {
  markWord: 'Ripple', // HTML attribute.
  initialScale: 0.6,
  // Change Ripple.CSS settings seems meaningless.
  // You will always need to edit CSS first.
  CSS: {
    ele: document.createElement('style'),
    URL: modulePath + 'Ripple.css', // CSS file URL.
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

##### Introduction

-   At the **beginning** of the animation, the diameter of ripple is **60% of the longer** between the width and height in default. If I want it smaller:
    ```javascript
    Ripple.set({ initialScale: 0.3 });
    ```

-   If you want to separate the JS and CSS file, post the URL of Ripple.css **before load**, otherwise the **CSS will be load from the same folder** where you import the JS file automatically while loading. The URL may be absolute or relative. Relative one is relative to the URL of the web page.
    ```javascript
    // If current web page locates in 'https://example.com/index.html'
    // CSS will be imported from 'https://example.com/CSS/Ripple.css'
    Ripple.set({ CSS: { URL: './CSS/Ripple.css' } });
    ```

## Notes

Suggestions and imperfections in the latest release.

### Use dynamic import

If you use static `import` statement to import modules, you will be **UNABLE** to access them outside the \<script\> marked `type="module"`. So, in my *personal* views, use dynamic import always if there is no need to consider such a small browser compatibility difference. (For example, Chrome leaves 61-63 and Firefox leaves 60-67 away, according to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility).)

Ignore it if you use tools like [Babel](https://babeljs.io).

### One ripple at a same time

Haven't been well-adjusted for mobile devices.

- Events will be delayed about 300ms if users have options like "`force enable zoom`" enabled in browsers, which makes the web page being felt laggy.

- It can only make **one** ripple at a same time. Use two fingers touch at the two blocks in the [demo][Demo], you will get it. There isn't a plan to fix it for now.

## Support

Issues will be opened soon. 😛

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

[Demo]: https://paperflu.github.io/RippleTouch