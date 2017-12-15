import Tone from 'tone';

export default class BeatSynth extends Tone.MembraneSynth {
  constructor() {
    super({
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
  }
}
