import EventEmitter2 from '../vendors/eventemitter2';
import AmbientNoise from './AmbientNoise';
import BeatSynth from './BeatSynth';
import MainSynth from './MainSynth';
import Constants from '../objects/Constants';
import Tone from 'tone';

export default class ToneController extends EventEmitter2 {
  constructor() {
    super({});

    this.beatNote = Constants.BEAT_NOTE;
    this.seqEvents = [this.beatNote, 0, 0, `D0`, 0, 0];

    this.seq = new Tone.Sequence(this._playNote, this.seqEvents, `6n`);
    this.seq.start();

    this.loop = new Tone.Loop(() => {
      this.emit(`tonecontrollernewhalfmeasure`, Tone.Transport.position);
    }, `2n`);
    this.loop.start();

    this.createWind();
    this._createSynths();

    Tone.Transport.start();
    Tone.Transport.bpm.value = Constants.BPM;

    this.drumBeatRepresentationsList = document.querySelector(`.drum-beat-representations`);
    this.drumBeatRepresentationsList.addEventListener(`click`, e => this.handleOnDrumBeatRepresentationsListClick(e));
    this.drumBeatRepresentations = Array.from(document.querySelectorAll(`.drum-beat-representation`));
    this._setDrumBeatRepresentationssetInitialClasses();

    this.echoSynth = new Tone.AMSynth().toMaster();

    this._linkControls();

    Tone.Listener.setPosition(0, 0, 0);

    //this.createAmbientNoises(130.81, 146.83, 164.81, 174.61, 195.99, 220, 246.94);
  }

  setListenerPosition = (position, orientation, up) => {
    Tone.Listener.setPosition(position.x, position.y, position.z);
    Tone.Listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z);
  }

  _createSynths = () => {

    this.autoWahEffect = new Tone.AutoWah(50, 10, - 30);
    // this.autoWahEffect.toMaster();

    this.chorusEffect = new Tone.Chorus();
    // this.chorusEffect.connect(this.autoWahEffect);

    this.panner = new Tone.Panner3D({coneOuterGain: 10});
    this.pannerSynth = new Tone.PolySynth(4, Tone.PluckySynth).connect(this.panner);
    this.pannerSynth.volume.value = 10;

    this.mainSynth = new MainSynth();

    this.pannerSynth.chain(this.autoWahEffect, this.chorusEffect, Tone.Master);
    this.mainSynth.chain(this.autoWahEffect, this.chorusEffect, Tone.Master);

    // TOMS AND KICK
    this.membraneSynth = new BeatSynth();
  }

  handleOnDrumBeatRepresentationsListClick = ({target}) => {

    const index = parseInt(target.dataset.order, 10);

    target.classList.toggle(`active`);

    if (this.seq.at(index).value === 0) return this.seq.at(index, this.beatNote);

    this.seq.at(index, 0);

  }

  _setDrumBeatRepresentationssetInitialClasses = () => {
    this.seqEvents.forEach((e, i) => {
      if (e !== 0) this.drumBeatRepresentations[i].classList.toggle(`active`);
    });
  }

  _playNote = (time, note) => {
    if (note !== 0) {
      this.emit(`tonecontrollerplayedtom`, note);
      this.membraneSynth.triggerAttackRelease(note, `2n`);
    }
  }

  _linkControls = () => {
    this.$volumeRange = document.querySelector(`#sound-volume-range`);
    this.$volumeRange.addEventListener(`input`, ({currentTarget}) => this.handleVolumeRangeInput(parseInt(currentTarget.value, 10)));

    this.$autoRotateButton = document.querySelector(`.drum-beat-button`);
    this.$autoRotateButton.addEventListener(`click`, this.toggleBeat);
  }

  updateEffects = (x, y) => {
    x = x / window.innerWidth;
    y = y / window.innerHeight;

    this.autoWahEffect.wet.value = x;
    this.chorusEffect.wet.value = y;
  }

  handleVolumeRangeInput = volume => {
    this.mainSynth.volume.value = volume;
    this.membraneSynth.volume.value = volume - volume / 3;
  }

  toggleBeat = () => this.seq.loop = !this.seq.loop;

  setBPM = bpm => {
    Tone.Transport.bpm.rampTo(bpm, .5);
  }

  createWind = () => {
    this.windNoise = new AmbientNoise();
  }

  createAmbientNoises = (...frequencies) => {
    this.ambientNoises = frequencies.map(freq => this.ambientNoises = new AmbientNoise(freq));
    //this.echoSynth.triggerAttackRelease(frequency, `8n`, `+0.5`);
  }

  turnAmbientNoiseUp = frequency => {
    this.ambientNoise = this.ambientNoises.find(noise => noise.baseFrequency === frequency);
    if (this.ambientNoise) this.ambientNoise.turnNoiseUp(1);
  }
}
