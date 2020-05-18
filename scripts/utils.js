window.gameUtils = function() {
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
  function transformToRacingAreaCoordinates(x, y, racingAreaElement) {
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

  function getCoordinatesFromMouseMove(mouseEvent, racingAreaElement) {
    return transformToRacingAreaCoordinates(
      mouseEvent.clientX,
      mouseEvent.clientY,
      racingAreaElement
    );
  }

  function areElementsInRange(element1Coord, element2Coord, range) {
    const deltaX = Math.abs(element1Coord.x - element2Coord.x);
    const deltaY = Math.abs(element1Coord.y - element2Coord.y);

    return deltaX <= range && deltaY <= range;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  return {
    areElementsInRange,
    getRandomInt,
    getCoordinatesFromMouseMove,
    getCoordinatesInsideRacingArea,
    transformToRacingAreaCoordinates
  }
}();