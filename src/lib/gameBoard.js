import _ from 'lodash';
import aiMove from './aiMove';

const gameBoard = (ships) => {
  const status = {
    miss: -1,
    empty: 0,
    fill: 1,
    destroyed: 2,
  };

  const board = Array.from(Array(10), () => Array(10).fill(status.empty));

  const isAllSunk = () => ships.every(ship => ship.isSunk());

  const shipHit = (ship, shot) =>
    ship.coordinates.some((original, i) => {
      const sameCoord = [0, 1].every(x => original[x] === shot[x]);
      if (sameCoord) {
        ship.hit(i);
        return true;
      }
    });

  const attackShip = (shot) => {
    let sunkShipCoord;
    ships.some((ship) => {
      if (shipHit(ship, shot)) {
        sunkShipCoord = ship.isSunk() ? ship.coordinates : undefined;
        return true;
      }
    });
    return sunkShipCoord;
  };

  const receiveAttack = (r, c) => {
    if (board[r][c] === status.fill) {
      const sunk = attackShip([r, c]);
      board[r][c] = status.destroyed;
      return { sunk, hit: !sunk };
    }
    board[r][c] = status.miss;
  };

  const setCoordination = (ship, direction) => {
    const major = _.random(0, 9 - ship.length + 1);
    const ortho = _.random(0, 9);
    if (direction === 'v') {
      return { row: major, col: ortho };
    }
    return { row: ortho, col: major };
  };

  const locatedCoord = (row, col) => board[row][col] === status.fill;

  const located = ({ shipLength, direction, row, col }) =>
    (direction === 'h'
      ? _.range(col, col + shipLength).some(c => locatedCoord(row, c))
      : _.range(row, row + shipLength).some(r => locatedCoord(r, col)));

  const placeShip = (ship) => {
    let place = false;
    while (!place) {
      const direction = _.random(0, 1) === 0 ? 'h' : 'v';
      const { row, col } = setCoordination(ship, direction);
      const shipLength = ship.length;
      if (
        located({ shipLength, direction, row, col }) ||
        aiMove(board).cohension({ shipLength, direction, row, col })
      ) {
        continue;
      }
      if (direction === 'h') {
        _.range(col, col + ship.length).forEach((c, i) => {
          board[row][c] = status.fill;
          ship.setCoordination(i, row, c);
        });
      } else {
        _.range(row, row + ship.length).forEach((r, i) => {
          board[r][col] = status.fill;
          ship.setCoordination(i, r, col);
        });
      }
      place = true;
    }
  };

  return {
    placeShip,
    receiveAttack,
    isAllSunk,
    board,
  };
};

export default gameBoard;
