/**
 * 6.13
 */

let Ripple;
import('./RippleTouch/Ripple.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
