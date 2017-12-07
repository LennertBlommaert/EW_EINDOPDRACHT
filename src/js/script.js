//import parseMidiMessage from './lib/parseMidiMessage';

//QUESTION overkill in onze toepassing?
// import Keyboard from './classes/Keyboard';
// let keyboard;

import MIDIController from './classes/MIDIController';
let midiController;

import onMIDIFailure from './lib/onMIDIFailure';

import ThreeController from './classes/ThreeController.js';
let threeController;
const loadedData = {};

//aimport createObjectOnNote from './lib/createObjectOnNote.js';

// import createSynth from './lib/createSynth';

let pushedFrequencies = [], pushedNotes = [];
import ToneController from './classes/ToneController.js';
let toneController;

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
  console.log(`SCENE:`, threeController.scene);

  //QUESTION: maybe a function creating objects based on frequencies instead of notes?
  // Maybe not, maybe rather play music based on notes
  threeController.scene.createObjectOnNote(note, threeController.camera.rotation);
  pushedFrequencies.push(frequency);
  pushedNotes.push(note);
  toneController.synth.triggerAttack(pushedFrequencies, undefined, velocity);

  //threeController.camera.lookAt(threeController.scene.children[threeController.scene.children.length - 1]);
  //Only check when multiple keys are being pressed
  //
  // console.log(threeController.camera.getEffectiveFOV());
  // console.log(threeController.camera.getFilmHeight());
  // console.log(threeController.camera.getFilmWidth());
  // console.log(threeController.camera);
  // console.log(threeController.renderer);

  if (pushedNotes.length > 1) checkChordType();
};

const handleControllerKeyUp = ({note = 69, frequency = 440}) => {
  pushedFrequencies = pushedFrequencies.filter(freq => freq !== frequency);
  pushedNotes = pushedNotes.filter(n => n !== note);
  toneController.synth.triggerRelease([frequency]);
};

const handleWindowResize = () => {
  Constants.WIDTH = window.innerWidth;
  Constants.HEIGHT = window.innerHeight;

  threeController.renderer.setSize(Constants.WIDTH, Constants.HEIGHT);

  threeController.camera.aspect = Constants.WIDTH / Constants.HEIGHT;
  threeController.camera.updateProjectionMatrix();
};

const handleToneControllerBeatPlayed = () => {
  //NOTE: can be replaced by something
  //Seemed like a fun effect in the moment
  threeController.scene.raiseTerrain(500, 20);
  //threeController.camera.bounce();
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

const loadJSONFiles = () => {

  console.log(`LOADJSONFILES`);
  const loader = new THREE.JSONLoader();

  return new Promise(resolve => {

    loader.load(
      `assets/data/tree.json`,
      (geom, mat) => {
        loadedData.treeData = [geom, mat];
        resolve();
      }
    );

  })
  .then(

    loader.load(
      `assets/data/cloud.json`,
      (geom, mat) => {
        loadedData.cloudData = [geom, mat];
        return;
      }
    )

  );
};

const initThree = () => {

  console.log(`initTHREE`);

  threeController = new ThreeController(loadedData);

  window.addEventListener(`resize`, handleWindowResize, false);

  window.addEventListener(`keydown`, ({keyCode}) => handleControllerKeyDown(getKeyCodeData(keyCode)));
  window.addEventListener(`keyup`, ({keyCode}) => handleControllerKeyUp(getKeyCodeData(keyCode)));

  loop();
};

const init = () => {

  loadJSONFiles()
    .then(() => initThree())
    .catch(reason => console.error(`Loading JSON files vor three objects failed: ${reason}`));


  toneController = new ToneController();
  toneController.on(`tonecontrollerplayedtom`, handleToneControllerBeatPlayed);

  getMIDIAccess();
};

init();
