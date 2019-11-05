import ship from './../src/lib/ship';

const battleship = ship(4);

describe('setCoordination', () => {
  test('Ship is located at a certain place', () => {
    const coordinates = [[0, 0], [0, 1], [0, 2], [0, 3]];
    coordinates.forEach(([r, c], i) => battleship.setCoordination(i, r, c));
    expect(battleship.coordinates).toEqual(coordinates);
  });
});

describe('hit', 'isSunk', () => {
  test('Ship is damaged', () => {
    [0, 1, 2].forEach(i => battleship.hit(i));
    expect(battleship.isSunk()).toBeFalsy();
  });

  test('Ship is completely damaged', () => {
    battleship.hit(3);
    expect(battleship.isSunk()).toBeTruthy();
  });
});

describe('revokeStatus', () => {
  test('When user starts new game, ship is refreshed', () => {
    battleship.revokeStatus();
    expect(battleship.isSunk()).toBeFalsy();
  });
});
