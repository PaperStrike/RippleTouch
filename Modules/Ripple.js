/**
 * Touch with a ripple.
 * 
 * @module  RippleTouch/Ripple
 * @version 7.1478-20190628
 * @license Apache-2.0
 */

/**
 * Overwrite properties in the target by properties in the source.
 * @param {Object} target - object to be updated.
 * @param {Object} source - like a patch.
 */
const objectDeepAssign = (target, source) => {
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
const setStyleProperties = (ele, properties) => {
  Object.keys(properties).forEach((propertyName) => {
    const value = properties[propertyName];
    ele.style.setProperty(propertyName, value);
  });
};

/**
 * Can be reset by using Ripple.set.
 * @property {Number} initialScale - initial size of diameter.
 */
const settings = {
  initialScale: 0.6,
};

/**
 * property {Element} CSSEle
 * @property {Boolean} animating
 * @property {Boolean} focusing
 * @property {?Element} currentEle
 */
const state = {
  CSSEle: document.createElement('style'),
  animating: false,
  focusing: false,
  currentEle: null,
};

/**
 * What expose to environment.
 */
const Ripple = {
  /**
   * Name mainly used. Change may avoid conflicts.
   * @type {String}
   */
  markWord: 'Ripple',

  /**
   * Reset some settings.
   * @param {Object} newSettings
   */
  set(newSettings) {
    objectDeepAssign(settings, newSettings);
  },

  /**
   * Bind events to set an optional working space.
   * @param {Element} [earth=document.body]
   */
  load(earth = document.body) {
    // Append <style> element if haven't.
    const { CSSEle } = state;

    if (!CSSEle.isConnected) {
      CSSEle.innerText = CSS();
      document.body.appendChild(CSSEle);
      Reflect.defineProperty(Ripple, 'markWord', { writable: false });
    }

    // Bind events.
    earth.addEventListener('mousedown', Ripple.start);
    earth.addEventListener('mouseup', Ripple.blur);
    earth.addEventListener('animationend', Ripple.animationEnd);
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
    if (!target.hasAttribute(Ripple.markWord)) return;

    // Be ready to create a ripple.
    // Force stop if hasn't, then update state.
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
    setStyleProperties(target, {
      [propName('center')]: `${width / 2}px, ${height / 2}px`,
      [propName('kiss-point')]: `${offsetX}px, ${offsetY}px`,
      [propName('diameter')]: `${diameter}px`,
      [propName('scale')]: finalScale,
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
    const { currentEle } = state;

    // End CSS animation.
    currentEle.classList.remove(animName('running'));
    currentEle.classList.add(animName('ended'));

    // Restore the state.
    state.currentEle = null;
  },
};
 
export default Ripple;

/**
 * CSS Stylesheets.
 * @version: 2.1332-20190627
 */

/**
  * Get CSS property name.
  * @param {String} name
  */
const propName = (name) => `--${Ripple.markWord}-${name}`;

/**
  * Get CSS animation name or class name.
  * @param {String} name
  */
const animName = (name) => `${Ripple.markWord}-${name}`;

/**
 * Generate CSS code by a given unique word.
 * @param {String} [markWord=settings.markWord]
 */
const CSS = (markWord = Ripple.markWord) => `
[${markWord}] {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

[${markWord}] > * {
  pointer-events: none;
}

[${markWord}]::before,
[${markWord}]::after {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.06);
  opacity: 0;
  pointer-events: none;
  content: '';
}

[${markWord}]::before {
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
}

[${markWord}]::after {
  /* 使 :after 位于元素左上部分，中点与元素左上点重合 */
  top: calc(var(${propName('diameter')}) / -2);
  left: calc(var(${propName('diameter')}) / -2);
  width: var(${propName('diameter')}, 60px);
  height: var(${propName('diameter')}, 60px);
  transform: translate(var(${propName('center')}, 0));
  transform-origin: center center;
  border-radius: 50%;
}

[${markWord}]:hover::before,
[${markWord}]:hover::after {
  will-change: opacity, transform;
}

[${markWord}].${animName('running')}::before {
  opacity: 1;
  animation: 83ms ${animName('opacity-in')} forwards;
}

[${markWord}].${animName('running')}::after {
  opacity: 1;
  animation: 300ms ${animName('running')} forwards, 83ms opacity-in forwards;
}

[${markWord}].${animName('ended')}::before,
[${markWord}].${animName('ended')}::after {
  transform: translate(var(${propName('center')}, 0)) scale(var(${propName('scale')}, 1));
  animation: 83ms ${animName('opacity-out')} forwards;
}

@keyframes ${animName('running')} {
  from {
    transform: translate(var(${propName('kiss-point')}, 0)) scale(1);
    animation-timing-function: cubic-bezier(.4, 0, .2, 1);
  }

  to {
    transform: translate(var(${propName('center')}, 0)) scale(var(${propName('scale')}, 1));
  }
}

@keyframes ${animName('opacity-in')} {
  from {
    opacity: 0;
    animation-timing-function: linear;
  }

  to {
    opacity: 1;
  }
}

@keyframes ${animName('opacity-out')} {
  from {
    opacity: 1;
    animation-timing-function: linear;
  }

  to {
    opacity: 0;
  }
}
`;
