import ship from './../src/lib/ship';
import gameBoard from './../src/lib/gameBoard';

const myShips = {
  carrier: ship(5),
  battleship: ship(4),
  cruiser: ship(3),
  submarine: ship(3),
  destroyer: ship(2),
};

const myBoard = gameBoard(Object.values(myShips));
Object.values(myShips).forEach((ship) => {
  myBoard.placeShip(ship);
});

describe('placeShip', () => {
  test('Game board has no overlapping ships', () => {
    let sum = 0;
    const goal = Object.values(myShips).reduce(
      (sum, ship) => sum + ship.length,
      0
    );
    myBoard.board.forEach((line) => {
      sum += line.filter(cell => cell === 1).length;
    });
    expect(sum).toBe(goal);
  });
});

describe('receiveAttack', () => {
  test('When receive attack all cells of a ship, the ship sunk', () => {
    const ship = Object.values(myShips)[0];
    ship.coordinates.forEach(([row, col]) => {
      myBoard.receiveAttack(row, col);
    });
    expect(ship.isSunk()).toBeTruthy();
  });
});

describe('getAvailableSpots', () => {
  test('Left available size only minus attacked place for a ship', () => {
    const sunkShip = Object.values(myShips)[0];
    const leftSpots = myBoard.getAvailableSpots();
    const boardLength = myBoard.board.length * myBoard.board[0].length;
    expect(leftSpots.length).toBe(boardLength - sunkShip.length);
  });
});

describe('isAllSunk', () => {
  test('A ship only sunk, but all ships are not sunk', () => {
    expect(myBoard.isAllSunk()).toBeFalsy();
  });

  test('When receive attack all ships, they are all sunk', () => {
    const ships = Object.values(myShips);
    ships.forEach((ship) => {
      ship.coordinates.forEach(([row, col]) => {
        myBoard.receiveAttack(row, col);
      });
    });
    expect(myBoard.isAllSunk()).toBeTruthy();
  });
});
