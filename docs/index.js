/**
 * 7.06
 */

let Ripple;
import('./Ripple.min.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
