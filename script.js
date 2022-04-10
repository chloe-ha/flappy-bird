import { setupBird, updateBird, getBirdRect } from './bird.js';
import { setupPipes, updatePipes, getPassedPipesCount, getPipeRects } from './pipe.js';

document.addEventListener('keypress', handleStart, { once: true });

const title = document.querySelector('[data-title]');
const subtitle = document.querySelector('[data-subtitle]');

let lastTime;

function updateLoop(time) {
  if (lastTime === undefined) {
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
    return;
  }
  const delta = time - lastTime;
  updateBird(delta);
  updatePipes(delta);
  if (checkLoose()) return handleLoose();
  lastTime = time;
  window.requestAnimationFrame(updateLoop);
}

function handleStart() {
  title.classList.add('hide');
  setupBird();
  setupPipes();
  lastTime = undefined;
  window.requestAnimationFrame(updateLoop);
}

function checkLoose() {
  const birdRect = getBirdRect();
  const outsideWord = birdRect.top < 0 || birdRect.bottom > window.innerHeight;
  const insidePipe = getPipeRects().some((rect) => isCollision(birdRect, rect));
  return outsideWord || insidePipe;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function handleLoose() {
  setTimeout(() => {
    title.classList.remove('hide');
    subtitle.classList.remove('hide');
    subtitle.textContent = `${getPassedPipesCount()} Pipes`;
    document.addEventListener('keypress', handleStart, { once: true });
  }, 100);
}
