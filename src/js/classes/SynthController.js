import Tone from 'tone';

export default class SynthController {
  constructor() {
    this.distortion = new Tone.Distortion(0.2).toMaster();
    this.synth = new Tone.PolySynth(4, Tone.MonoSynth).connect(this.distortion);

    this.$volumeRange = document.querySelector(`#synth-volume-range`);
    this.$volumeRange.addEventListener(`input`, ({currentTarget}) => this.handleVolumeRangeInput(parseInt(currentTarget.value, 10)));
  }

  handleVolumeRangeInput = volume => this.synth.volume.value = volume;
}
