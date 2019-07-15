[![Main Photo](./Photo.png)][Demo]

# RippleTouch

> Touch with a ripple especially for ES6 supported browsers.

![Latest Tag](https://img.shields.io/github/tag-date/PaperFlu/RippleTouch.svg) ![License](https://img.shields.io/github/license/PaperFlu/RippleTouch.svg)

Ripple, ripple, ripple. A ready-to-use, no cofiguration needed web component for modern browsers. **3.85kb** (v8.1490.1, minified) in total, wrote with JSDoc syntax, it's **fast** and **elegant**. That's it.

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
import('./Ripple.min.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
```

## Usage

Preparation: [Click here to download](https://github.com/PaperFlu/RippleTouch/releases/latest/download/RippleTouch.zip) the latest **Ripple.zip** asset directly, or go to [the release page](https://github.com/PaperFlu/RippleTouch/releases) to choose another version of it.

### Install

First, extract **Ripple.min.js** to wherever you want.

Second, add attribute `[Ripple]` to select the elements which has the effect. Example:

```html
<button Ripple>Boom</button>
```

Finally, import it from where you extracted it and call `Ripple.load`. For standard import method using static `import` statement, **remember** to give the \<script\> a `type="module"`, otherwise the `import` statement will be unusable.

```javascript
// <scrip src="example.js" type="module"></script> in example.html
// Below is example.js
import Ripple from './lib/Ripple.min.js';
Ripple.load();
```

or use a function-like dynamic `import()` like the [example](#example) does. It's **[recommended](#use-dynamic-import)**. `type="module"` is needless there. Done. 😉

### Update

Extract the latest achieve to where you stored **Ripple.min.js** and overwrite it. In most cases, it's done.

#### From v8.1482.0 or older:

Pay attention to `Ripple.markWord`. It's called `Ripple.mark` now.

#### From v7.1479.1 or older:

Check files whose name starts with **Ripple** to delete obsolete one. From v7.1479.2, there should only be one file, **Ripple.min.js** or **Ripple.js**, in your project folder.

## Configuration

Unnecessary but well-tested adjustments in the latest release.

### Limit Scope

Post an element to `Ripple.load` after importing the module:

```javascript
// ... (Imported Ripple object)
const earth = document.getElementById('earth');
Ripple.load(earth);
```

Elements outside `earth` will have **no ripple effects** even if it has a `[Ripple]` attribute. RippleTouch uses event listeners to set up effects, and the listeners will be added to the element specified. If **no** element been posted, `document.body` will take its place.

Limiting scope may improve performance because outside it will not examine whether the element user interacted has `[Ripple]` or not anymore. You can use `Ripple.load` many times to extend scope for different parts of your page. But usually, a single execution without parameter is totally enough.

### Avoid Variable Conflicts

`[Ripple]` identity can be changed. If other HTML or CSS use the same word, change it **before the first run of `Ripple.load`** may avoid unexpected behavior. Example here:

```javascript
// ... (Imported Ripple object but executed Ripple.load)
Ripple.mark += Math.floor(Math.random() * 10 ** 10).toString();
Ripple.load();

// Turn some elements to a lake.
const buttons = document.getElementsByTagName('button');
buttons.forEach((ele) => ele.setAttribute(Ripple.mark, ''));
// ...
```

Then buttons will be like:

```html
<button Ripple3663492410>Shakalaka</button>
```

### Style Properties

These css custom properties can be changed by `Ripple.set` **at anytime**:

```javascript
styleProperties = {
  initialScale: 0.6,
  backgroundColor: 'rgba(0,0,0,.06)',
  runningDuration: '300ms',
  opacityDuration: '83ms',
};
```

-   At the **beginning** of the animation, the diameter of ripple is **60% of the longer** between the width and height in default. If I want it smaller:
    ```javascript
    Ripple.set({ initialScale: 0.3 });
    ```

-   Ripples' background color is **rgba(0, 0, 0, 0.06)** in default. Defined by `backgroundColor`. The **same method** as `initialScale` to change it.

-   Ripples will **enlarge for 300ms** until it filled up the element in default. Defined by `runningDuration`.

-   All **opacity changes last for 83ms** in default. Defined by `opacityDuration`.

## Notes

Suggestions and imperfections in the latest release.

### Use dynamic import

If you use static `import` statement to import modules, you will be **UNABLE** to access them outside the \<script\> marked `type="module"`. So, in my *personal* views, use dynamic import always if there is no need to consider such a small browser compatibility difference. (For example, Chrome leaves 61-63 and Firefox leaves 60-67 away, according to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility).)

Ignore it if you use tools like [Babel](https://babeljs.io).

### Determine the mark before load

Stylesheets will be generated and appended to `document.body` with `Ripple.mark` at the first execution of `Ripple.load`.

Changing the word afterwards seems meaningless. So the mark is **forced unwritable** once `Ripple.load` has executed.

```javascript
Ripple.mark = 'Ripple1683247813';
Ripple.load();

// Will not change.
// At strict mode, throws a TypeError:
// "mark" is read-only.
// And will not change, either.
Ripple.mark = 'Ripple2347119623';
```

### One ripple at the same time

Haven't been well-adjusted for mobile devices.

- Events will be delayed about 300ms if users have options like "`force enable zoom`" enabled in [browsers that doesn't support pointer events](https://caniuse.com/#feat=pointer), which makes the web page being felt laggy.

- It can only make **one** ripple at the same time. Use two fingers touch at the two blocks in the [demo][Demo], you will get it. There isn't a plan to fix it for now.

## Support

Issues will be opened soon. 😛

## License

RippleTouch is [MIT licensed](https://github.com/PaperFlu/RippleTouch/blob/master/LICENSE).

[Demo]: https://paperflu.github.io/RippleTouch