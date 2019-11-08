const ship = (length) => {
  const status = {
    normal: 0,
    hit: -1,
  };
  const coordinates = new Array(length);
  const statusList = new Array(length).fill(status.normal);
  const setCoordination = (n, r, c) => {
    coordinates[n] = [r, c];
  };
  const hit = (n) => {
    statusList[n] = status.hit;
  };
  const revokeStatus = () => {
    statusList.fill(status.normal);
  };
  const isSunk = () => statusList.every(block => block === status.hit);
  return {
    length,
    hit,
    isSunk,
    coordinates,
    setCoordination,
    revokeStatus,
  };
};

export default ship;
