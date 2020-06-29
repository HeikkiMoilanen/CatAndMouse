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

  function hideStartModal() {
    const startModal = document.getElementById("startModal");
    startModal.classList.add("hidden");
  }

  function showScoreScreen() {
    const startModal = document.getElementById("scoreScreen");
    const scoreScreenScoreField = document.getElementById("scoreScreenScoreField");
    const score = engine.getScore();
    const scoreText = score === 1
      ? 'You scored ' + score + ' point'
      : 'You scored ' + score + ' points';
    scoreScreenScoreField.textContent = scoreText;
    startModal.classList.remove("hidden");
  }

  function hideScoreScreen() {
    const startModal = document.getElementById("scoreScreen");
    startModal.classList.add("hidden");
  }

  function restart() {
    engine.updateScore(0);
    engine.moveCat(0, 0);
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
    console.log('mousemove', gameOn);
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
    console.log("touch started!", event);
  }

  function handleTouchMove(event) {
    if (gameOn) {
      const racingArea = engine.getRacingArea();
      const coordinates = utils.getCoordinatesFromTouchEvent(event, racingArea);
      handleGameRound(coordinates);
    }
  }

  function handleStartClick() {
    hideStartModal();
    hideScoreScreen();
    startGame();
  }

  function handleRestartClick() {
    hideScoreScreen();
    restart();
  }
  

  function handleTouchEnd(event) {
    console.log("touch ended!", event);
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
