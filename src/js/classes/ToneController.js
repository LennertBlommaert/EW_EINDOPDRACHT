import Tone from 'tone';

export default class ToneController {
  constructor() {

    this.distortion = new Tone.Distortion(0.2).toMaster();
    this.synth = new Tone.PolySynth(4, Tone.FMSynth).toMaster();

    // TOMS AND KICK
    this.membraneSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 20,
      oscillator: {
        type: `triangle`,
        frequency: 110,
        detune: 0,
        phase: 0,
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 1,
        attackCurve: `exponential`,
        //releaseCurve: `exponential`
      }
    }).toMaster();

    // CYMBALS
    // this.metalSynth = new Tone.MetalSynth({
    //   frequency: 200,
    //   envelope: {
    //     attack: 0.001,
    //     decay: 1.4,
    //     release: 0.2
    //   },
    //   harmonicity: 5.1,
    //   modulationIndex: 32,
    //   resonance: 4000,
    //   octaves: 1.5
    // }).toMaster();

    const seq = new Tone.Sequence((time, note) => {
      this.membraneSynth.triggerAttackRelease(note, `2n`);
      //const vel = Math.random() * 0.5 + 0.5;
      //metalSynth.triggerAttack(vel);
    }, [`C0`, 0, 0, `C0`, `C0`, 0], `8n`);
    seq.start(`1m`);


    Tone.Transport.start();

    this.$volumeRange = document.querySelector(`#sound-volume-range`);
    this.$volumeRange.addEventListener(`input`, ({currentTarget}) => this.handleVolumeRangeInput(parseInt(currentTarget.value, 10)));
  }

  handleVolumeRangeInput = volume => {
    this.synth.volume.value = volume;
    this.membraneSynth.volume.value = volume - volume / 3;
  }
}


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
