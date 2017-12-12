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

let controllerKeyIsDown = false;

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

  threeController.scene.manipulateWorldOnNote(note % 12, positionVector);
  toneController.turnAmbientNoiseUp(frequency);

  //threeController.camera.lookAt(positionVector);

  pushedFrequencies.push(frequency);
  pushedNotes.push(note);
  toneController.midiSynth.triggerAttack(pushedFrequencies, undefined, velocity);

  if (pushedNotes.length > 1) checkChordType();

  controllerKeyIsDown = true;
};

const handleControllerKeyUp = ({note = 69, frequency = 440}) => {
  pushedFrequencies = pushedFrequencies.filter(freq => freq !== frequency);
  pushedNotes = pushedNotes.filter(n => n !== note);
  toneController.midiSynth.triggerRelease([frequency]);

  controllerKeyIsDown = false;
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
  threeController.scene.raiseTerrain(20, 10);
  //threeController.camera.bounce();
};

const handleToneControllerOnNewHalfMeasure = position => {
  const newTonePosition = position.split(`:`).map(e => parseInt(e, 10));

  //FULL MEASURE
  if (newTonePosition[0] === currentTonePosition[0] + 1) {
    currentTonePosition = newTonePosition;
    threeController.camera.toggleMoveYDirection();
    threeController.scene.particles.toggleMoveDirection();
  }

  // if (newTonePosition[0] === currentTonePosition[0] + 8) {
  // }

  // console.log(`HANDLETONECONTROLLERONNEWHALFMEASURE - position: ${position}`);
};

const loop = () => {
  //threeController.camera.rotate();
  threeController.controls.update();
  threeController.scene.moveShadowLight();
  threeController.scene.lowerTerrain(20, 0.6);
  threeController.camera.moveY();
  //threeController.checkIntersections();

  threeController.scene.particles.move();

  if (controllerKeyIsDown) {
    threeController.scene.inflateLastChild();
  }

  threeController.renderer.render(threeController.scene, threeController.camera);
  window.requestAnimationFrame(loop);
};

const getKeyCodeData = keyCode => {
  const keyCodeData = Constants.KEY_NOTE_FREQUENCY_OBJECTNAME.find(d => d.keyCode === keyCode);

  if (keyCodeData !== undefined) return keyCodeData;
  return {};
};

const handleOnThreeControllerIntersection = objectName => {

  const frequency = Constants.KEY_NOTE_FREQUENCY_OBJECTNAME.find(d => d.objectName === objectName).frequency;

  if (frequency === undefined) return;

  console.log(frequency);

  toneController.midiSynth.triggerAttackRelease(frequency, `8n`);
};

const initThree = () => {

  threeController = new ThreeController(loadedData);
  threeController.on(`threeControllerOnIntersection`, handleOnThreeControllerIntersection);

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

const handleMouseMove = e => {
  const {x = e.clientX, y = e.clientY} = e;

  threeController.mouse.x = (x / window.innerWidth) * 2 - 1;
  threeController.mouse.y = (y / window.innerHeight) * 2 - 1;
};

const handleCanvasClick = () =>  threeController.checkIntersections();

const initEventListeners = () => {
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

  window.addEventListener(`mousemove`, handleMouseMove);
  document.querySelector(`canvas`).addEventListener(`click`, handleCanvasClick);
};

const init = () => {

  loadJSONFiles()
    .then(() => {
      initThree();
      initTone();
      initEventListeners();
    })
    .catch(reason => console.error(`Loading JSON files vor three objects failed: ${reason}`));

  getMIDIAccess();
};

const loadJSONFiles = () => {

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

init();
