import _ from 'lodash';

const aiMove = (board) => {
  const status = {
    empty: 0,
    fill: 1,
    destroyed: 2,
  };

  const overlayCheck = (cell, all) => {
    if (all) {
      return (
        cell !== status.destroyed &&
        (cell === status.empty || cell === status.fill)
      );
    }
    return cell === status.fill;
  };

  const lowerColumnCheck = (row, col, range) => {
    if (col - 1 < 0) return !range ? false : range.over;

    const cell = board[row][col - 1];
    return overlayCheck(cell, range);
  };

  const upperColumnCheck = (row, col, range) => {
    if (col + 1 >= board[0].length) return !range ? false : range.over;

    const cell = board[row][col + 1];
    return overlayCheck(cell, range);
  };

  const lowerRowCheck = (row, col, range) => {
    if (row - 1 < 0) return !range ? false : range.over;

    const cell = board[row - 1][col];
    return overlayCheck(cell, range);
  };

  const upperRowCheck = (row, col, range) => {
    if (row + 1 >= board.length) return !range ? false : range.over;

    const cell = board[row + 1][col];
    return overlayCheck(cell, range);
  };

  const cohension = ({ shipLength, direction, row, col }) => {
    let connected;
    if (direction === 'h') {
      connected =
        lowerColumnCheck(row, col) ||
        upperColumnCheck(row, col + shipLength - 1) ||
        _.range(col, col + shipLength).some(
          c => lowerRowCheck(row, c) || upperRowCheck(row, c)
        );
    } else {
      connected =
        lowerRowCheck(row, col) ||
        upperRowCheck(row + shipLength - 1, col) ||
        _.range(row, row + shipLength).some(
          r => lowerColumnCheck(r, col) || upperColumnCheck(r, col)
        );
    }
    return connected;
  };

  const minimumAttached = (goal) => {
    const spots = [];
    board.forEach((line, r) => {
      line.forEach((cell, c) => {
        if (cell === status.fill || cell === status.empty) {
          let n = 0;
          if (lowerRowCheck(r, c, { over: true })) n += 1;
          if (upperRowCheck(r, c, { over: true })) n += 1;
          if (lowerColumnCheck(r, c, { over: true })) n += 1;
          if (upperColumnCheck(r, c, { over: true })) n += 1;
          if (n === goal) spots.push([r, c]);
        }
      });
    });
    return spots;
  };
  const getAvailableSpots = () => {
    let spots;
    spots = minimumAttached(4);
    if (!spots || spots.length === 0) spots = minimumAttached(3);
    if (!spots || spots.length === 0) spots = minimumAttached(2);
    if (!spots || spots.length === 0) spots = minimumAttached(1);
    if (!spots || spots.length === 0) spots = minimumAttached(0);
    return spots;
  };

  const aiSpot = (coord) => {
    let i = 0;
    while (i < coord.length) {
      const [row, col] = coord[i];
      const newList = { row: [], col: [] };
      if (lowerRowCheck(row, col, { over: false })) {
        newList.row.push([row - 1, col]);
      }
      if (upperRowCheck(row, col, { over: false })) {
        newList.row.push([row + 1, col]);
      }
      if (lowerColumnCheck(row, col, { over: false })) {
        newList.col.push([row, col - 1]);
      }
      if (upperColumnCheck(row, col, { over: false })) {
        newList.col.push([row, col + 1]);
      }
      if (coord.length > 1) {
        const j = i === 0 ? 1 : 0;
        const [preRow, preCol] = coord[j];
        if (row === preRow && newList.col.length > 0) {
          return newList.col[0];
        }
        if (col === preCol && newList.row.length > 0) {
          return newList.row[0];
        }
      } else if (newList.col.length > 0) {
        return newList.col[0];
      } else if (newList.row.length > 0) {
        return newList.row[0];
      }
      i += 1;
    }
  };

  const randomSpot = () => {
    const leftSpots = getAvailableSpots();
    if (leftSpots.length === 0) return [];

    const index = _.random(0, leftSpots.length - 1);
    return leftSpots[index];
  };

  return { aiSpot, randomSpot, cohension };
};

export default aiMove;
