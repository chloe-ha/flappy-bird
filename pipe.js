const PIPE_WIDTH = 120;
const HOLE_HEIGHT = 200;
const PIPES_INTERVAL = 1500;
const PIPE_SPEED = 0.75;

let pipes = [];
let timeSinceLastJump = 0;
let passedPipesCount = 0;

export function setupPipes() {
  document.documentElement.style.setProperty('--pipe-width', PIPE_WIDTH);
  document.documentElement.style.setProperty('--hole-height', HOLE_HEIGHT);
  pipes.forEach((p) => p.remove());
  timeSinceLastJump = PIPES_INTERVAL;
  passedPipesCount = 0;
}

export function updatePipes(delta) {
  timeSinceLastJump += delta;

  if (timeSinceLastJump > PIPES_INTERVAL) {
    timeSinceLastJump -= PIPES_INTERVAL;
    createPipe();
  }

  pipes.forEach((pipe) => {
    if (pipe.left + PIPE_WIDTH < 0) {
      pipe.remove();
      passedPipesCount++;
    }
    pipe.left = pipe.left - delta * PIPE_SPEED;
  });
}

export function getPassedPipesCount() {
  return passedPipesCount;
}

export function getPipeRects() {
  return pipes.flatMap((pipe) => pipe.rects());
}

function createPipe() {
  const pipeElement = document.createElement('div');
  const topElement = createPipeSegment('top');
  const bottomElement = createPipeSegment('bottom');
  pipeElement.append(topElement);
  pipeElement.append(bottomElement);
  pipeElement.classList.add('pipe');
  pipeElement.style.setProperty(
    '--hole-top',
    randomNumberBetween(HOLE_HEIGHT * 1.5, window.innerHeight - HOLE_HEIGHT * 1.5)
  );
  const pipe = {
    get left() {
      return parseFloat(pipeElement.style.getPropertyValue('--pipe-left'));
    },
    set left(value) {
      pipeElement.style.setProperty('--pipe-left', value);
    },
    remove() {
      pipes = pipes.filter((p) => p !== pipe);
      pipeElement.remove();
    },
    rects() {
      return [topElement.getBoundingClientRect(), bottomElement.getBoundingClientRect()];
    },
  };
  pipe.left = window.innerWidth;
  document.body.append(pipeElement);
  pipes.push(pipe);
}

function createPipeSegment(position) {
  const segment = document.createElement('div');
  segment.classList.add('segment', position);
  return segment;
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
