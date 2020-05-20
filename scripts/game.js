/* eslint-disable-next-line no-unused-vars */
const main = (function () {
  const engine = window.gameEngine;
  const utils = window.gameUtils;

  if (!engine) {
    console.log('All files were not imported! Unable to start');
    return {};
  }

  const defaultCatDelay = 1000;
  const catDelays = [1000, 750, 500, 400, 300, 200, 100];

  let gameOn = false;
  let catDelay = defaultCatDelay;
  let catSpeedInterval;

  function startCatSpeedUp() {
    catSpeedInterval = setInterval(function () {
      console.log("cat speed set");
      const currentDelayIndex = catDelays.indexOf(catDelay);
      if (currentDelayIndex !== catDelays.length - 1) {
        catDelay = catDelays[currentDelayIndex + 1];
        console.log("setting cat speed: ", catDelay);
      }
    }, 10000);
  }

  function endCatSpeedUp() {
    clearInterval(catSpeedInterval);
    catDelay = defaultCatDelay;
  }

  function reset() {
    engine.updateScore(0);
    engine.moveCat(0, 0);
    endCatSpeedUp();
    setTimeout(function() {
      startGame();
    }, 1000);
  }

  function checkGameEnd() {
    const gameEnded = engine.hasCatCaughtMouse();
    if (gameEnded) {
      gameOn = false;
      alert('Awww, you go caught! You scored ' + engine.getScore() + ' points!');
      reset();
    }
  }

  function handleGameRound(coordinates) {
    const xCoordinate = coordinates.x;
    const yCoordinate = coordinates.y;

    engine.moveMouse(xCoordinate, yCoordinate);
    setTimeout(function () {
      if (gameOn) {
        engine.moveCat(xCoordinate, yCoordinate);
        checkGameEnd();
      }
    }, catDelay);
    engine.createTrailMarkIfNeeded(xCoordinate, yCoordinate, catDelay);
    engine.eatCheeseIfPossible(xCoordinate, yCoordinate);
  }

  function handleMouseMove(mouseEvent) {
    if (gameOn) {
      const racingArea = engine.getRacingArea();
      const coordinates = utils.getCoordinatesFromMouseMove(mouseEvent, racingArea);

      handleGameRound(coordinates);
    }
  }

  function handleTouchStart(event) {
    console.log('touch started!', event);
  }

  function handleTouchMove(event) {
    if (gameOn) {
      const racingArea = engine.getRacingArea();
      const coordinates = utils.getCoordinatesFromTouchEvent(event, racingArea);
      handleGameRound(coordinates);
    }
  }

  function handleTouchEnd(event) {
    console.log('touch ended!', event);
  }

  function startGame() {
    engine.initialize();
    startCatSpeedUp();
    gameOn = true;
  }

  window.onload = startGame;

  return { handleMouseMove, handleTouchStart, handleTouchMove, handleTouchEnd };
})();
