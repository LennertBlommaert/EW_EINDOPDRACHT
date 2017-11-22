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
let scene, camera, renderer;

import createSynth from './lib/createSynth';
let synth, pushedNotes = [];

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
  const MIDIInputValues = getMIDIInputValues(MIDIAccess);

  MIDIInputValues.forEach(inputValue => {
    inputValue.onmidimessage = onMIDIMessage;
  });

  MIDIAccess.onstatechange = e => onMIDIAccessStateChange(e);
};

const onMIDIMessage = ({data: MIDIData} = [0, 0, 0]) => {
  const {command, note, velocity} = parseMIDIMessageData(MIDIData);
  // const {command, note} = parseMIDIMessageData(MIDIData);

  if (command === Constants.MIDI_KEY_DOWN_COMMAND) {
    createObjectOnNote(note, scene);
    pushedNotes.push(note);
    synth.triggerAttack(pushedNotes, undefined, velocity);
  } else {
    pushedNotes = pushedNotes.filter(n => n !== note);
    synth.triggerRelease([note]);
  }

  // Note - time - velocity
  //synth.triggerAttack(note, new Date().getTime(), velocity);

  //Stop playing note after a while
  //synth.triggerAttackRelease(pushedNotes, `4n`);
};


const handleWindowResize = () => {
  Constants.WIDTH = window.innerWidth;
  Constants.HEIGHT = window.innerHeight;

  renderer.setSize(Constants.WIDTH, Constants.HEIGHT);
  camera.aspect = Constants.WIDTH / Constants.HEIGHT;
  camera.updateProjectionMatrix();
};

const setupScene = () => {
  scene = createScene();
  camera = createCamera(Constants.WIDTH / Constants.HEIGHT);
  renderer = createRenderer();

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

  synth = createSynth();

  console.log(synth);

  loop();

};

init();
