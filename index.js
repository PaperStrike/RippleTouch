/**
 * 6.29
 */

let Ripple;
import('./lib/Ripple.js')
  .then((module) => {
    Ripple = module.default;
    Ripple.load();
  });
