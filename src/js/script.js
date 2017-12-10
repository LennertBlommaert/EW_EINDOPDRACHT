//import parseMidiMessage from './lib/parseMidiMessage';

//QUESTION overkill in onze toepassing?
// import Keyboard from './classes/Keyboard';
// let keyboard;

import getRandomArbitrary from './lib/getRandomArbitrary';


import MIDIController from './classes/MIDIController';
let midiController;

import onMIDIFailure from './lib/onMIDIFailure';

import ThreeController from './classes/ThreeController.js';
let threeController;
const loadedData = {};

//aimport createObjectOnNote from './lib/createObjectOnNote.js';

// import createmidiSynth from './lib/createmidiSynth';

let pushedFrequencies = [], pushedNotes = [];
import ToneController from './classes/ToneController.js';
let toneController, currentTonePosition = [0, 0, 0];

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

const getRandomPositionVector = () => {
  const z = getRandomArbitrary(- 500, 500);
  const x = getRandomArbitrary(- 500, 500);
  const y = getRandomArbitrary(- 10, - 5);

  return new THREE.Vector3(x, y, z);
};

const handleControllerKeyDown = ({note = 69, frequency = 440, velocity = 0.5}) => {
  //QUESTION: maybe a function creating objects based on frequencies instead of notes?
  // Maybe not, maybe rather play music based on notes

  const positionVector = getRandomPositionVector();

  threeController.scene.createObjectOnNote(note % 12, positionVector);

  //threeController.camera.lookAt(positionVector);

  pushedFrequencies.push(frequency);
  pushedNotes.push(note);
  toneController.midiSynth.triggerAttack(pushedFrequencies, undefined, velocity);

  if (pushedNotes.length > 1) checkChordType();
};

const handleControllerKeyUp = ({note = 69, frequency = 440}) => {
  pushedFrequencies = pushedFrequencies.filter(freq => freq !== frequency);
  pushedNotes = pushedNotes.filter(n => n !== note);
  toneController.midiSynth.triggerRelease([frequency]);
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
  threeController.scene.raiseTerrain(500, 10);
  //threeController.camera.bounce();
};

const handleToneControllerOnNewHalfMeasure = position => {
  const newTonePosition = position.split(`:`).map(e => parseInt(e, 10));

  if (newTonePosition[0] === currentTonePosition[0] + 1) {
    currentTonePosition = newTonePosition;

    threeController.camera.toggleMoveYDirection();
  }

  // console.log(`HANDLETONECONTROLLERONNEWHALFMEASURE - position: ${position}`);
};

const loop = () => {
  threeController.renderer.render(threeController.scene, threeController.camera);

  //threeController.camera.rotate();
  threeController.controls.update();
  threeController.scene.moveShadowLight();
  threeController.scene.lowerTerrain();
  threeController.camera.moveY();
  window.requestAnimationFrame(loop);
};

const getKeyCodeData = keyCode => {

  const keyCodeData = Constants.KEY_NOTE_FREQUENCY.filter(d => d.keyCode === keyCode)[0];

  if (keyCodeData !== undefined) return keyCodeData;

  return {};
};

const loadJSONFiles = () => {

  const loader = new THREE.JSONLoader();

  return new Promise(resolve => {

    loader.load(
      `assets/data/tree_01_animated6.json`,
      (geom, mat) => {
        loadedData.treeData = [geom, mat];
        resolve();
      }
    );

  })
  .then(

    loader.load(
      `assets/data/cloud2.json`,
      (geom, mat) => {
        loadedData.cloudData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/rock.json`,
      (geom, mat) => {
        loadedData.rockData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/mushroom.json`,
      (geom, mat) => {
        loadedData.mushroomData = [geom, mat];
        return;
      }
    )

  );
};

const initThree = () => {

  threeController = new ThreeController(loadedData);

  window.addEventListener(`resize`, handleWindowResize, false);

  loop();
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    console.log(document.querySelector(`.world`));
    document.querySelector(`.world`).requestFullscreen();
    handleWindowResize();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      handleWindowResize();
    }
  }
};

const initTone = () => {
  toneController = new ToneController();
  toneController.on(`tonecontrollerplayedtom`, handleToneControllerBeatPlayed);
  toneController.on(`tonecontrollernewhalfmeasure`, handleToneControllerOnNewHalfMeasure);
};

const init = () => {

  loadJSONFiles()
    .then(() => {
      initThree();
      initTone();
    })
    .catch(reason => console.error(`Loading JSON files vor three objects failed: ${reason}`));

  getMIDIAccess();

  const $toggleFullScreenButton = document.querySelector(`.toggle-fullscreen-button`);
  $toggleFullScreenButton.addEventListener(`click`, toggleFullScreen);

  window.addEventListener(`keydown`, ({keyCode}) => {
    if (keyCode === 13 || keyCode === 27) return;
    handleControllerKeyDown(getKeyCodeData(keyCode));
  });
  window.addEventListener(`keyup`, ({keyCode}) => {
    if (keyCode === 13 || keyCode === 27) return toggleFullScreen();
    handleControllerKeyUp(getKeyCodeData(keyCode));
  });

  console.log([- 0.421478, 0.903092, - 0.13137, - 0.00461831, 1.41483, 0.437521, - 0.264021, 1.41483, - 0.349951, 0.248387, 1.41483, - 0.352031, 0.408707, 1.41483, 0.134654, - 0.0934184, 1.67712, - 0.0615906, - 0.0379565, 0.827779, 0.393319, 0.407614, 0.903092, 0.138018, 0.0806472, 0.640801, - 0.0615906, - 0.350765, 0.801675, 0.121923, 0.503548, 1.18514, 0.00164211, 0.151193, 1.18514, 0.486618, - 0.441055, 1.33322, 0.256114, - 0.16322, 1.0783, - 0.481045, - 0.516319, 1.13278, 0.00164211, 0.278952, 0.982612, - 0.387682, 0.159166, 1.62677, 0.121922, - 0.00638558, - 0.00408745, - 0.106665, - 0.00638558, 1.06192, - 0.0531996, 0.0874113, - 0.00408745, - 0.0525115, 0.0411088, 1.06192, - 0.0257788, 0.0874113, - 0.00408745, 0.0557958, 0.0411088, 1.06192, 0.029063, - 0.00638559, - 0.00408745, 0.109949, - 0.00638559, 1.06192, 0.0564839, - 0.100182, - 0.00408745, 0.0557958, - 0.0538799, 1.06192, 0.029063, - 0.100182, - 0.00408745, - 0.0525115, - 0.0538799, 1.06192, - 0.0257788].length);
};

init();
