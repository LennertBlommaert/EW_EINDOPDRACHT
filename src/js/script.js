//import parseMidiMessage from './lib/parseMidiMessage';

//QUESTION overkill in onze toepassing?
// import Keyboard from './classes/Keyboard';
// let keyboard;

import MIDIController from './classes/MIDIController';
let midiController;

import onMIDIFailure from './lib/onMIDIFailure';

import createScene from './lib/createScene';
import createCamera from './lib/createCamera';
import createRenderer from './lib/createRenderer';
import createLights from './lib/createLights';
import createObjectOnNote from './lib/createObjectOnNote.js';
import Tree from './classes/Tree';
let scene, camera, renderer;

import createSynth from './lib/createSynth';
let synth, pushedFrequencies = [];

import Constants from './objects/Constants';

const getMIDIAccess = () => {
  if (navigator.requestMIDIAccess) {

    return navigator.requestMIDIAccess()
    .then(MIDISucces, onMIDIFailure);

  } else {
    console.log(`Your browser does not support the Web Midi API`);
  }
};

const MIDISucces = MIDIAccess => {
  midiController = new MIDIController(MIDIAccess);
  midiController.on(`midicontrollerkeyup`, handleControllerKeyUp);
  midiController.on(`midicontrollerkeydown`, handleControllerKeyDown);
};

const handleControllerKeyDown = ({note = 69, frequency = 440, velocity = 0.5}) => {
  //QUESTION: maybe a function creating objects based on frequencies instead of notes?
  createObjectOnNote(note, scene);
  pushedFrequencies.push(frequency);
  console.log(note, frequency);
  synth.triggerAttack(pushedFrequencies, undefined, velocity);
};

const handleControllerKeyUp = ({frequency = 440}) => {
  pushedFrequencies = pushedFrequencies.filter(freq => freq !== frequency);
  synth.triggerRelease([frequency]);
};

const handleWindowResize = () => {
  Constants.WIDTH = window.innerWidth;
  Constants.HEIGHT = window.innerHeight;

  renderer.setSize(Constants.WIDTH, Constants.HEIGHT);
  camera.aspect = Constants.WIDTH / Constants.HEIGHT;
  camera.updateProjectionMatrix();
};

const createTree = () => new Tree(scene);

const setupScene = () => {
  scene = createScene();
  camera = createCamera(Constants.WIDTH / Constants.HEIGHT);
  renderer = createRenderer();

  window.addEventListener(`resize`, handleWindowResize, false);

  createLights(scene);
};

const loop = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

const getKeyCodeData = keyCode => {
  return Constants.KEY_NOTE_FREQUENCY.filter(d => d.keyCode === keyCode)[0];
};

const init = () => {

  synth = createSynth();

  setupScene();
  createTree();

  getKeyCodeData(81);

  window.addEventListener(`keydown`, ({keyCode}) => handleControllerKeyDown(getKeyCodeData(keyCode)));
  window.addEventListener(`keyup`, ({keyCode}) => handleControllerKeyUp(getKeyCodeData(keyCode)));

  getMIDIAccess();

  //window.addEventListener(`keydown`, handleKeyDown);


  loop();

};

init();
