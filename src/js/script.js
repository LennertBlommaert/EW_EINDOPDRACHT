import ThreeController from './classes/ThreeController.js';
import ToneController from './classes/ToneController.js';
import MIDIController from './classes/MIDIController';
import GameController from './classes/GameController.js';
import VisualKeyboardController from './classes/VisualKeyboardController';

import getRandomPositionVector from './lib/getRandomPositionVector';
import mapNumber from './lib/mapNumber';

import teoria from 'teoria';
import piu from 'piu';

import Constants from './objects/Constants';

let threeController;
let midiController;
let gameController;
let visualKeyboardController;
let toneController;

let controllerKeyIsDown = false;
let gameModusIsActive = false;

let currentTonePosition = [0, 0, 0];
let pushedFrequencies = [];
let pushedNotes = [];

const $speedSlider = document.querySelector(`#bpm-range`);
const loadedData = {};

// Currently unavailable, yet promising
//import {chord} from 'tonal-detect';

const getMIDIAccess = () => {
  if (navigator.requestMIDIAccess) {

    return navigator.requestMIDIAccess()
    .then(MIDISucces, e => console.log(e));

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
  //MORE / LESS DISTORTION
  toneController.distort();
  threeController.darken();
};

const majorChordPlayed = () => {
  //MORE / LESS DISTORTION
  toneController.clean();
  threeController.brighten();
};

const getNotesInfo = notes => {
  const teoriaNotes = notes.map(teoria.note.fromMIDI);
  // const triads = piu.triads(teoriaNotes);
  return piu.infer(teoriaNotes);
};

const getNoteInfo = note => {
  const teoriaNote = teoria.note.fromMIDI(note);
  const noteName = teoriaNote.name().toUpperCase();
  const noteAccidental = teoriaNote.accidental();
  //const noteScientific = teoriaNote.scientific();
  return `${noteName}${noteAccidental}`;
};

const checkChordType = () => {
  const notesInfo = getNotesInfo(pushedNotes);

  // Check if a chord is recognised
  if (notesInfo.length === 0) return;

  if (notesInfo[0].type === `m`) return minorChordPlayed();
  if (notesInfo[0].type === ``) return majorChordPlayed();
};

const handleControllerKeyDown = ({note = 69, frequency = 440, velocity = 0.5}) => {
  const positionVector = getRandomPositionVector(Constants.WORLD_ELEMENT_POSITION_SPREAD);

  threeController.scene.manipulateWorldOnNote(note, positionVector);
  //toneController.turnAmbientNoiseUp(frequency);

  toneController.setListenerPosition(threeController.camera.position, threeController.camera.rotation, threeController.camera.up);
  toneController.panner.setPosition(positionVector.x, positionVector.y, positionVector.z);

  pushedFrequencies.push(frequency);
  pushedNotes.push(note);

  toneController.pannerSynth.triggerAttack(pushedFrequencies, undefined, velocity);
  toneController.mainSynth.triggerAttack(pushedFrequencies, undefined, velocity);

  if (pushedNotes.length > 1) checkChordType();

  controllerKeyIsDown = true;

  visualKeyboardController.toggleCurrentKeyActive(note);

  if (gameModusIsActive) {
    if (getNotesInfo(pushedNotes).root) return gameController.checkNotePlayed(getNotesInfo(pushedNotes).root);
    gameController.checkNotePlayed(getNoteInfo(note));
  }
};

const handleControllerKeyUp = ({note = 69, frequency = 440}) => {
  pushedFrequencies = pushedFrequencies.filter(freq => freq !== frequency);
  pushedNotes = pushedNotes.filter(n => n !== note);
  toneController.pannerSynth.triggerRelease([frequency]);
  toneController.mainSynth.triggerRelease([frequency]);

  visualKeyboardController.toggleCurrentKeyActive(note);

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
  threeController.scene.raiseTerrain(0, 5);
};

const handleToneControllerOnNewHalfMeasure = position => {
  const newTonePosition = position.split(`:`).map(e => parseInt(e, 10));

  //FULL MEASURE
  if (newTonePosition[0] === currentTonePosition[0] + 1) {
    currentTonePosition = newTonePosition;
    threeController.camera.toggleMoveYDirection();
    threeController.scene.particles.toggleMoveDirection();
  }
};

const loop = () => {
  threeController.controls.update();
  threeController.scene.moveShadowLight();
  threeController.scene.lowerTerrain();
  threeController.camera.moveY();

  threeController.scene.particles.move();
  threeController.scene.updateAnimationMixerWorldElements();

  if (controllerKeyIsDown) {
    threeController.scene.inflateLastChildren(pushedNotes.length);

    // if (gameModusIsActive) {
    //   gameController.updateCurrentNote();
    // }
  }

  threeController.renderer.render(threeController.scene, threeController.camera);
  window.requestAnimationFrame(loop);
};

const getKeyCodeData = keyCode => {
  const keyCodeData = Constants.KEYS.find(d => d.keyCode === keyCode);
  return keyCodeData;
};

const handleOnThreeControllerIntersection = objectName => {
  const frequency = Constants.KEY_NOTE_FREQUENCY_OBJECTNAME.find(d => d.objectName === objectName).frequency;
  if (frequency === undefined) return;
  toneController.pannerSynth.triggerAttackRelease(frequency, `8n`);
};

const setWorldSpeed = value => {
  $speedSlider.value = value;
  threeController.controls.setAutorationSpeed(value / 40);
  toneController.setBPM(value);
};

const initThree = () => {

  threeController = new ThreeController(loadedData);
  threeController.on(`threeControllerOnIntersection`, handleOnThreeControllerIntersection);

  window.addEventListener(`resize`, handleWindowResize, false);

  loop();
};

const initVisualKeyboard = () => {
  visualKeyboardController = new VisualKeyboardController(Constants.KEYS);
  visualKeyboardController.keys.forEach(key => key.on(`keyboardVisualisationKeyOnMouseDown`, keyData => handleControllerKeyDown(keyData)));
  visualKeyboardController.keys.forEach(key => key.on(`keyboardVisualisationKeyOnMouseUp`, keyData => handleControllerKeyUp(keyData)));
  // visualKeyboardController.keys.forEach(key => key.on('keyboardVisualisationKeyOnClick', handleKeyboardVisualisationKeyOnClick));
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.querySelector(`.world`).requestFullscreen();
    handleWindowResize();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      handleWindowResize();
    }
  }
};

