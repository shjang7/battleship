import player from './../src/lib/player';

const ai = player('Computer');

describe('updateLastHit', () => {
  test('Save hit location', () => {
    ai.updateLastHit(0, 0);
    expect(ai.lastHit.coord).toEqual([[0, 0]]);
  });

  test('Remember first and last point to guess next connection', () => {
    ai.updateLastHit(0, 1);
    expect(ai.lastHit.coord).toEqual([[0, 1], [0, 0]]);
    ai.updateLastHit(0, 2);
    expect(ai.lastHit.coord).toEqual([[0, 2], [0, 0]]);
  });
});

describe('resetLastHit', () => {
  test('After ship sunk, reset coordinates to get random point next', () => {
    ai.resetLastHit();
    expect(ai.lastHit.coord).toEqual([]);
  });
});
