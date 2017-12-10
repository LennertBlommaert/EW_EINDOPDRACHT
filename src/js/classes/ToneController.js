import EventEmitter2 from '../vendors/eventemitter2';
import AmbientNoise from './AmbientNoise';
import Tone from 'tone';

export default class ToneController extends EventEmitter2 {
  constructor() {
    super({});

    console.log(Tone.now());

    this.beatNote = `C0`;
    this.seqEvents = [this.beatNote, 0, 0, this.beatNote, this.beatNote, 0];


    //NOTE: INSTEAD OF TONE.EVENT: MORE OF A DRUM TRACK THAN A BEAT
    this.seq = new Tone.Sequence(this._playNote, this.seqEvents, `6n`);
    this.seq.start();

    this.loop = new Tone.Loop(() => {
      this.emit(`tonecontrollernewhalfmeasure`, Tone.Transport.position);
    }, `2n`);
    this.loop.start();

    //this.createWind();
    this._createSynths();

    Tone.Transport.start();

    this.drumBeatRepresentationsList = document.querySelector(`.drum-beat-representations`);
    this.drumBeatRepresentationsList.addEventListener(`click`, e => this.handleOnDrumBeatRepresentationsListClick(e));
    this.drumBeatRepresentations = Array.from(document.querySelectorAll(`.drum-beat-representation`));
    this._setDrumBeatRepresentationssetInitialClasses();

    this.echoSynth = new Tone.AMSynth().toMaster();

    this._linkControls();

    this.createAmbientNoises(130.81, 146.83, 164.81, 174.61, 195.99, 220, 246.94);
  }

  _createSynths = () => {

    this.midiSynth = new Tone.PolySynth(4, Tone.DuoSynth).toMaster();
    this.midiSynth.set(
      {
        vibratoAmount: 0.2,
        vibratoRate: 1,
        harmonicity: 1.5,
        voice0: {
          volume: - 10,
          portamento: 0,
          oscillator: {
            type: `triangle`
          },
          filterEnvelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2
          },
          envelope: {
            attack: 0.01,
            decay: 0,
            sustain: 1,
            release: 0.2
          }
        },
        voice1: {
          volume: - 10,
          portamento: 0,
          oscillator: {
            type: `sawtooth`
          },
          filterEnvelope: {
            attack: 0.01,
            decay: 0,
            sustain: 1,
            release: 0.2
          },
          envelope: {
            attack: 0.01,
            decay: 0,
            sustain: 1,
            release: 0.2
          }
        }
      }
    );

