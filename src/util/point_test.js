(function() {
  module('glift.util.pointTest');
  var rules = glift.rules,
      point = glift.util.point;

  test('Create, basic methods', function() {
    var pt = point(1, 5);
    var pt2 = point(1, 5);
    deepEqual(pt.x(), 1, 'x val');
    deepEqual(pt.y(), 5, 'y val');
    deepEqual(glift.util.coordToString(1, 5), '1,5', 'coord to string');;
    ok(pt.equals(pt2), 'equals');
  });

  test('hash and unhash', function() {
    var pt = point(1, 12);
    deepEqual(pt.toString(), '1,12', 'to string must be a comma-sep pair');
    deepEqual(pt.hash(), pt.toString(), 'hash and string must be equal');
    var newPt = glift.util.pointFromHash(pt.hash());
    ok(newPt.equals(pt), 'pts must be equal')
  });

  test('rotation', function() {
    var rotations = glift.enums.rotations;

    var pt = point(2, 3);
    deepEqual(pt.rotate(19, rotations.CLOCKWISE_90), point(15, 2));
    deepEqual(pt.rotate(19, rotations.CLOCKWISE_180), point(16, 15));
    deepEqual(pt.rotate(19, rotations.CLOCKWISE_270), point(3, 16));
    deepEqual(pt.rotate(19, 'foo'), point(2, 3),
        'bad value for rotation should give back same pt');

    var pt = point(9, 1);
    deepEqual(pt.rotate(19, rotations.CLOCKWISE_90), point(17, 9));
  });

  test('pointArrFromSgfProp: single point', function() {
    var o = glift.util.pointArrFromSgfProp('ab');
    deepEqual(o, [point(0, 1)]);

    o = glift.util.pointArrFromSgfProp('cc');
    deepEqual(o, [point(2, 2)]);
  });

  test('pointArrFromSgfProp: rectangle', function() {
    var o = glift.util.pointArrFromSgfProp('aa:cc');
    var expected = [
       point(0,0), point(1,0), point(2,0),
       point(0,1), point(1,1), point(2,1),
       point(0,2), point(1,2), point(2,2)];

    deepEqual(o[1].toString(), expected[1].toString());
    deepEqual(o, expected, 'square pt rectangle');

    o = glift.util.pointArrFromSgfProp('bb:bf');
    expected = [
      point(1, 1),
      point(1, 2),
      point(1, 3),
      point(1, 4),
      point(1, 5),
    ]
    deepEqual(o, expected, 'vertical pt rectangle');

    o = glift.util.pointArrFromSgfProp('bb:fb');
    expected = [
      point(1, 1), point(2, 1), point(3, 1), point(4, 1), point(5, 1),
    ]
    deepEqual(o, expected, 'vertical pt rectangle');
  });
})();
