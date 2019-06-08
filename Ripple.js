/**
 * @version 4.1462-20190608
 */

/**
 * Module Information. Necessary for CSS.
 */
let currentURL, moduleDirLength, moduleDir;

currentURL = import.meta.url;
moduleDirLength = currentURL.lastIndexOf('/') + 1;
moduleDir = currentURL.substr(0, moduleDirLength);

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
const classSwitch = function ReplaceTheClassWithOneAnother(ele, [from, to]) {
  ele.classList.remove(from);
  ele.classList.add(to);
};

const Ripple = {
  /**
   * Reset if you want. CSS part needs edit CSS first.
   * @namespace
   * @property {string} markWord
   * @property {number} rippleScale
   */
  settings: {
    markWord: 'Ripple',
    rippleScale: 0.6,
    /**
     * @namespace
     * @property {Element} ele
     * @property {string} URL
     */
    CSS: {
      ele: document.createElement('style'),
      URL: moduleDir + 'Ripple.css',
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
  },

  /**
   * @property {boolean} animating
   * @property {boolean} focusing
   * @property {?Element} currentEle
   */
  state: {
    animating: false,
    focusing: false,
    currentEle: null,
  },

  /**
   * Set up CSS and HTML.
   */
  load() {
    // Append <style>.
    const { CSS } = Ripple.settings;
    CSS.ele.innerText = `@import url(${CSS.URL})`;
    document.body.appendChild(CSS.ele);

    // Bind Events.
    document.body.addEventListener('mousedown', Ripple.start);
    document.body.addEventListener('mouseup', Ripple.blur);
    document.body.addEventListener('animationend', Ripple.animationEnd);
  },

  /**
   * Start the effect when mouse goes down.
   * @param {number} offsetX
   * @param {number} offsetY
   * @param {Element} target
   * @event document~start
   */
  start({ offsetX, offsetY, target }) {
    const { settings, state } = Ripple;

    // Return if it hasn't been marked.
    if (!target.hasAttribute(settings.markWord)) return;

    // Be ready to create a ripple.
    if (state.currentEle) Ripple.end();
    state.animating = true;
    state.focusing = true;
    state.currentEle = target;

    const { clientWidth: width, clientHeight: height } = target;

    // Most of these parts can and should be done in CSS4.
    // But at present browsers don't support many necessary math functions.
    // Default diameter is 60% of the longer one between the width and height.
    const diameter = Math.max(width, height) * settings.rippleScale;
    const scale = Math.hypot(width, height) / diameter;
  
    // Apply to the element.
    const { propertyNames, animationNames } = settings.CSS;
    setStyleProperties(target, {
      [propertyNames.center]: `${width / 2}px, ${height / 2}px`,
      [propertyNames.clickPosition]: `${offsetX}px, ${offsetY}px`,
      [propertyNames.diameter]: `${diameter}px`,
      [propertyNames.scale]: scale,
    });
    classSwitch(target, [animationNames.ended, animationNames.running]);
  },

  /**
   * End the effect when mouse goes up if the animation has ended.
   * @event document~blur
   */
  blur() {
    const { state } = Ripple;

    // Return if nothing is rippling.
    if (!state.currentEle) return;

    state.focusing = false;

    // End if not animating. Similar to the end of Ripple.animationEnd.
    if (!state.animating) Ripple.end();
  },

  /**
   * End the effect at the end of the animation if the mouse has upped.
   * @param {string} animationName
   * @event document~animationEnd
   */
  animationEnd({ animationName }) {
    const { state } = Ripple;

    // Return if nothing is rippling.
    if (!state.currentEle) return;

    // Return if the animation is not the one we want.
    const { animationNames } = Ripple.settings.CSS;
    if (animationName !== animationNames.running) return;

    state.animating = false;

    // End if not focusing. Similar to the end of Ripple.blur.
    if (!state.focusing) Ripple.end();
  },

  /**
   * End the ripple.
   */
  end() {
    const { currentEle } = Ripple.state;

    // End CSS animation.
    const { animationNames } = Ripple.settings.CSS;
    classSwitch(currentEle, [animationNames.running, animationNames.ended]);

    // Restore the state.
    Ripple.state.currentEle = null;
  },
};

Ripple.load();

export default Ripple;