const toggleGameModus = () => {
  gameController.start();
  gameModusIsActive = !gameModusIsActive;
};

const initTone = () => {
  toneController = new ToneController();
  toneController.on(`tonecontrollerplayedtom`, handleToneControllerBeatPlayed);
  toneController.on(`tonecontrollernewhalfmeasure`, handleToneControllerOnNewHalfMeasure);
};

const handleMouseMove = e => {
  const {x = e.clientX, y = e.clientY, shiftKey} = e;

  if (shiftKey) {
    const mappedX = mapNumber(x, 0, window.innerWidth, Constants.BPM_MIN, Constants.BPM_MAX);
    setWorldSpeed(mappedX);

    const mappedY = mapNumber(y, 0, window.innerHeight, Constants.MASTER_VOLUME_MIN, Constants.MASTER_VOLUME_MAX);
    toneController.setMasterVolume(mappedY);
  }

  threeController.mouse.x = (x / window.innerWidth) * 2 - 1;
  threeController.mouse.y = (y / window.innerHeight) * 2 - 1;

  toneController.updateEffects(x, y);
};

const handleCanvasClick = () =>  threeController.checkIntersections();

const initEventListeners = () => {
  const $toggleFullScreenButton = document.querySelector(`.toggle-fullscreen-button`);
  $toggleFullScreenButton.addEventListener(`click`, toggleFullScreen);

  const $toggleGameModusButton = document.querySelector(`.toggle-game-modus`);
  $toggleGameModusButton.addEventListener(`click`, toggleGameModus);

  window.addEventListener(`keydown`, ({keyCode}) => {
    if (getKeyCodeData(keyCode) !== undefined) {
      console.log(getKeyCodeData(keyCode));
      handleControllerKeyDown(getKeyCodeData(keyCode));
    }
  });
  window.addEventListener(`keyup`, ({keyCode}) => {
    if (keyCode === 13 || keyCode === 27) return toggleFullScreen();
    if (getKeyCodeData(keyCode) !== undefined) {
      handleControllerKeyUp(getKeyCodeData(keyCode));
    }
  });

  window.addEventListener(`mousemove`, handleMouseMove);
  document.querySelector(`canvas`).addEventListener(`click`, handleCanvasClick);

  $speedSlider.addEventListener(`input`, e => {
    const value = parseInt(e.target.value, 10);
    setWorldSpeed(value);
  });

  window.addEventListener(`blur`, () => toneController.pauseTransport());
  window.addEventListener(`focus`, () => toneController.startTransport());
};

const init = () => {

  loadJSONFiles()
    .then(() => {
      initThree();
      initTone();
      initEventListeners();
      initVisualKeyboard();
      gameController = new GameController(`game-notes`);
    })
    .catch(reason => console.error(`Loading JSON files for three objects failed: ${reason}`));

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

  )
  .then(

    loader.load(
      `assets/data/evergreen.json`,
      (geom, mat) => {
        loadedData.evergreenData = [geom, mat];
        return;
      }
    )

  )
  .then(

    loader.load(
      `assets/data/flower.json`,
      (geom, mat) => {
        loadedData.flowerData = [geom, mat];
        return;
      }
    )

  );
};

init();
