//import parseMidiMessage from './lib/parseMidiMessage';

import getMIDIInputValues from './lib/getMIDIInputValues';
import parseMIDIMessageData from './lib/parseMIDIMessageData';
import onMIDIFailure from './lib/onMIDIFailure';
import onMIDIAccessStateChange from './lib/onMIDIAccessStateChange';

import createScene from './lib/createScene';
import createCamera from './lib/createCamera';
import createRenderer from './lib/createRenderer';
import createLights from './lib/createLights';

import createObjectOnNote from './lib/createObjectOnNote.js';

import Constants from './objects/Constants';

let scene, camera, renderer;

const getMIDIAccess = () => {
  if (navigator.requestMIDIAccess) {

    return navigator.requestMIDIAccess()
    .then(MIDISucces, onMIDIFailure);

  } else {
    console.log(`Your browser does not support the Web Midi API`);
  }
};

const MIDISucces = MIDIAccess => {
  const MIDIInputValues = getMIDIInputValues(MIDIAccess);

  MIDIInputValues.forEach(inputValue => {
    inputValue.onmidimessage = onMIDIMessage;
  });

  MIDIAccess.onstatechange = e => onMIDIAccessStateChange(e);
};

const onMIDIMessage = ({data: MIDIData} = [0, 0, 0]) => {
  const parsedMIDIData = parseMIDIMessageData(MIDIData);

  createObjectOnNote(parsedMIDIData.note, scene);
  //generateNoteOnParsedMIDIData(parsedMIDIData);
};


const handleWindowResize = () => {
  renderer.setSize(Constants.WIDTH, Constants.HEIGHT);
  camera.aspect = Constants.WIDTH / Constants.HEIGHT;
  camera.updateProjectionMatrix();
};

const setupScene = () => {
  scene = createScene();
  camera = createCamera(Constants.WIDTH / Constants.HEIGHT);
  renderer = createRenderer();

  console.log(scene);
  console.log(camera);
  console.log(renderer);

  window.addEventListener(`resize`, handleWindowResize, false);

  createLights(scene);
};

const loop = () => {
  renderer.render(scene, camera);
  // sea.moveWaves(currentNote / 20);
  window.requestAnimationFrame(loop);
};

const init = () => {

  getMIDIAccess();

  setupScene();

  loop();

  console.log(renderer);


};

init();
