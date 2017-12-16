import Tone from 'tone';
import Constants from '../objects/Constants';

export default class AmbientNoise {
  constructor(baseFrequency = Constants.AMBIENT_NOISE_BASE_FREQUENCY, volume = Constants.AMBIENT_NOISE_VOLUME, type = Constants.AMBIENT_NOISE_TYPE) {
    this.noise = new Tone.Noise(type).start();
    this.noise.volume.value = - volume;
    this.baseFrequency = baseFrequency;

    //make an autofilter to shape the noise
    this.autoFilter = new Tone.AutoFilter({
      frequency: `4m`,
      type: `sine`,
      depth: 1,
      baseFrequency: this.baseFrequency,
      octaves: 2.6,
      min: 800,
      max: 900,
      filter: {
        type: `lowpass`,
        rolloff: - 12,
        Q: 1
      }
    });

    //connect the noise
    this.noise.connect(this.autoFilter);
    //start the autofilter LFO
    this.autoFilter.start();
  }

  turnNoiseUp = (val = 1) => {
    if (this.noise.volume.value < 0) this.noise.volume.value += val;
  }
}
