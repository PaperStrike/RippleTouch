/**
 * Touch with a ripple.
 * @module  lib/Ripple
 * @version 8.1491.0-20190721
 * @license Apache-2.0
 */

/**
 * Pollyfiller for standard pointer events.
 * @enum {String}
 */
const PESupported = Boolean(window.PointerEvent);

const eNames = {
  pointerdown: PESupported ? 'pointerdown' : 'touchstart',
  pointerup: PESupported ? 'pointerup' : 'touchend',
}

/**
 * Can be reset by using Ripple.set at anytime.
 * @namespace
 * @property {Number} initialScale
 * @property {String} backgroundColor
 * @property {String} runningDuration
 * @property {String} opacityDuration
 */
const styleProperties = {
  initialScale: 0.6,
  backgroundColor: 'rgba(0,0,0,.06)',
  runningDuration: '300ms',
  opacityDuration: '83ms',
};

/**
 * @property {?Element} scopeEle
 * @property {?Element} cssEle
 * @property {?Element} currentEle
 * @property {Boolean} animating
 * @property {Boolean} focusing
 */
const state = {
  scopeEle: null,
  cssEle: null,
  currentEle: null,
  animating: false,
  focusing: false,
};

/**
 * What expose to environment.
 */
const Ripple = {
  /**
   * Name mainly used. Change may avoid conflicts.
   * @type {String}
   */
  mark: 'Ripple',

  /**
   * Set multiple property in once.
   * @param {HTMLElement} ele
   * @param {Object} properties
   */
  _setStyleProperties(ele, properties) {
    Object.keys(properties).forEach((propertyName) => {
      const value = properties[propertyName];
      ele.style.setProperty(propName(propertyName), value);
    });
  },

  /**
   * Apply style properties.
   */
  _update() {
    Ripple._setStyleProperties(state.scopeEle, styleProperties);
  },

  /**
   * Reset some style properties. **Experimental**
   * @param {Object} newStyleProperties
   */
  set(newStyleProperties) {
    // Update styleProperties' information.
    Object.assign(styleProperties, newStyleProperties);

    // Apply new styleProperties.
    Ripple._update();
  },

  /**
   * Bind events to set an optional working space.
   * @param {Element} [earth=document.body]
   */
  load(earth = document.body) {
    // First load process.
    if (!state.cssEle) {
      // Append <style> element.
      const cssEle = document.createElement('style');
      cssEle.innerText = CSS();
      document.body.appendChild(cssEle);

      state.cssEle = cssEle;

      // Force Ripple.mark unwritable.
      Reflect.defineProperty(Ripple, 'mark', { writable: false });
    }

    // Bind events.
    earth.addEventListener(eNames.pointerdown, Ripple.start);
    earth.addEventListener(eNames.pointerup, Ripple.blur);
    earth.addEventListener('animationend', Ripple.animationEnd);
    state.scopeEle = earth;

    Ripple._update();
  },

  /**
   * Start the effect when mouse goes down.
   * @param {Event} event
   * @param {Number} event.offsetX
   * @param {Number} event.offsetY
   * @param {Element} event.target
   */
  start({ offsetX, offsetY, target }) {
    // Return if it hasn't been marked.
    if (!target.hasAttribute(Ripple.mark)) return;

    // Be ready to create a ripple.
    // Force stop if hasn't, and update state.
    if (state.currentEle) Ripple.stop();
    state.animating = true;
    state.focusing = true;
    state.currentEle = target;

    const { clientWidth: width, clientHeight: height } = target;

    // Most of these parts can and should be done in CSS4.
    // But at present browsers don't support many necessary math functions.
    const longerSideLength = Math.max(width, height);
    const eleDiameter = Math.hypot(width, height);
  
    // Apply to the element.
    Ripple._setStyleProperties(target, {
      center: `${width / 2}px, ${height / 2}px`,
      kissPoint: `${offsetX}px, ${offsetY}px`,
      longerSideLength: `${longerSideLength}px`,
      eleDiameterToLongerSideLength: `${eleDiameter / longerSideLength}`,
    });
    target.classList.remove(animName('ended'));
    target.classList.add(animName('running'));
  },

  /**
   * Stop the effect when mouse goes up if the animation has ended.
   */
  blur() {
    // Return if nothing is rippling.
    if (!state.currentEle) return;

    state.focusing = false;

    // Stop if not animating. Similar to the end of Ripple.animationEnd.
    if (!state.animating) Ripple.stop();
  },

  /**
   * Stop the effect at the end of the animation if the mouse has upped.
   * @param {Event} event
   * @param {String} event.animationName
   */
  animationEnd({ animationName }) {
    // Return if nothing is rippling.
    if (!state.currentEle) return;

    // Return if the animation is not the one we want.
    if (animationName !== animName('running')) return;

    state.animating = false;

    // Stop if not focusing. Similar to the end of Ripple.blur.
    if (!state.focusing) Ripple.stop();
  },

  /**
   * Stop the ripple.
   */
  stop() {
    // End CSS animation.
    const { currentEle } = state;

    currentEle.classList.remove(animName('running'));
    currentEle.classList.add(animName('ended'));

    // Restore the state.
    state.currentEle = null;
  },
};
 
export default Ripple;

/**
 * CSS Parts.
 */

/**
  * Get CSS property name.
  * @param {String} name
  */
const propName = (name) => `--${Ripple.mark}-${name}`;

/**
  * Get CSS animation name or class name.
  * @param {String} name
  */
const animName = (name) => `${Ripple.mark}-${name}`;

/**
 * Generate CSS code by a given unique word.
 * @param {String} [mark=Ripple.mark]
 */
const CSS = (mark = Ripple.mark) => @css``;
