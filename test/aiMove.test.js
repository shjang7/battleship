import aiMove from './../src/lib/aiMove';

const status = {
  empty: 0,
  fill: 1,
  destroyed: 2,
};

describe('aiSpot', () => {
  const board = Array.from(Array(10), () => Array(10).fill(status.empty));
  const move = aiMove(board);
  test('Get adjacent cell for col, row order', () => {
    expect(move.aiSpot([[1, 1]])).toEqual([1, 0]);
  });

  test('Get adjacent cell for same row', () => {
    expect(move.aiSpot([[1, 1], [1, 2]])).toEqual([1, 0]);
  });

  test('Get adjacent cell for same col', () => {
    expect(move.aiSpot([[1, 1], [2, 1]])).toEqual([0, 1]);
  });
});

describe('randomSpot', () => {
  test('After attack all cells except a cell, it returns left cell', () => {
    const mockBoard = Array.from(Array(10), () =>
      Array(10).fill(status.destroyed)
    );
    mockBoard[1][1] = status.fill; // didn't destroy yet
    const move = aiMove(mockBoard);
    expect(move.randomSpot()).toEqual([1, 1]);
  });
});

describe('cohension', () => {
  const board = Array.from(Array(10), () => Array(10).fill(status.empty));
  [...Array(8).keys()].forEach((row) => {
    [...Array(10).keys()].forEach((col) => {
      board[row][col] = status.fill;
    });
  });
  const move = aiMove(board);

  test('To place ship at not adjacent location, cohension false', () => {
    expect(
      move.cohension({ shipLength: 2, direction: 'h', row: 9, col: 0 })
    ).toBeFalsy();
  });

  test('To place ship at adjacent location, cohension true', () => {
    expect(
      move.cohension({ shipLength: 2, direction: 'v', row: 8, col: 0 })
    ).toBeTruthy();
  });
});
