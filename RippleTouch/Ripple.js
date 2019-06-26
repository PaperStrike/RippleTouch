/**
 * Touch with a ripple.
 * 
 * @module  RippleTouch/Ripple
 * @version 6.1472-20190618
 * @license Apache-2.0
 */

/** Module Information. Necessary for generating CSS URL. */
let currentURL, modulePathLength, modulePath;

currentURL = import.meta.url;
modulePathLength = currentURL.lastIndexOf('/') + 1;
modulePath = currentURL.substr(0, modulePathLength);

/**
 * Overwrite properties in the target by properties in the source.
 * @param {Object} target - object to be updated.
 * @param {Object} source - like a patch.
 */
const objectDeepAssign = function copyTheValuesToTarget(target, source) {
  Object.keys(source).forEach((sourcePropName) => {
    let targetProp, sourceProp;
    targetProp = target[sourcePropName];
    sourceProp = source[sourcePropName];

    // TODO: Make condition looks better.
    if(typeof targetProp + typeof sourceProp === 'object'.repeat(2)) {
      objectDeepAssign(targetProp, sourceProp);
    }
    else {
      target[sourcePropName] = sourceProp;
    }
  });
};

/**
 * Set multiple property in once.
 * @param {HTMLElement} ele
 * @param {Object} properties
 */
const setStyleProperties = function setMultipleProperties(ele, properties) {
  Object.keys(properties).forEach((propertyName) => {
    const value = properties[propertyName];
    ele.style.setProperty(propertyName, value);
  });
};

/**
 * Replace the specified class with the other specified class.
 * @param {Element} ele - specified element.
 * @param {string} from - the old class.
 * @param {string} to - the new class.
 */
const classSwitch = function replaceTheClassWithOneAnother(ele, [from, to]) {
  ele.classList.remove(from);
  ele.classList.add(to);
};

/**
 * Can be reset by using Ripple.set. CSS part needs edit CSS first.
 * @property {string} markWord - HTML attribute to be matched.
 * @property {number} initialScale - initial size of diameter.
 * @property {Object} CSS - data of stylesheet.
 */
const settings = {
  markWord: 'Ripple',
  initialScale: 0.6,
  /**
   * @namespace
   * @property {Element} ele
   * @property {string} URL
   */
  CSS: {
    ele: document.createElement('style'),
    URL: modulePath + 'Ripple.css',
    /** @enum {string} */
    animationNames: {
      running: 'ripple-running',
      ended: 'ripple-ended',
    },
    /** @enum {string} */
    propertyNames: {
      center: '--ripple-center',
      clickPosition: '--ripple-kiss-point',
      diameter: '--ripple-diameter',
      scale: '--ripple-scale',
    },
  },
};

/**
 * @property {boolean} animating
 * @property {boolean} focusing
 * @property {?Element} currentEle
 */
const state = {
  animating: false,
  focusing: false,
  currentEle: null,
};

/**
 * Containing functions which expose to environment.
 * @enum {Function}
 */
const Ripple = {
  /**
   * Reset some settings.
   * @param {Object} newSettings
   */
  set(newSettings) {
    objectDeepAssign(settings, newSettings);
  },

  /**
   * Set up CSS, HTML and a optional working space.
   * @param {Element} lake
   */
  load(lake = document.body) {
    // Append <style> if haven't.
    const { CSS } = settings;
    if (!CSS.ele.isConnected) {
      CSS.ele.innerText = `@import url(${CSS.URL})`;
      document.body.appendChild(CSS.ele);
    }

    // Bind events.
    lake.addEventListener('mousedown', Ripple.start);
    lake.addEventListener('mouseup', Ripple.blur);
    lake.addEventListener('animationend', Ripple.animationEnd);
  },

  /**
   * Start the effect when mouse goes down.
   * @param {number} offsetX
   * @param {number} offsetY
   * @param {Element} target
   */
  start({ offsetX, offsetY, target }) {

    // Return if it hasn't been marked.
    if (!target.hasAttribute(settings.markWord)) return;

    // Be ready to create a ripple.
    // Force stop if hasn't, and update state.
    if (state.currentEle) Ripple.stop();
    state.animating = true;
    state.focusing = true;
    state.currentEle = target;

    const { clientWidth: width, clientHeight: height } = target;

    // Most of these parts can and should be done in CSS4.
    // But at present browsers don't support many necessary math functions.
    // Default diameter is 60% of the longer one between the width and height.
    const diameter = Math.max(width, height) * settings.initialScale;
    const finalScale = Math.hypot(width, height) / diameter;
  
    // Apply to the element.
    const { propertyNames, animationNames } = settings.CSS;
    setStyleProperties(target, {
      [propertyNames.center]: `${width / 2}px, ${height / 2}px`,
      [propertyNames.clickPosition]: `${offsetX}px, ${offsetY}px`,
      [propertyNames.diameter]: `${diameter}px`,
      [propertyNames.scale]: finalScale,
    });
    classSwitch(target, [animationNames.ended, animationNames.running]);
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
   * @param {string} animationName
   */
  animationEnd({ animationName }) {
    // Return if nothing is rippling.
    if (!state.currentEle) return;

    // Return if the animation is not the one we want.
    const { animationNames } = settings.CSS;
    if (animationName !== animationNames.running) return;

    state.animating = false;

    // Stop if not focusing. Similar to the end of Ripple.blur.
    if (!state.focusing) Ripple.stop();
  },

  /**
   * Stop the ripple.
   */
  stop() {
    const { currentEle } = state;

    // End CSS animation.
    const { animationNames } = settings.CSS;
    classSwitch(currentEle, [animationNames.running, animationNames.ended]);

    // Restore the state.
    state.currentEle = null;
  },
};

export default Ripple;