    // TOMS AND KICK
    this.membraneSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 20,
      oscillator: {
        type: `triangle`,
        frequency: 60,
        detune: 0,
        phase: 0,
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 1.4,
        attackCurve: `exponential`,
        //releaseCurve: `exponential`
      }
    }).toMaster();

    // CYMBALS
    this.metalSynth = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 2,
        release: 0.2
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toMaster();

    this.metalSynth.volume.value = - 25;
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
    }

    this.membraneSynth.triggerAttackRelease(note, `2n`);
  }

  _linkControls = () => {
    this.$volumeRange = document.querySelector(`#sound-volume-range`);
    this.$volumeRange.addEventListener(`input`, ({currentTarget}) => this.handleVolumeRangeInput(parseInt(currentTarget.value, 10)));

    this.$autoRotateButton = document.querySelector(`.drum-beat-button`);
    this.$autoRotateButton.addEventListener(`click`, this.toggleBeat);
  }

  handleVolumeRangeInput = volume => {
    this.synth.volume.value = volume;
    this.membraneSynth.volume.value = volume - volume / 3;
  }

  toggleBeat = () => this.seq.loop = !this.seq.loop;
  // toggleBeat = () => this.beat.loop = !this.beat.loop;

  createWind = () => {
    //
    // initialize the noise and start
    // “pink”, “white”, and “brown”
    this.windNoise = new Tone.Noise(`brown`).start();
    this.windNoise.volume.value -= 14;

    //make an autofilter to shape the noise
    this.windNoiseAutoFilter = new Tone.AutoFilter({
      frequency: `8m`,
      type: `sine`,
      depth: 1,
      baseFrequency: 200,
      octaves: 2.6,
      min: 800,
      max: 900,
      filter: {
        type: `lowpass`,
        rolloff: - 12,
        Q: 1
      }
    }).connect(Tone.Master);

    //connect the noise
    this.windNoise.connect(this.windNoiseAutoFilter);
    //start the autofilter LFO
    this.windNoiseAutoFilter.start();
  }

  createAmbientNoises = (...frequencies) => {
    this.ambientNoises = frequencies.map(freq => this.ambientNoises = new AmbientNoise(freq));
    //this.echoSynth.triggerAttackRelease(frequency, `8n`, `+0.5`);
  }

  turnAmbientNoiseUp = frequency => {
    this.ambientNoise = this.ambientNoises.find(noise => noise.baseFrequency === frequency);
    console.log(this.ambientNoise);
    if (this.ambientNoise) this.ambientNoise.turnNoiseUp(1);
  }
}


    //NOTE: JS setInterval not so accurate, wich is important for Sound
    //Therefore on Tone.event emit  beat has been played for pulsating world
    //Instead of a setInterval in script.js wich triggers beat and pulsating world
    // this.beat = new Tone.Event((time, pitch) => {
    //   this.membraneSynth.triggerAttackRelease(pitch, `8n`, time);
    //   this.emit(`tonecontrollerbeatplayed`, pitch);
    // }, `C0`);
    //
    // this.beat.set({
    //   loop: true,
    //   loopEnd: `2n`
    // });
    //
    // this.beat.humanize = `64n`;
    //
    // this.beat.start(`1m`);



    // const keys = new Tone.Players({
    //   A: `./audio/casio/A1.[mp3|ogg]`,
    //   "C#": `./audio/casio/Cs2.[mp3|ogg]`,
    //   E: `./audio/casio/E2.[mp3|ogg]`,
    //   "F#": `./audio/casio/Fs2.[mp3|ogg]`,
    // }, {
    //   volume: - 10,
    //   fadeOut: `64n`,
    // }).toMaster();
    // //the notes
    // const noteNames = [`F#`, `E`, `C#`, `A`];
    // const loop = new Tone.Sequence(function(time, col) {
    //   const column = matrix1.matrix[col];
    //   for (let i = 0;i < 4;i ++) {
    //     if (column[i] === 1) {
    //       //slightly randomized velocities
    //       const vel = Math.random() * 0.5 + 0.5;
    //       keys.get(noteNames[i]).start(time, 0, `32n`, 0, vel);
    //     }
    //   }
    // }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], `16n`);
    // Tone.Transport.start();

    // Tone.Transport.schedule(time => {
    //   console.log(time);
    // }, `1m`);

    // const keys = new Tone.Players({
    //   A: `./audio/casio/A1.[mp3|ogg]`,
    //   "C#": `./audio/casio/Cs2.[mp3|ogg]`,
    //   E: `./audio/casio/E2.[mp3|ogg]`,
    //   "F#": `./audio/casio/Fs2.[mp3|ogg]`,
    // }, {
    //   volume: - 10,
    //   fadeOut: `64n`,
    // }).toMaster();
    //
    // const noteNames = [`F#`, `E`, `C#`, `A`];

    // CYMBALS
    /*const metalSynth = new Tone.MetalSynth({
      frequency  : 200 ,
      envelope  : {
      attack  : 0.001 ,
      decay  : 1.4 ,
      release  : 0.2
      }  ,
      harmonicity  : 5.1 ,
      modulationIndex  : 32 ,
      resonance  : 4000 ,
      octaves  : 1.5
    }).toMaster();*/
