import ThreeController from './classes/ThreeController/';
import ToneController from './classes/ToneController/';
import VisualKeyboardController from './classes/VisualKeyboardController/';

import MIDIController from './classes/MIDIController';
import GameController from './classes/GameController';

import {getRandomPositionVector, mapNumber, getKeyCodeData} from './lib/functions';
import loadJSONFiles from './lib/loadJSONFiles';

import teoria from 'teoria';
import piu from 'piu';

import Constants from './objects/Constants';

let threeController, midiController, gameController, visualKeyboardController, toneController;

let controllerKeyIsDown = false, gameModusIsActive = false, midiControllerIsConnected = false, experimentIsLaunched = false;

let currentTonePosition = [0, 0, 0], pushedFrequencies = [], pushedNotes = [];

//const $shortcutVisualisation = document.querySelector(`.shortcut-visualisation`);
const $speedSlider = document.querySelector(`#bpm-range`),
  $toggleFullScreenButton = document.querySelector(`.toggle-fullscreen-button`),
  $toggleGameModusButton = document.querySelector(`.toggle-game-modus`),
  $gui = document.querySelector(`.gui`),
  $helpWindow = document.querySelector(`.info-helpWindow`),
  $infoBtn = document.querySelector(`.info-helpBtn`);

// Currently unavailable, yet promising
//import {chord} from 'tonal-detect';

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

  if (notesInfo[0].type === `m`) return handleMinorChordPlayed();
  if (notesInfo[0].type === ``) return handleMajorChordPlayed();
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

const setWorldSpeed = value => {
  $speedSlider.value = value;
  threeController.controls.setAutorationSpeed(value / 40);
  toneController.setBPM(value);
};

const toggleFullScreen = () => {
  $toggleFullScreenButton.classList.toggle(`btn-toggle`);
  if (!document.fullscreenElement) {
    document.querySelector(`.world`).requestFullscreen();
    // document.querySelector(`.global-container`).requestFullscreen();
    handleWindowResize();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      handleWindowResize();
    }
  }
};

const toggleGameModus = () => {
  $toggleGameModusButton.classList.toggle(`btn-toggle`);
  gameController.start();
  gameModusIsActive = !gameModusIsActive;
};

/*

  EVENT HANDLERS

*/

