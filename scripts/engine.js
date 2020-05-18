window.gameEngine = (function () {
  const utils = window.gameUtils;

  let scaredMouseElement;
  let scaryCatElement;
  let cheeseElement;
  let racingAreaElement;
  let scoreElement;
  let score = 0;
  let trailMarkCooldown = false;


  function getMouse() {
    return scaredMouseElement;
  }

  function getCat() {
    return scaryCatElement;
  }

  function getCheese() {
    return cheeseElement;
  }

  function getRacingArea() {
    return racingAreaElement;
  }

  function getScoreSign() {
    return scoreElement;
  }

  function getScore() {
    return score;
  }

  function initialize() {
    scaredMouseElement = document.getElementById("scaredMouse");
    scaryCatElement = document.getElementById("scaryCat");
    cheeseElement = document.getElementById("cheese");
    racingAreaElement = document.getElementById("racing-area");
    scoreElement = document.getElementById("score");
  }

  function moveMouse(xCoordinate, yCoordinate) {
    scaredMouseElement.style.left = xCoordinate + "px";
    scaredMouseElement.style.top = yCoordinate + "px";
  }

  function moveCat(xCoordinate, yCoordinate) {
    scaryCatElement.style.left = xCoordinate + "px";
    scaryCatElement.style.top = yCoordinate + "px";
  }

  function createTrailMark(xCoordinate, yCoordinate, fadeoutDelay) {
    /* Create a trail mark element*/
    const trailMark = document.createElement("div");
    trailMark.classList.add("trail-mark");
    trailMark.style.left = xCoordinate + "px";
    trailMark.style.top = yCoordinate + "px";

    /* Add it to DOM inside the racing area element*/
    racingAreaElement.appendChild(trailMark);

    /* remove the trailmark when the cat gets there */
    setTimeout(function () {
      trailMark.parentNode.removeChild(trailMark);
    }, fadeoutDelay);
  }

  function updateScore(newScore) {
    score = newScore;
    scoreElement.textContent = score;
  }

  function createTrailMarkIfNeeded(xCoordinate, yCoordinate, fadeoutDelay) {
    if (!trailMarkCooldown) {
      createTrailMark(xCoordinate, yCoordinate, fadeoutDelay);
      trailMarkCooldown = true;
      setTimeout(function () {
        trailMarkCooldown = false;
      }, 20);
    }
  }

  function eatCheese() {
    updateScore(score + 1);
    const racingAreaBounds = racingAreaElement.getBoundingClientRect();

    const randomX = utils.getRandomInt(racingAreaBounds.width);
    const randomY = utils.getRandomInt(racingAreaBounds.height);

    cheeseElement.style.left = randomX + "px";
    cheeseElement.style.top = randomY + "px";
  }

  function eatCheeseIfPossible(xCoordinate, yCoordinate) {
    const cheeseBounds = cheeseElement.getBoundingClientRect();
    const cheeseCoordinates = utils.transformToRacingAreaCoordinates(
      cheeseBounds.left,
      cheeseBounds.top,
      racingAreaElement
    );
    const eatingRange = 20;

    if (
      utils.areElementsInRange(
        { x: xCoordinate, y: yCoordinate },
        { x: cheeseCoordinates.x, y: cheeseCoordinates.y },
        eatingRange
      )
    ) {
      eatCheese();
    }
  }

  function hasCatCaughtMouse() {
    const catReach = 20;
    const mouseBounds = scaredMouseElement.getBoundingClientRect();
    const catBounds = scaryCatElement.getBoundingClientRect();

    return utils.areElementsInRange(
      { x: mouseBounds.left, y: mouseBounds.top },
      { x: catBounds.left, y: catBounds.top },
      catReach
    );
  }

  return {
    createTrailMarkIfNeeded,
    eatCheeseIfPossible,
    getCat,
    getCheese,
    getMouse,
    getRacingArea,
    getScore,
    getScoreSign,
    hasCatCaughtMouse,
    initialize,
    moveCat,
    moveMouse,
    updateScore
  };
})();
