import ship from './lib/ship';
import gameBoard from './lib/gameBoard';
import player from './lib/player';
import aiMove from './lib/aiMove';
import userInterface from './display';

const mainInterface = (() => {
  const human = player('Human');
  const ai = player('Computer');
  let turn;
  let myBoard;
  let opponentBoard;

  const opponentShips = {
    carrier: ship(5),
    battleship: ship(4),
    cruiser: ship(3),
    submarine: ship(3),
    destroyer: ship(2),
  };

  const myShips = {
    carrier: ship(5),
    battleship: ship(4),
    cruiser: ship(3),
    submarine: ship(3),
    destroyer: ship(2),
  };

  const locateShips = (ships, board) => {
    Object.values(ships).forEach((ship) => {
      ship.revokeStatus();
      board.placeShip(ship);
    });
  };

  const turnHuman = () => turn === human;

  const reset = (initial) => {
    turn = human;
    opponentBoard = gameBoard(Object.values(opponentShips));
    myBoard = gameBoard(Object.values(myShips));
    locateShips(opponentShips, opponentBoard);
    locateShips(myShips, myBoard);

    if (initial) {
      userInterface.createBoard(opponentBoard.board, 'human');
      userInterface.createBoard(myBoard.board, 'computer');
      userInterface.createClickBoard(humanPlay, turnHuman);
    }
    userInterface.reset();
  };

  const updateButton = (coord, computer) => {
    const [row, col] = coord;
    let button;
    let hit;
    if (computer) {
      button = userInterface.getComputerBlock(row, col);
      hit = myBoard.receiveAttack(row, col);
      if (hit) {
        if (hit.sunk) ai.resetLastHit();
        else ai.updateLastHit(row, col);
      }
    } else {
      button = userInterface.getHumanBlock(row, col);
      hit = opponentBoard.receiveAttack(row, col);
    }
    userInterface.changeButton(button, hit);
    if (hit && hit.sunk) {
      hit.sunk.forEach((coord) => {
        userInterface.changeButtonSunk(coord, computer);
      });
    }
    return hit;
  };

  const afterPlay = (coord, computer) => {
    const hit = updateButton(coord, computer);
    gamePlay(hit);
    return hit;
  };

  const computerPlay = () => {
    const move = aiMove(myBoard.board);
    const aiSpot = move.aiSpot(ai.lastHit.coord);
    const random = move.randomSpot();
    const coord = aiSpot && aiSpot.length > 0 ? aiSpot : random;
    const hit = afterPlay(coord, true);
    if (!hit) userInterface.hideAlertPlaying();
  };

  const humanPlay = ({ row, col }) => {
    afterPlay([row, col], false);
  };

  const gamePlay = (hit) => {
    if (opponentBoard.isAllSunk() || myBoard.isAllSunk()) {
      userInterface.revealWinner(turn.type);
      userInterface.blockCellClicks();
    } else if (turn === human && !hit) {
      turn = ai;
      computerPlay();
    } else if (turn === ai && hit) {
      setTimeout(() => computerPlay(), 400);
    } else if (turn === ai && !hit) {
      setTimeout(() => (turn = human), 400);
    }
  };

  const setInit = () => {
    reset(1);
    userInterface.eventResetBoard(reset);
  };

  return { setInit };
})();

mainInterface.setInit();

export default mainInterface;