const handleControllerKeyDown = ({note = 69, frequency = 440, velocity = 0.5}) => {
  //const positionVector = getRandomPositionVector(Constants.WORLD_ELEMENT_POSITION_SPREAD).applyMatrix4(threeController.camera.matrixWorld);
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

const handleMinorChordPlayed = () => {
  toneController.distort();
  threeController.darken();
};

const handleMajorChordPlayed = () => {
  toneController.clean();
  threeController.brighten();
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

const handleOnThreeControllerIntersection = objectName => {
  const frequency = Constants.KEY_NOTE_FREQUENCY_OBJECTNAME.find(d => d.objectName === objectName).frequency;
  if (frequency === undefined) return;
  toneController.pannerSynth.triggerAttackRelease(frequency, `8n`);
};

const handleCanvasClick = () =>  threeController.checkIntersections();

const handleMouseMove = e => {
  const {x = e.clientX, y = e.clientY, shiftKey, ctrlKey, altKey, metaKey} = e;

  const mappedX = mapNumber(x, 0, window.innerWidth, 0, 1);
  const mappedY = mapNumber(y, 0, window.innerHeight, 0, 1);
  toneController.updateEffects(mappedX, mappedY);

  if (shiftKey) handleMouseMoveWithShiftKey(x, y);
  if (ctrlKey) handleMouseMoveWithControlKey(x, y);
  if (altKey) handleMouseMoveWithAltKey(x, y);
  if (metaKey) handleMouseMoveWithMetaKey(x, y);

  threeController.updateMouse((x / window.innerWidth) * 2 - 1, (y / window.innerHeight) * 2 - 1);

  // $shortcutVisualisation.classList.add(`active`);
  // $shortcutVisualisation.querySelector(`.y`).textContent = parseInt(mappedX, 10);
  // $shortcutVisualisation.querySelector(`.x`).textContent = parseInt(mappedY, 10);
  // window.setTimeout($shortcutVisualisation.classList.remove(`active`), 1000);
};

const handleMouseMoveWithShiftKey = (x, y) => {
  const mappedX = mapNumber(x, 0, window.innerWidth, Constants.BPM_MIN, Constants.BPM_MAX);
  const mappedY = mapNumber(y, 0, window.innerHeight, Constants.MASTER_VOLUME_MIN, Constants.MASTER_VOLUME_MAX);
  setWorldSpeed(mappedX);
  toneController.setMasterVolume(mappedY);
};

const handleMouseMoveWithControlKey = (x, y) => {
  const mappedX = mapNumber(x, 0, window.innerWidth, 0, 1);
  const mappedY = mapNumber(y, 0, window.innerHeight, 0, 1);
  threeController.scene.setLightsIntensities(mappedX, mappedY);
};

const handleMouseMoveWithAltKey = (x, y) => {
  const mappedX = mapNumber(x, 0, window.innerWidth, 0, 1);
  const mappedY = mapNumber(y, 0, window.innerHeight, 0, 1);
  console.log(mappedX, mappedY);
};

const handleMouseMoveWithMetaKey = (x, y) => {
  const mappedX = mapNumber(x, 0, window.innerWidth, 0, 1);
  const mappedY = mapNumber(y, 0, window.innerHeight, 0, 1);
  console.log(mappedX, mappedY);
};

const handleOnWindowKeyUp = ({keyCode}) => {
  if (keyCode === 13 || keyCode === 27) return toggleFullScreen();
  if (getKeyCodeData(keyCode) !== undefined) {
    handleControllerKeyUp(getKeyCodeData(keyCode));
  }
};

const handleOnWindowKeyDown = ({keyCode}) => {
  if (getKeyCodeData(keyCode) !== undefined) {
    console.log(getKeyCodeData(keyCode));
    handleControllerKeyDown(getKeyCodeData(keyCode));
  }
};

const handleOnSpeedSliderInput = e => {
  const value = parseInt(e.target.value, 10);
  setWorldSpeed(value);
};

const handleOnMouseOverGui = () => $gui.classList.add(`active`);

const handleOnMouseLeaveGui = () => $gui.classList.remove(`active`);

const handleOnMouseOverhelpBtn = () => $helpWindow.classList.add(`active`);

const handleOnMouseLeavehelpBtn = () => $helpWindow.classList.remove(`active`);


/*
  INIT CONTROLLERS
*/

const initThree = loadedData => {

  threeController = new ThreeController(loadedData);
  threeController.on(`threeControllerOnIntersection`, handleOnThreeControllerIntersection);

  window.addEventListener(`resize`, handleWindowResize, false);

  loop();
};

const initTone = () => {
  toneController = new ToneController();
  toneController.on(`tonecontrollerplayedtom`, handleToneControllerBeatPlayed);
  toneController.on(`tonecontrollernewhalfmeasure`, handleToneControllerOnNewHalfMeasure);
};

const initVisualKeyboard = () => {
  visualKeyboardController = new VisualKeyboardController(Constants.KEYS);
  visualKeyboardController.keys.forEach(key => key.on(`keyboardVisualisationKeyOnMouseDown`, keyData => handleControllerKeyDown(keyData)));
  visualKeyboardController.keys.forEach(key => key.on(`keyboardVisualisationKeyOnMouseUp`, keyData => handleControllerKeyUp(keyData)));
};

const initEventListeners = () => {
  const $startbtn = document.querySelector(`.start-info-btn`);
  $startbtn.addEventListener(`click`, launchExperiment);

  $toggleFullScreenButton.addEventListener(`click`, toggleFullScreen);
  $toggleGameModusButton.addEventListener(`click`, toggleGameModus);

  window.addEventListener(`keydown`, handleOnWindowKeyDown);
  window.addEventListener(`keyup`, handleOnWindowKeyUp);

  window.addEventListener(`mousemove`, handleMouseMove);
  document.querySelector(`canvas`).addEventListener(`click`, handleCanvasClick);

  $speedSlider.addEventListener(`input`, e => handleOnSpeedSliderInput(e));

  $gui.addEventListener(`mouseover`, handleOnMouseOverGui);
  $gui.addEventListener(`mouseleave`, handleOnMouseLeaveGui);

  $infoBtn.addEventListener(`mouseover`, handleOnMouseOverhelpBtn);
  $infoBtn.addEventListener(`mouseleave`, handleOnMouseLeavehelpBtn);

  window.addEventListener(`blur`, () => toneController.pauseTransport());
  window.addEventListener(`focus`, () => toneController.startTransport());
};

const initMIDI = () => {
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
  midiController.on(`midiControllerConnectionOpen`, () => {
    launchExperiment();
    midiControllerIsConnected = true;
    visualKeyboardController.removeKeysContainerActive();
  });
  midiController.on(`midiControllerConnectionClosed`, () => {
    if (experimentIsLaunched) visualKeyboardController.addKeysContainerActive();
    midiControllerIsConnected = false;
  });
};


const init = () => {

  loadJSONFiles()
    .then(loadedData => {
      initThree(loadedData);
      initTone();
      initVisualKeyboard();
      gameController = new GameController(`game-notes`);
      initEventListeners();
      initMIDI();
    })
    .catch(reason => console.error(`Loading JSON files for three objects failed: ${reason}`));
};

const launchExperiment = () => {
  const $startContainer = document.querySelector(`.start-container`);

  $startContainer.classList.remove(`active`);
  window.setTimeout(() => $startContainer.style.display = `none`, 1001);

  experimentIsLaunched = true;

  $gui.classList.add(`active`);
  window.setTimeout(() => $gui.classList.remove(`active`), 2000);

  $infoBtn.classList.add(`active`);

  if (!midiControllerIsConnected) visualKeyboardController.addKeysContainerActive();
};


init();
