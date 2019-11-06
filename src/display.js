/* eslint-disable no-mixed-spaces-and-tabs */
const userInterface = (() => {
  const createElement = ({ tag, id, classes, text }) => {
    const obj = document.createElement(tag);
    if (id) {
      obj.id = id;
    }
    if (classes) {
		  classes.split(' ').forEach((e) => {
        obj.classList.add(e);
		  });
    }
    if (text) {
		  obj.innerHTML = text;
    }
    return obj;
  };

  const createBoard = (board, parentName) => {
    const boardName = `${parentName}-board`;
    const boardObj = document.querySelector(`.${boardName}`);
    const indicators = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    for (let i = 0; i < 11; i += 1) {
      if (i === 0) {
        for (let j = 0; j < 11; j += 1) {
          const letter = createElement({
            tag: 'span',
            classes: 'box',
            text: indicators[j],
          });
          boardObj.appendChild(letter);
        }
      }
      for (let j = 0; j < 11; j += 1) {
        if (i !== 10) {
          let child;
          if (j === 0) {
            child = createElement({
              tag: 'span',
              classes: 'box',
              text: i + 1,
            });
          } else {
            child = createElement({
              tag: 'button',
              classes: 'box',
              id: `${boardName}-${i}-${j - 1}`,
            });
          }
          boardObj.appendChild(child);
        }
      }
    }
    return boardObj;
  };

  const changeButton = (button, hit) => {
    button.disabled = true;
    button.classList.remove('empty');
    if (hit) {
      button.classList.add('hit');
    } else {
      button.classList.add('miss');
    }
  };

  const blockCellClicks = () => {
    document.querySelectorAll('button.box').forEach((button) => {
      button.disabled = true;
    });
  };

  const clearBoard = () => {
    document.querySelectorAll('button.box').forEach((e) => {
      e.classList.remove('hit');
      e.classList.remove('miss');
      e.classList.add('empty');
      e.disabled = false;
    });
  };

  const parseCoord = (button) => {
    const [, , nameR, nameC] = button.id.split('-');
    return {
      row: parseInt(nameR, 10),
      col: parseInt(nameC, 10),
    };
  };

  const createClickBoard = (play) => {
    const showBoard = document.querySelector('.human-board');
    showBoard.childNodes.forEach((button) => {
      if (button.nodeName === 'BUTTON') {
        button.addEventListener('click', () => {
          const coord = parseCoord(button);
          play(coord);
        });
      }
    });
  };

  const eventResetBoard = (resetTask) => {
    document.querySelector('.reset').addEventListener('click', () => {
      resetTask();
    });
  };

  const getHumanBlock = (row, col) =>
    document.getElementById(`human-board-${row}-${col}`);

  const getComputerBlock = (row, col) =>
    document.getElementById(`computer-board-${row}-${col}`);

  const hideWinner = () => {
    document.querySelector('.winner').style.display = 'none';
  };

  const revealWinner = (turn) => {
    const winner = document.querySelector('.winner');
    winner.innerHTML = `${turn} wins.`;
    winner.style.display = 'flex';
  };

  return {
    createBoard,
    changeButton,
    blockCellClicks,
    createClickBoard,
    eventResetBoard,
    getHumanBlock,
    getComputerBlock,
    clearBoard,
    revealWinner,
    hideWinner,
  };
})();

export default userInterface;
