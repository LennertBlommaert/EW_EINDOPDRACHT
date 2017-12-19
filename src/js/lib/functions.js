import Constants from '../objects/Constants';

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomPositionVector = spread => {
  const z = getRandomArbitrary(- spread, spread);
  const x = getRandomArbitrary(- spread, spread);
  // const y = getRandomArbitrary(- 10, - 5);
  const y = 0;

  return new THREE.Vector3(x, y, z);
};

export const frequencyFromNoteNumber = note => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

export const mapNumber = (value, low1, high1, low2, high2) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

export const getKeyCodeData = keyCode => {
  const keyCodeData = Constants.KEYS.find(d => d.keyCode === keyCode);
  return keyCodeData;
};

export const parseMIDIMessageData = data => {
  return {
    command: data[0] >> 4,
    channel: data[0] & 0xf,
    note: data[1] % 12,
    velocity: data[2] / 127,
    frequency: frequencyFromNoteNumber(data[1])
  };
};
