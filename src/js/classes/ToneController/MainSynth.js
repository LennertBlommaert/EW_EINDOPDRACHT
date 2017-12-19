import Tone from 'tone';
import Constants from '../../objects/Constants';

export default class MainSynth extends Tone.PolySynth {
  constructor(volume = Constants.MAIN_SYNTH_VOLUME) {
    super(4, Tone.DuoSynth);
    this.volume.value = - volume;

    this.set(
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
  }
}
