//import parseMidiMessage from './lib/parseMidiMessage';

//QUESTION overkill in onze toepassing?
// import Keyboard from './classes/Keyboard';
// let keyboard;

import MIDIController from './classes/MIDIController';
let midiController;

import onMIDIFailure from './lib/onMIDIFailure';

import ThreeController from './classes/ThreeController.js';
let threeController;

//aimport createObjectOnNote from './lib/createObjectOnNote.js';

import createSynth from './lib/createSynth';
let synth, pushedFrequencies = [], pushedNotes = [];

import Constants from './objects/Constants';

// Currently unavailable, yet promising
//import {chord} from 'tonal-detect';

import teoria from 'teoria';
import piu from 'piu';


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

const minorChordPlayed = () => {
  threeController.scene.darken();
};

const majorChordPlayed = () => {
  threeController.scene.brighten();
};

const checkChordType = () => {
  const teoriaNotes = pushedNotes.map(teoria.note.fromMIDI);
  // const triads = piu.triads(teoriaNotes);
  const infer = piu.infer(teoriaNotes);

  // Check if a chord is recognised
  if (infer.length === 0) return;

  if (infer[0].type === `m`) return minorChordPlayed();
  if (infer[0].type === ``) return majorChordPlayed();
};

const handleControllerKeyDown = ({note = 69, frequency = 440, velocity = 0.5}) => {
  //QUESTION: maybe a function creating objects based on frequencies instead of notes?
  // Maybe not, maybe rather play music based on notes
  threeController.scene.createObjectOnNote(note);
  pushedFrequencies.push(frequency);
  pushedNotes.push(note);
  synth.triggerAttack(pushedFrequencies, undefined, velocity);

  //Only check when multiple keys are being pressed
  if (pushedNotes.length > 1) checkChordType();
};

const handleControllerKeyUp = ({note = 69, frequency = 440}) => {
  pushedFrequencies = pushedFrequencies.filter(freq => freq !== frequency);
  pushedNotes = pushedNotes.filter(n => n !== note);
  synth.triggerRelease([frequency]);
};

const handleWindowResize = () => {
  Constants.WIDTH = window.innerWidth;
  Constants.HEIGHT = window.innerHeight;

  threeController.renderer.setSize(Constants.WIDTH, Constants.HEIGHT);

  threeController.camera.aspect = Constants.WIDTH / Constants.HEIGHT;
  threeController.camera.updateProjectionMatrix();
};

const loop = () => {
  threeController.renderer.render(threeController.scene, threeController.camera);

  //threeController.camera.rotate();
  threeController.controls.update();
  threeController.scene.moveShadowLight();

  threeController.scene.lowerTerrain();

  window.requestAnimationFrame(loop);
};

const getKeyCodeData = keyCode => {

  const keyCodeData = Constants.KEY_NOTE_FREQUENCY.filter(d => d.keyCode === keyCode)[0];


  if (keyCodeData !== undefined) return keyCodeData;

  return {};
};

const init = () => {

  synth = createSynth();

  threeController = new ThreeController();

  window.addEventListener(`resize`, handleWindowResize, false);

  window.addEventListener(`keydown`, ({keyCode}) => handleControllerKeyDown(getKeyCodeData(keyCode)));
  window.addEventListener(`keyup`, ({keyCode}) => handleControllerKeyUp(getKeyCodeData(keyCode)));

  const $resetButton = document.querySelector(`.reset-button`);
  $resetButton.addEventListener(`click`, threeController.scene.emptyScene);

  getMIDIAccess();

  loop();

};

init();
