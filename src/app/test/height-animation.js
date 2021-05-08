'use strict';

const FRAMES = 60;
const PERCENTAGE_INCREMENT = 100 / FRAMES;
const ANIMATION_CONFIG = {
  expandParent: '--parent-expanded',
  expandChild: '--content-expanded',
  collapseParent: '--parent-collapsed',
  collapseChild: '-content-collapsed'
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeStep(step, pow = 4) {
  const easedStep = clamp(step, 0, 1);
  return 1 - Math.pow(1 - easedStep, pow);
}

function roundAnimationValue(value) {
  return value.toFixed(5);
}

function generateAnimationKeyframe(animationOffset, yScale) {
  return `${animationOffset}%{transform: scaleY(${yScale});}`
}

function calculateAnimationOffset(animationOffset, easedStep, heightStart, heightEnd = 1) {
  const scale = roundAnimationValue(heightStart + (heightEnd - heightStart) * easedStep);
  const inverseScale = roundAnimationValue(1 / scale);
  const outerAnimation = generateAnimationKeyframe(animationOffset, scale);
  const innerAnimation = generateAnimationKeyframe(animationOffset, inverseScale);
  return { outerAnimation, innerAnimation };
}

function generateAnimationFrames(heightPoint) {
  const parentExpandAnimation = [];
  const childExpandAnimation = [];

  const parentCollapseAnimation = [];
  const childCollapseAnimation = [];

  for (let i = 0; i <= FRAMES; i++) {
    const step = easeStep(i / FRAMES);
    const percentage = roundAnimationValue(i * PERCENTAGE_INCREMENT);
    // Expand animation
    const expandAnimation = calculateAnimationOffset(percentage, step, heightPoint, 1);
    parentExpandAnimation.push(expandAnimation.outerAnimation);
    childExpandAnimation.push(expandAnimation.innerAnimation);
    // Collapse animation
    const collapseAnimation = calculateAnimationOffset(percentage, step, 1, heightPoint);
    parentCollapseAnimation.push(collapseAnimation.outerAnimation);
    childCollapseAnimation.push(collapseAnimation.innerAnimation);
  }

  return {
    expandParent: parentExpandAnimation.join(''),
    expandChild: childExpandAnimation.join(''),
    collapseParent: parentCollapseAnimation.join(''),
    collapseChild: childCollapseAnimation.join('')
  }

}

function generateStyles(fileName) {
  const styles = document.createElement('style');
  styles.classList.add(fileName);
  return styles;
}

function getStyles(fileName) {
  const styles = document.querySelector(`${fileName}`);
  return styles || generateStyles(fileName);
}

export function setUpElementAnimation(animationId, heightScale, element) {
  const animationKeyFrames = generateAnimationFrames(heightScale);

  let stylesContent = '';

  Object.keys(ANIMATION_CONFIG).forEach(key => {
    const animationName = animationId + ANIMATION_CONFIG[key];
    element.style.setProperty(`--${key}`, animationName);
    stylesContent += `@keyframes ${animationName} { ${animationKeyFrames[key]} }`;
  });

  let styles = getStyles(animationId);
  styles.textContent = stylesContent;
  document.head.appendChild(styles);
  return styles;
}
