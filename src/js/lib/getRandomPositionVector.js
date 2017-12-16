import getRandomArbitrary from './getRandomArbitrary';

const getRandomPositionVector = spread => {
  const z = getRandomArbitrary(- spread, spread);
  const x = getRandomArbitrary(- spread, spread);
  const y = getRandomArbitrary(- 10, - 5);

  return new THREE.Vector3(x, y, z);
};

export default getRandomPositionVector;
