(function() {
  module('glift.controllers.gameFigureTest');
  var problem = testdata.sgfs.chenXiaoGame;
  var states = glift.enums.states;
  var ptlistToMap = glift.testUtil.ptlistToMap;

  test('Test Create', function() {
    var gameFigure = glift.controllers.gameFigure({sgfString: problem });
    ok(gameFigure !== undefined, 'Make sure we can actually create an obj');
    deepEqual(gameFigure.currentMoveNumber(), 0, 'index init\'d to 0');
    deepEqual(gameFigure.treepath, [], 'Gamepath set to beginning');
  });

  test('Test Create: drawTo- integer', function() {
    var oldLog = glift.util.logz;
    var gameFigure = glift.controllers.gameFigure({
        sgfString: problem,
        initialPosition: '10',
        drawTo: 30,
    });
    var labels = gameFigure.movetree.properties().getAllMarks().LABEL;
    var labels = gameFigure.movetree.properties().propMap.LB;
    labels.sort();

    // assert these are in the array
    var labelsToFind = [
        "gh:30",
        "fk:29",
        "dm:28",
        "ce:27",
        "df:26",
        "be:25",
        "bf:24",
        "dk:23",
        "kc:22",
        "po:21",
        "mp:20",
        "cb:19",
        "dh:18",
        "cf:17",
        "hc:16",
        "fd:15",
        "db:14",
        "dd:13",
        "gl:12",
        "cc:11",
    ];
    labelsToFind.sort()

    deepEqual(labels, labelsToFind);
    deepEqual(gameFigure.currentMoveNumber(), 30);
    ok(gameFigure);
  });

  test('Test Create: drawTo- array', function() {
    var oldLog = glift.util.logz;
    var gameFigure = glift.controllers.gameFigure({
        sgfString: problem,
        initialPosition: '10',
        drawTo: [ // twenty 0s
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
        ],
    });
    var labels = gameFigure.movetree.properties().getAllMarks().LABEL;
    var labels = gameFigure.movetree.properties().propMap.LB;
    labels.sort();

    // assert these are in the array
    var labelsToFind = [
        "gh:30",
        "fk:29",
        "dm:28",
        "ce:27",
        "df:26",
        "be:25",
        "bf:24",
        "dk:23",
        "kc:22",
        "po:21",
        "mp:20",
        "cb:19",
        "dh:18",
        "cf:17",
        "hc:16",
        "fd:15",
        "db:14",
        "dd:13",
        "gl:12",
        "cc:11",
    ];
    labelsToFind.sort()

    deepEqual(labels, labelsToFind);
    deepEqual(gameFigure.currentMoveNumber(), 30);
    ok(gameFigure);
  });

  test('Test Create: initial position', function() {
    var gameFigure = glift.controllers.gameFigure({
        sgfString: problem,
        initialPosition: '15'
    });
    deepEqual(gameFigure.currentMoveNumber(), 15);
    ok(gameFigure);
  });

})();
