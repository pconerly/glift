/**
 * Option defaults.
 *
 * Generally, there are three classes of options:
 *
 * 1. Manager Options. Meta options hoving to do with managing widgets
 * 2. Display Options. Options having to do with how widgets are displayed
 * 3. Sgf Options. Options having to do specifically with each SGF.
 */
glift.widgets.options.baseOptions = {
  /**
   * The sgf parameter can be one of the following:
   *  - An SGF in literal string form.
   *  - A URL to an SGF.
   *  - An SGF Object.
   *
   * If sgf is specified as an object in can contain any of the options
   * specified in sgfDefaults.  In addition, the follow parameters may be
   * specified:
   *  - sgfString: a literal SGF String
   *  - initialPosition: where to start in the SGF
   *  - url: a url to an SGF. see sgfDefaults for va
   *
   * As you might expect, if the user sets sgf to a literal string form or to a
   * url, it is transformed into an SGF object internally.
   */
  sgf: undefined,

  /**
   * The defaults or SGF objects.
   */
  sgfDefaults: {
    //
    // One of 'sgfString' or 'url' should be defined in each SGF in the
    // sgfCollection.
    //
    //sgfString: '',
    //url: '',

    /**
     * The default widget type. Specifies what type of widget to create.
     */
    widgetType: glift.enums.widgetTypes.GAME_VIEWER,

    /**
     * Defines where to start on the go board. An empty string implies the very
     * beginning. Rather than describe how you can detail the paths, here are
     * some examples of ways to specify an initial position.
     * 0         - Start at the 0th move (the root node)
     * 1         - Start at the 1st move. This is often used in combination with
     *             a black pass to specify that white should play in a
     *             particular problem.
     * 53        - Start at the 53rd move, taking the primary path
     * 2.3       - Start at the 3rd variation on move 2 (actually move 3)
     * 3         - Start at the 3rd move, going through all the top variations
     * 2.0       - Start at the 3rd move, going through all the top variations
     * 0.0.0.0   - Start at the 3rd move, going through all the top variations
     * 2.3-4.1   - Start at the 1st variation of the 4th move, arrived at by
     *             traveling through the 3rd varition on the 2nd move
     */
    initialPosition: '',

    /**
     * The board region to display.  The boardRegion will be 'guessed' if it's set
     * to 'AUTO'.
     */
    boardRegion: glift.enums.boardRegions.AUTO,

    /**
     * What rotation to apply to -just- the display of the stones. Any of:
     * NO_ROTATION, CLOCKWISE_90, CLOCKWISE_180, CLOCKWISE_270, or undefined;
     */
    rotation: glift.enums.rotations.NO_ROTATION,

    /**
     * Callback to perform once a problem is considered correct / incorrect.
     */
    problemCallback: function() {},

    /**
     * Conditions for determing whether a branch of a movetree is correct.  A
     * map from property-keys, to an array of substring values.  If the array is
     * empty, then we only test to see if the property exists at the current
     * positien.
     *
     * The default tests whether there is a 'GB' property or a 'C' (comment)
     * property containing 'Correct' or 'is correct'.
     */
    problemConditions: {
      GB: [],
      C: ['Correct', 'is correct', 'is the correct']
    },

    /**
     * Specifies what action to perform based on a particular keystroke.  In
     * otherwords, a mapping from key-enum to action path.
     *
     * See glift.keyMappings
     */
    keyMappings: {
      ARROW_LEFT: 'iconActions.chevron-left.click',
      ARROW_RIGHT: 'iconActions.chevron-right.click'
    },

    /** The UI Components to use for this display */
    componentsToUse: [
      'BOARD',
      'COMMENT_BOX',
      'STATUS_BAR',
      'ICONBAR'
    ],

    /**
     * For all correct, there are multiple correct answers that a user must get.
     * This allows us to specify (in ms) how long the user has until the problem
     * is automatically reset.
     *
     * Should be overridden by the widget options.
     */
    correctVariationsResetTime: undefined,

    /**
     * You can, if you wish, override the total number of correct variations
     * that a user must get correct. Currently only applies to
     * CORRECT_VARIATIONS_PROBLEM.
     */
    totalCorrectVariationsOverride: undefined,

    //-------------------------------------------------------------------------
    // These options must always be overriden by the widget type overrides.
    //
    // This could easily be changed, but right now this exists as a reminder to
    // the widget creator that they should override these options. In practice,
    // it seems that these particular options need to be set on a per-widget
    // basis anyway.
    //-------------------------------------------------------------------------

    /**
     * Whether or not to show variations.  See glift.enums.showVariations
     * Values: NEVER, ALWAYS, MORE_THAN_ONE
     */
    showVariations: 'MORE_THAN_ONE',

    /**
     * Whether or not to mark the last move played.  Either true or false, but
     * defaults to true.
     */
    markLastMove: true,

    /**
     * The function that creates the controller at widget-creation time.
     * See glift.controllers for more detail
     */
    controllerFunc: undefined,

    /**
     * The names of the icons to use in the icon-bar.  This is a list of
     * icon-names, which must be spceified in glift.displays.icons.svg.
     */
    icons: undefined,

    /**
     * The action that is performed when a sure clicks on an intersection.
     */
    stoneClick: undefined,

    /**
     * The names of the icons to use in the status-bar.
     */
    statusBarIcons: undefined,

    /**
     * Mouseover/mouseout override for stones.
     */
    stoneMouseover: undefined,
    stoneMouseout: undefined
  },

  //----------------------------------------------------------------------
  // These are really Widget Manager options.  Any update to here must be
  // accompanied with an update to options.getDisplayOptions.
  //----------------------------------------------------------------------

  /**
   * The div id in which we create the go board.  The default is glift_display,
   * but this will almost certainly need to be set by the user.
   */
  divId: 'glift_display',

  /**
   * The SGF collection represents a set of SGFs. Like the Sgf parameter, this
   * can take one of three values:
   * - undefined (if the SGF parameter is defined)
   * - An array of SGF objects.
   * - A URL (to load the collection asynchronously).  The received data must be
   *   a JSON array, containing a list of serialized SGF objects.
   */
  sgfCollection: undefined,

  /**
   * Index into the above list.  This is mostly useful for remembering someone's
   * position in the sgf collection.
   */
  initialListIndex: 0,

  /**
   * If there are multiple SGFs in the SGF list, this flag indicates whether or
   * not to allow the user to go back to the beginnig (or conversely, the end).
   */
  allowWrapAround: false,

  /**
   * Misc options for the web display.
   */
  display: {
    /**
     * Specify a background image for the go board.  You can specify an absolute
     * or a relative path.  As you may expect, you cannot do cross domain
     * requests.
     *
     * Examples:
     * 'images/kaya.jpg'
     * 'http://www.mywebbie.com/images/kaya.jpg'
     */
    goBoardBackground: '',

    /**
     * Split percentages to use for a one-column widget format.
     */
    oneColumnSplits: {
      first: [
        { component: 'STATUS_BAR',   ratio: 0.05 },
        { component: 'BOARD',       ratio: 0.67 },
        { component: 'COMMENT_BOX', ratio: 0.18 },
        { component: 'ICONBAR',     ratio: 0.10 }
      ]
    },

    /**
     * Split percentages to use for a two-column widget format.
     */
    twoColumnSplits: {
      first: [
        { component: 'BOARD', ratio: 1 }
      ],
      second: [
        { component: 'STATUS_BAR',     ratio: 0.07 },
        { component: 'COMMENT_BOX',   ratio: 0.83 },
        { component: 'ICONBAR',       ratio: 0.10 }
      ]
    },

    /**
     * The name of the theme to be used for this instance. Other themes include:
     *  - DEPTH (stones with shadows)
     *  - MOODY (gray background, no stone outlines)
     *  - TRANSPARENT (board is transparent)
     *  - TEXTBOOK (Everything black and white)
     */
    theme: 'DEFAULT',

    /** Previous SGF icon */
    previousSgfIcon: 'chevron-left',

    /** Next SGF Icon */
    nextSgfIcon: 'chevron-right',

    /**
     * On the edges of the board, draw the board coordinates.
     * - On the left, use the numbers 1-19
     * - On the bottom, use A-T (all letters minus I)
     */
    drawBoardCoords: false,

    /** For convenience: Disable zoom for mobile users. */
    disableZoomForMobile: false,

    /**
     * Whether or not to enable keyboard shortcuts. This currently binds
     * keypress events to document.body, so it's not unlikely this could
     * conflict with other applications
     */
    enableKeyboardShortcuts: true
  },

  /**
    * Actions for stones.  If the user specifies his own actions, then the
    * actions specified by the user will take precedence.
    */
  stoneActions: {
    /**
      * click is specified in sgfOptions as stoneClick.  The actions that must
      * happen on each click vary for each widget, so we can't make a general
      * click function here.
      */
    click: undefined,

    /** Add ghost-stone for cursor hovering. */
    mouseover: function(event, widget, pt) {
      var hoverColors = { "BLACK": "BLACK_HOVER", "WHITE": "WHITE_HOVER" };
      var currentPlayer = widget.controller.getCurrentPlayer();
      if (widget.controller.canAddStone(pt, currentPlayer)) {
        widget.display.intersections()
            .setStoneColor(pt, hoverColors[currentPlayer]);
      }
    },

    /** Ghost-stone removal for cursor hovering. */
    mouseout: function(event, widget, pt) {
      var currentPlayer = widget.controller.getCurrentPlayer();
      if (widget.controller.canAddStone(pt, currentPlayer)) {
        widget.display && widget.display.intersections()
            .setStoneColor(pt, 'EMPTY');
      }
    },

    // TODO(kashomon): It's not clear if we want this. Revisit later.
    touchend: function(event, widget, pt) {
      event.preventDefault && event.preventDefault();
      event.stopPropagation && event.stopPropagation();
      widget.sgfOptions.stoneClick(event, widget, pt);
    }
  },

  /**
    * The actions for the icons.  The keys in iconACtions
    */
  iconActions: {
    start: {
      click:  function(event, widget, icon, iconBar) {
        widget.applyBoardData(widget.controller.toBeginning());
      },
      tooltip: 'Go to the beginning'
    },

    end: {
      click:  function(event, widget, icon, iconBar) {
        widget.applyBoardData(widget.controller.toEnd());
      },
      tooltip: 'Go to the end'
    },

    arrowright: {
      click: function(event, widget, icon, iconBar) {
        widget.applyBoardData(widget.controller.nextMove());
      },
      tooltip: 'Next move'
    },

    arrowleft: {
      click:  function(event, widget, icon, iconBar) {
        widget.applyBoardData(widget.controller.prevMove());
      },
      tooltip: 'Previous move'
    },

    // Get next problem.
    'chevron-right': {
      click: function(event, widget, icon, iconBar) {
        widget.manager.nextSgf();
      },
      tooltip: 'Next panel'
    },

    // Get the previous problem.
    'chevron-left': {
      click: function(event, widget, icon, iconBar) {
        widget.manager.prevSgf();
      },
      tooltip: 'Previous panel'
    },

    // Try again
    refresh: {
      click: function(event, widget, icon, iconBar) {
        widget.reload();
      },
      tooltip: 'Try the problem again'
    },

    // Undo for just problems (i.e., back one move).
    'undo-problem-move': {
      click:  function(event, widget, icon, iconBar) {
        if (widget.controller.movetree.node().getNodeNum() <=
            widget.initialMoveNumber) {
          return;
        }

        if (widget.initialPlayerColor === widget.controller.getCurrentPlayer()) {
          // If it's our move, then the last move was by the opponent -- we need
          // an extra move backwards.
          widget.applyBoardData(widget.controller.prevMove());
        }

        widget.applyBoardData(widget.controller.prevMove());
        if (widget.initialMoveNumber ===
            widget.controller.movetree.node().getNodeNum()) {
          // We're at the root.  We can assume correctness, so reset the widget.
          widget.reload();
        } else {
          var problemResults = glift.enums.problemResults;
          var correctness = widget.controller.correctnessStatus();
          widget.iconBar.destroyTempIcons();
          if (correctness === problemResults.CORRECT) {
              widget.iconBar.setCenteredTempIcon(
                  'multiopen-boxonly', 'check', '#0CC');
              widget.correctness = problemResults.CORRECT;
          } else if (correctness === problemResults.INCORRECT) {
            widget.iconBar.destroyTempIcons();
            widget.iconBar.setCenteredTempIcon(
                'multiopen-boxonly', 'cross', 'red');
            widget.correctness = problemResults.INCORRECT;
          }
        }
      },
      tooltip: 'Undo last move attempt'
    },

    undo: {
      click: function(event, widget, icon, iconBar) {
        widget.manager.returnToOriginalWidget();
      },
      tooltip: 'Return to the parent widget'
    },

    'jump-left-arrow': {
      click: function(event, widget, icon, iconBar) {
        var maxMoves = 20;
        widget.applyBoardData(widget.controller.previousCommentOrBranch(maxMoves));
      },
      tooltip: 'Previous branch or comment'
    },

    'jump-right-arrow': {
      click: function(event, widget, icon, iconBar) {
        var maxMoves = 20;
        widget.applyBoardData(widget.controller.nextCommentOrBranch(maxMoves));
      },
      tooltip: 'Previous branch or comment'
    },

    // Go to the explain-board.
    roadmap: {
      click: function(event, widget, icon, iconBar) {
        var manager = widget.manager;
        var sgfObj = {
          widgetType: glift.enums.widgetTypes.GAME_VIEWER,
          initialPosition: widget.sgfOptions.initialPosition,
          sgfString: widget.sgfOptions.sgfString,
          showVariations: glift.enums.showVariations.ALWAYS,
          problemConditions: glift.util.simpleClone(
              widget.sgfOptions.problemConditions),
          icons: [
            'jump-left-arrow',
            'jump-right-arrow',
            'arrowleft',
            'arrowright',
            'undo'
          ],
          rotation: widget.sgfOptions.rotation,
          boardRegion: widget.sgfOptions.boardRegion
        }
        manager.createTemporaryWidget(sgfObj);
      },
      tooltip: 'Explore the solution'
    },

    multiopen: {
      click: function(event, widget, icon, iconBar) {
        var ic = glift.displays.icons.iconSelector(
            widget.wrapperDiv,
            iconBar.divId,
            icon);
        ic.setIconEvents('click', function(event, wrappedIcon) {
          var multi = iconBar.getIcon('multiopen')
          multi.setActive(wrappedIcon.iconName);
          iconBar.setCenteredTempIcon('multiopen', multi.getActive(), 'black');
        });
      }
    },

    'multiopen-boxonly': {
      mouseover: function() {},
      mouseout: function() {},
      tooltip: 'Shows if the problem is solved'
    }
  }
};
