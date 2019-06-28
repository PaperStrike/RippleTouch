/**
 * 6.28
 */

let Ripple;
import('./Modules/Ripple.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
