import _ from 'lodash';

const gameBoard = (ships) => {
  const status = {
    miss: -1,
    empty: 0,
    fill: 1,
    damaged: 2,
  };

  const board = Array.from(Array(10), () => Array(10).fill(status.empty));

  const isAllSunk = () => ships.every(ship => ship.isSunk());

  const attackShipUnit = (ship, shot) => {
    const attacked = ship.coordinates.some((original, n) => {
      if ([0, 1].every(x => original[x] === shot[x])) {
        ship.hit(n);
        return true;
      }
    });
    return attacked;
  };
  const attackShips = (shot) => {
    let sunkShipCoord;
    ships.some((ship) => {
      if (attackShipUnit(ship, shot)) {
        if (ship.isSunk()) {
          sunkShipCoord = ship.coordinates;
        }
        return true;
      }
    });
    return sunkShipCoord;
  };

  const receiveAttack = (r, c) => {
    if (board[r][c] === status.fill) {
      const sunk = attackShips([r, c]);
      board[r][c] = status.damaged;
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

  const placeable = ({ ship, direction, row, col }) => {
    let occupied;
    let connected;
    if (direction === 'h') {
      occupied = _.range(col, col + ship.length).some(
        c => board[row][c] === status.fill
      );
      connected =
        (col - 1 >= 0 && board[row][col - 1] === status.fill) ||
        (col + 1 < board[0].length && board[row][col + 1] === status.fill);
    } else {
      occupied = _.range(row, row + ship.length).some(
        r => board[r][col] === status.fill
      );
      connected =
        (col - 1 >= 0 && board[row][col - 1] === status.fill) ||
        (col + 1 < board[0].length && board[row][col + 1] === status.fill);
    }
    return !occupied && !connected;
  };

  const placeShip = (ship) => {
    let place = false;
    while (!place) {
      const direction = _.random(0, 1) === 0 ? 'h' : 'v';
      const { row, col } = setCoordination(ship, direction);
      if (!placeable({ ship, direction, row, col })) continue;
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

  const getAvailableSpots = () => {
    const spots = [];
    board.forEach((line, r) => {
      line.forEach((cell, c) => {
        if (cell === status.fill || cell === status.empty) {
          spots.push([r, c]);
        }
      });
    });
    return spots;
  };

  return {
    placeShip,
    receiveAttack,
    isAllSunk,
    getAvailableSpots,
    board,
  };
};

export default gameBoard;
