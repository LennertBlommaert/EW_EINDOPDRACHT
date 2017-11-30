import Cloud from '../classes/Cloud';
import Airplane from '../classes/Airplane';

import Constants from '../objects/Constants';

import getRandomArbitrary from './getRandomArbitrary';

const createObjectOnNote = (note = 0, scene) => {

  if (note > 60) {
    createPlane(scene);
  }

  // A key on keyboard
  if (note === 60) {
    console.log(scene);
    scene.terrain.minHeight++;
  }

  if (note < 60) {
    createCloud(scene);
  }
};


const createCloud = scene => {
  const cloud = new Cloud();

  cloud.mesh.position.y = getRandomArbitrary(0, Constants.HEIGHT / 2);
  cloud.mesh.position.x = getRandomArbitrary(0, Constants.WIDTH / 2) - Constants.WIDTH / 2;

  cloud.mesh.position.z = - 400 - Math.random() * 400;

  const s = 1 + Math.random() * 2;
  cloud.mesh.scale.set(s, s, s);

  scene.add(cloud.mesh);
};


const createPlane = scene => {
  const airplane = new Airplane();

  airplane.mesh.scale.set(.25, .25, .25);

  airplane.mesh.position.y = getRandomArbitrary(0, Constants.HEIGHT / 2);
  airplane.mesh.position.x = getRandomArbitrary(0, Constants.WIDTH / 2) - Constants.WIDTH / 4;

  scene.add(airplane.mesh);

};

export default createObjectOnNote;
