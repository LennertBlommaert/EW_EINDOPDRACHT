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

    this.masterVolume = new Tone.Volume();

    this._createWind();
    this._createEffects();
    this._createSynths();

    Tone.Transport.start();
    Tone.Transport.bpm.value = Constants.BPM;

    this.drumBeatRepresentationsList = document.querySelector(`.drum-beat-representations`);
    this.drumBeatRepresentationsList.addEventListener(`click`, e => this.handleOnDrumBeatRepresentationsListClick(e));
    this.drumBeatRepresentations = Array.from(document.querySelectorAll(`.drum-beat-representation`));
    this._setDrumBeatRepresentationssetInitialClasses();

    //this.echoSynth = new Tone.AMSynth().toMaster();

    this._linkControls();

    Tone.Listener.setPosition(0, 0, 0);

    //this.createAmbientNoises(130.81, 146.83, 164.81, 174.61, 195.99, 220, 246.94);
  }

  setListenerPosition = (position, orientation, up) => {
    Tone.Listener.setPosition(position.x, position.y, position.z);
    Tone.Listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z);
  }

  _createEffects = () => {
    this.autoWahEffect = new Tone.AutoWah(50, 10, - 30);
    this.chorusEffect = new Tone.Chorus();
    this.distortEffect = new Tone.Distortion();
    this.distortEffect.wet.value = 0.1;
  }

  _createSynths = () => {
    this.panner = new Tone.Panner3D({coneOuterGain: 10});
    this.pannerSynth = new Tone.PolySynth(4, Tone.PluckySynth).connect(this.panner);
    this.pannerSynth.volume.value = 10;

    this.mainSynth = new MainSynth();

    this.pannerSynth.chain(this.autoWahEffect, this.chorusEffect, this.distortEffect, this.masterVolume, Tone.Master);
    this.mainSynth.chain(this.autoWahEffect, this.chorusEffect, this.distortEffect, this.masterVolume, Tone.Master);
    // this.pannerSynth.chain(this.autoWahEffect, this.chorusEffect, this.distortEffect, Tone.Master);
    // this.mainSynth.chain(this.autoWahEffect, this.chorusEffect, this.distortEffect, Tone.Master);

    // TOMS AND KICK
    this.membraneSynth = new BeatSynth();
    this.membraneSynth.chain(this.distortEffect, this.masterVolume, Tone.Master);

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

  distort = () => this.distortEffect.wet.value += 0.05;

  clean = () => this.distortEffect.wet.value -= 0.05;

  setMasterVolume = volume => {
    this.masterVolume.volume.value = volume;
    this.$volumeRange.value = volume;
  }

  toggleBeat = () => this.seq.loop = !this.seq.loop;

  setBPM = bpm => {
    Tone.Transport.bpm.rampTo(bpm, .5);
  }

  _createWind = () => {
    this.windNoise = new AmbientNoise();
    this.windNoise.autoFilter.chain(this.masterVolume, Tone.Master);
  }

  createAmbientNoises = (...frequencies) => {
    this.ambientNoises = frequencies.map(freq => this.ambientNoises = new AmbientNoise(freq));
    //this.echoSynth.triggerAttackRelease(frequency, `8n`, `+0.5`);
  }

  turnAmbientNoiseUp = frequency => {
    this.ambientNoise = this.ambientNoises.find(noise => noise.baseFrequency === frequency);
    if (this.ambientNoise) this.ambientNoise.turnNoiseUp(1);
  }

  startTransport = () => Tone.Transport.start();

  pauseTransport = () => Tone.Transport.pause();
}
