'use strict';
import { ElementHandler } from '../element-handler';
import { numberDefined } from 'UTILS';
import { FRAMES, PERCENTAGE_INCREMENT, ANIMATION_CONFIG } from './height-animation.constants';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeStep(step, pow = 4) {
  const easedStep = clamp(step, 0, 1);
  return 1 - Math.pow(1 - easedStep, pow);
}

function roundAnimationValue(value) {
  return numberDefined(value) ? parseFloat(value.toFixed(5)) : 0;
}

function generateAnimationKeyframe(animationOffset, yScale) {
  return `${animationOffset}%{transform: scaleY(${yScale});}`
}

function getInverseScale(scale) {
  return roundAnimationValue(1 / scale);
}

function calculateAnimationOffset(animationOffset, easedStep, heightStart, heightEnd = 1) {
  const scale = roundAnimationValue(heightStart + (heightEnd - heightStart) * easedStep);
  const inverseScale = getInverseScale(scale);
  const outerAnimation = generateAnimationKeyframe(animationOffset, scale);
  const innerAnimation = generateAnimationKeyframe(animationOffset, inverseScale);
  return { outerAnimation, innerAnimation };
}

function generateAnimationFrames(heightPoint) {
  let expand = '';
  let expandContent = '';
  let collapse = '';
  let collapseContent = '';

  for (let i = 0; i <= FRAMES; i++) {
    const step = easeStep(i / FRAMES);
    const percentage = roundAnimationValue(i * PERCENTAGE_INCREMENT);
    // Expand animation
    const expandAnimation = calculateAnimationOffset(percentage, step, heightPoint, 1);
    expand += `${expandAnimation.outerAnimation}`;
    expandContent += `${expandAnimation.innerAnimation}`;
    // Collapse animation
    const collapseAnimation = calculateAnimationOffset(percentage, step, 1, heightPoint);
    collapse += `${collapseAnimation.outerAnimation}`;
    collapseContent += `${collapseAnimation.innerAnimation}`;
  }

  return { expand, expandContent, collapse, collapseContent };
}

function generateStyles(fileName) {
  const styles = document.createElement('style');
  styles.classList.add(fileName);
  return styles;
}

function getStyles(fileName) {
  const styles = getAnimationStyle(fileName);
  return styles || generateStyles(fileName);
}

function getAnimationStyle(fileName) {
  return document.querySelector(`.${fileName}`);
}

export function generateHeightAnimation(animationId, heightScale, duration = 0.5) {
  const animationKeyFrames = generateAnimationFrames(heightScale);
  const animationClasses = { ...ANIMATION_CONFIG };
  let stylesContent = '';
  let keyframesStyles = '';

  Object.keys(ANIMATION_CONFIG).forEach(key => {
    const animationName = animationId + ANIMATION_CONFIG[key];
    animationClasses[key] = animationName;
    stylesContent += `.${animationName} {animation: ${animationName} ${duration}s linear}`;
    keyframesStyles += `@keyframes ${animationName} { ${animationKeyFrames[key]} }`;
  });

  let styles = getStyles(animationId);
  styles.textContent = `${stylesContent}${keyframesStyles}`;
  document.head.appendChild(styles);
  return animationClasses;
}

export function getAnimationScale(parentElement, childElement) {
  const expandedHeight = ElementHandler.getElementHeight(parentElement);
  const collapsedHeight = ElementHandler.getElementHeight(childElement);
  const scale = roundAnimationValue(collapsedHeight / expandedHeight);
  const inverseScale = getInverseScale(scale);
  return { scale, inverseScale };
}

export function removeAnimationStyles(animationId) {
  const styles = getAnimationStyle(animationId);
  if (styles) {
    styles.remove();
  }
}
