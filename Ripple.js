/**
 * @version 3.1457-20190606
 */

/**
 * Import ripple styles.
 */
const rippleStyle = document.createElement('style');
let rippleStyleURL;
{
  let currentURL, modulePathLength, modulePath;

  currentURL = import.meta.url;
  modulePathLength = currentURL.lastIndexOf('/') + 1;
  modulePath = currentURL.substr(0, modulePathLength);

  rippleStyleURL = modulePath + 'Ripple.css';
}
rippleStyle.innerText = `@import url(${rippleStyleURL})`;
document.body.appendChild(rippleStyle);

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
   * Reset if you want. Many of them need edit CSS first.
   * @namespace
   * @property {string} markWord
   * @property {number} rippleScale
   */
  settings: {
    markWord: 'Ripple',
    rippleScale: 0.6,
    /** @enum {string} */
    animationNames: {
      running: 'ripple-running',
      ended: 'ripple-ended',
    },
    /** @enum {string} */
    stylePropertyNames: {
      center: '--ripple-center',
      clickPosition: '--ripple-kiss-point',
      diameter: '--ripple-diameter',
      scale: '--ripple-scale',
    },
  },

  /**
   * @namespace
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
   * Apply the effect to document.body.
   */
  load() {
    document.body.addEventListener('mousedown', Ripple.start);
    document.body.addEventListener('mouseup', Ripple.blur);
    document.body.addEventListener('animationend', Ripple.animationEnd);
  },

  /**
   * Apply the effect to the specified element.
   * @param {Element} ele
   */
  store(ele) {
    ele.setAttribute(Ripple.settings.markWord, '');
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

    // Most of these parts should be done by using CSS variables.
    // But at present CSS doesn't support some necessary math functions.
    // Default diameter is 60% of the longer one between the width and height.
    const diameter = Math.max(width, height) * settings.rippleScale;
    const scale = Math.hypot(width, height) / diameter;
  
    // Apply to the element.
    const { stylePropertyNames, animationNames } = settings;
    setStyleProperties(target, {
      [stylePropertyNames.center]: `${width / 2}px, ${height / 2}px`,
      [stylePropertyNames.clickPosition]: `${offsetX}px, ${offsetY}px`,
      [stylePropertyNames.diameter]: `${diameter}px`,
      [stylePropertyNames.scale]: scale,
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
    const { animationNames } = Ripple.settings;
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

    // Return if nothing is rippling.
    if (!currentEle) return;

    // End CSS animation.
    const { animationNames } = Ripple.settings;
    classSwitch(currentEle, [animationNames.running, animationNames.ended]);

    // Restore the state.
    Ripple.state.currentEle = null;
  },
};

Ripple.load();

export default Ripple;
