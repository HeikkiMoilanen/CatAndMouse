/* global firebase */
/* eslint-disable-next-line no-unused-vars */
const main = (function () {
  const engine = window.gameEngine;
  const utils = window.gameUtils;

  if (!engine) {
    console.log("All files were not imported! Unable to start");
    return {};
  }

  const db = firebase.firestore();

  const results = db.collection("scores").get();
  // .then((querySnapshot) => {
  //   querySnapshot.forEach((doc) => {
  //     const dataLine = doc.data();
  //     console.log(dataLine);
  //   });
  // });
  results.then(function (resultStuffs) {
    console.log("ajetaan kun tuli takas:", resultStuffs);
    resultStuffs.forEach((item) => {
      const dataLine = item.data();
      console.log(dataLine);
    });
  });

  const defaultCatDelay = 1000;
  const catDelays = [1000, 750, 500, 400, 300, 200, 100];

  let isDraggingMouse = false;
  let gameOn = false;
  let catDelay = defaultCatDelay;
  let catSpeedInterval;

  function startCatSpeedUp() {
    catSpeedInterval = setInterval(function () {
      const currentDelayIndex = catDelays.indexOf(catDelay);
      if (currentDelayIndex !== catDelays.length - 1) {
        catDelay = catDelays[currentDelayIndex + 1];
      }
    }, 10000);
  }

  function endCatSpeedUp() {
    clearInterval(catSpeedInterval);
    catDelay = defaultCatDelay;
  }

  function hideStartModal() {
    const startModal = document.getElementById("startModal");
    startModal.classList.add("hidden");
  }

  function showScoreScreen() {
    const PERSONAL_BEST = 'personalBest';
    const startModal = document.getElementById("scoreScreen");
    const scoreScreenScoreField = document.getElementById("scoreScreenScoreField");
    const scoreScreenPersonalBestField = document.getElementById("scoreScreenPersonalBestField");
    const score = engine.getScore();
    const scoreText = score === 1
      ? 'You scored ' + score + ' point'
      : 'You scored ' + score + ' points';

    const previousBest = localStorage.getItem(PERSONAL_BEST);
    let personalBestText = '';
    if (!previousBest || score > previousBest) {
      personalBestText = 'New personal best! Congratulations!'
      localStorage.setItem(PERSONAL_BEST, score);
    } else {
      personalBestText = 'Personal best:\n' + previousBest + ' points'
    }

    scoreScreenScoreField.textContent = scoreText;
    scoreScreenPersonalBestField.textContent = personalBestText;
    startModal.classList.remove("hidden");
  }

  function hideScoreScreen() {
    const startModal = document.getElementById("scoreScreen");
    startModal.classList.add("hidden");
  }

  function restart() {
    engine.updateScore(0);
    engine.hideCat();
    endCatSpeedUp();
    startGame();
  }

  function checkGameEnd() {
    const gameEnded = engine.hasCatCaughtMouse();
    if (gameEnded) {
      gameOn = false;
      const racingAreaContainer = document.getElementById(
        "racing-area-container"
      );
      racingAreaContainer.classList.remove("game-on");
      showScoreScreen();
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
      const coordinates = utils.getCoordinatesFromMouseMove(
        mouseEvent,
        racingArea
      );

      handleGameRound(coordinates);
    }
  }

  function handleTouchStart(event) {
    if (event.path[0] === engine.getMouse()) {
      isDraggingMouse = true;
    }
    if (gameOn) {
      event.preventDefault();
    }
  }

  function handleTouchMove(event) {
    if (gameOn && isDraggingMouse) {
      const racingArea = engine.getRacingArea();
      const coordinates = utils.getCoordinatesFromTouchEvent(event, racingArea);
      handleGameRound(coordinates);
    }
  }

  function handleTouchEnd() {
    isDraggingMouse = false;
  }

  function handleStartClick(event) {
    hideStartModal();
    hideScoreScreen();
    startGame();
    moveMouseCharacterToMousePosition(event);
  }

  function moveMouseCharacterToMousePosition(mouseEvent) {
    const racingArea = engine.getRacingArea();
    const coordinates = utils.getCoordinatesFromMouseMove(
      mouseEvent,
      racingArea
    );
    engine.moveMouse(coordinates.x, coordinates.y);
  }

  function handleRestartClick(event) {
    hideScoreScreen();
    moveMouseCharacterToMousePosition(event);
    restart();
  }

  function startGame() {
    engine.initialize();
    startCatSpeedUp();
    gameOn = true;
    const racingAreaContainer = document.getElementById(
      "racing-area-container"
    );
    racingAreaContainer.classList.add("game-on");
  }

  return {
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleStartClick,
    handleRestartClick
  };
})();
