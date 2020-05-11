const main = (function () {
  let scaredMouseElement;
  let scaryCatElement;
  let cheeseElement;
  let racingAreaElement;
  let scoreElement;
  let score = 0;
  let gameOn = false;
  let catDelay = 1000;
  const catDelays = [1000, 750, 500, 400, 300, 200, 100];

  setInterval(function () {
    const currentDelayIndex = catDelays.indexOf(catDelay);
    if (currentDelayIndex !== catDelays.length - 1) {
      catDelay = catDelays[currentDelayIndex + 1];
      console.log("setting cat speed: ", catDelay);
    }
  }, 10000);

  function startGame() {
    scaredMouseElement = document.getElementById("scaredMouse");
    scaryCatElement = document.getElementById("scaryCat");
    cheeseElement = document.getElementById("cheese");
    racingAreaElement = document.getElementById("racing-area");
    scoreElement = document.getElementById("score");
    gameOn = true;
  }

  window.onload = startGame;

  function setMouseImagePosition(xCoordinate, yCoordinate) {
    scaredMouseElement.style.left = xCoordinate + "px";
    scaredMouseElement.style.top = yCoordinate + "px";
  }

  function setCatImagePosition(xCoordinate, yCoordinate) {
    scaryCatElement.style.left = xCoordinate + "px";
    scaryCatElement.style.top = yCoordinate + "px";
  }

  let trailMarkCooldown = false;
  function createTrailMarkIfNeeded(xCoordinate, yCoordinate) {
    if (!trailMarkCooldown) {
      createTrailMark(xCoordinate, yCoordinate);
      trailMarkCooldown = true;
      setTimeout(function () {
        trailMarkCooldown = false;
      }, 20);
    }
  }

  function createTrailMark(xCoordinate, yCoordinate) {
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
    }, catDelay);
  }

  function getCoordinatesInsideRacingArea(x, y, racingAreaBounds) {
    const minX = 0;
    const maxX = racingAreaBounds.width;
    const minY = 0;
    const maxY = racingAreaBounds.height;

    const boundedX = Math.max(Math.min(maxX, x), minX);
    const boundedY = Math.max(Math.min(maxY, y), minY);

    return {
      x: boundedX,
      y: boundedY,
    };
  }

  /*
   * Takes the coordinates from a mouse move event, transforms them into
   * coordinates relative to the racing area and makes sure they are
   * inside the racing area.
   */

  function transformToRacingAreaCoordinates(x, y) {
    const racingAreaBounds = racingAreaElement.getBoundingClientRect();

    /* Transform into coordinates relative to the racing area, not the body element */
    const XYRelativeToRacingArea = {
      x: x - racingAreaBounds.left,
      y: y - racingAreaBounds.top,
    };

    /* Keep coordinates inside the racing area */
    const boundCoordinates = getCoordinatesInsideRacingArea(
      XYRelativeToRacingArea.x,
      XYRelativeToRacingArea.y,
      racingAreaBounds
    );

    return {
      x: boundCoordinates.x,
      y: boundCoordinates.y,
    };
  }

  function getCoordinatesFromMouseMove(mouseEvent) {
    return transformToRacingAreaCoordinates(
      mouseEvent.clientX,
      mouseEvent.clientY
    );
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function updateScore(newScore) {
    score = newScore;
    scoreElement.textContent = score;
  }

  function eatCheese() {
    updateScore(score + 1);
    const racingAreaBounds = racingAreaElement.getBoundingClientRect();

    const randomX = getRandomInt(racingAreaBounds.width);
    const randomY = getRandomInt(racingAreaBounds.height);

    cheeseElement.style.left = randomX + "px";
    cheeseElement.style.top = randomY + "px";
  }

  function areElementsInRange(element1Coord, element2Coord, range) {
    const deltaX = Math.abs(element1Coord.x - element2Coord.x);
    const deltaY = Math.abs(element1Coord.y - element2Coord.y);

    return deltaX <= range && deltaY <= range;
  }

  function eatCheeseIfPossible(xCoordinate, yCoordinate) {
    const cheeseBounds = cheeseElement.getBoundingClientRect();
    const cheeseCoordinates = transformToRacingAreaCoordinates(
      cheeseBounds.left,
      cheeseBounds.top
    );
    const eatingRange = 20;

    if (
      areElementsInRange(
        { x: xCoordinate, y: yCoordinate },
        { x: cheeseCoordinates.x, y: cheeseCoordinates.y },
        eatingRange
      )
    ) {
      eatCheese();
    }
  }

  function reset() {
    updateScore(0);
    setCatImagePosition(0, 0);
    setTimeout(function() {
      gameOn = true;
    }, Math.max(catDelay, 1000));
    catDelay = catDelays[0];
  }

  function checkGameEnd() {
    const catReach = 20;
    console.log('mouse?', scaredMouseElement.clientX);
    const mouseBounds = scaredMouseElement.getBoundingClientRect();
    const catBounds = scaryCatElement.getBoundingClientRect();

    const gameEnded = areElementsInRange(
      { x: mouseBounds.left, y: mouseBounds.top },
      { x: catBounds.left, y: catBounds.top },
      catReach
    );
    if (gameEnded) {
      gameOn = false;
      alert('Awww, you go caught! You scored ' + score + ' points!');
      reset();
    }
  }

  function handleMouseMove(mouseEvent) {
    if (gameOn) {
      const coordinates = getCoordinatesFromMouseMove(mouseEvent);

      const xCoordinate = coordinates.x;
      const yCoordinate = coordinates.y;

      setMouseImagePosition(xCoordinate, yCoordinate);
      setTimeout(function () {
        if (gameOn) {
          setCatImagePosition(xCoordinate, yCoordinate);
          checkGameEnd();
        }
      }, catDelay);
      createTrailMarkIfNeeded(xCoordinate, yCoordinate);
      eatCheeseIfPossible(xCoordinate, yCoordinate);
    }
  }

  return { handleMouseMove: handleMouseMove };
})();
