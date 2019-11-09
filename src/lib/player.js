const player = (type) => {
  const lastHit = { coord: [] };
  const resetLastHit = () => {
    lastHit.coord = [];
  };

  const updateLastHit = (row, col) => {
    if (lastHit.coord.length >= 2) {
      lastHit.coord.shift();
    }
    lastHit.coord.unshift([row, col]);
  };
  return { type, lastHit, resetLastHit, updateLastHit };
};

export default player;
