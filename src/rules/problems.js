glift.rules.problems = {
  /**
   * Determines if a 'move' is correct. Takes a movetree and a series of
   * conditions, which is a map of properties to an array of possible substring
   * matches.  Only one conditien must be met.
   *
   * Problem results:
   *
   * CORRECT - The position properties must match one of several problem
   *    conditions.
   * INDETERMINATE - There must exist at path to a correct position from the
   *    current position.
   * INCORRECT - The position has to path to a correct position.
   *
   * Some Examples:
   *    Correct if there is a GB property or the words 'Correct' or 'is correct' in
   *    the comment. This is the default.
   *    { GB: [], C: ['Correct', 'is correct'] }
   *
   *    Nothing is correct
   *    {}
   *
   *    Correct as long as there is a comment tag.
   *    { C: [] }
   *
   *    Correct as long as there is a black stone (a strange condition).
   *    { B: [] }
   *
   * Returns one of enum.problemResults (CORRECT, INDETERMINATE, INCORRECT).
   */
  isCorrectPosition: function(movetree, conditions) {
    var problemResults = glift.enums.problemResults;
    if (movetree.properties().matches(conditions)) {
      return problemResults.CORRECT;
    } else {
      var flatPaths = glift.rules.treepath.flattenMoveTree(movetree);
      var successTracker = {};
      for (var i = 0; i < flatPaths.length; i++) {
        var path = flatPaths[i];
        var newmt = movetree.getFromNode(movetree.node());
        var pathCorrect = false
        for (var j = 0; j < path.length; j++) {
          newmt.moveDown(path[j]);
          if (newmt.properties().matches(conditions)) {
            pathCorrect = true;
          }
        }
        if (pathCorrect) {
          successTracker[problemResults.CORRECT] = true;
        } else {
          successTracker[problemResults.INCORRECT] = true;
        }
      }
      if (successTracker[problemResults.CORRECT] &&
          !successTracker[problemResults.INCORRECT]) {
        if (movetree.properties().matches(conditions)) {
          return problemResults.CORRECT;
        } else {
          return problemResults.INDETERMINATE;
        }
      } else if (
          successTracker[problemResults.CORRECT] &&
          successTracker[problemResults.INCORRECT]) {
        return problemResults.INDETERMINATE;
      } else {
        return problemResults.INCORRECT;
      }
    }
  },

  /**
   * Get the correct next moves.
   *
   * returns: the 'correct' next moves. In other words
   *
   * [{ point: <point>, color: <color>  },..
   * ]
   */
  correctNextMoves: function(movetree, conditions) {
    var nextMoves = movetree.nextMoves();
    var INCORRECT = glift.enums.problemResults.INCORRECT;
    var correctNextMoves = [];
    for (var i = 0; i < nextMoves.length; i++) {
      movetree.moveDown(i);
      if (glift.rules.problems.isCorrectPosition(movetree, conditions)
          !== INCORRECT) {
        correctNextMoves.push(nextMoves[i]);
      }
      movetree.moveUp(); // reset the position
    }
    return correctNextMoves;
  }
};
