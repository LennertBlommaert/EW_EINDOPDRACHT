import Tone from 'tone';

const createSynth = () => {

  // const fmSynth = new Tone.FMSynth({
  //   modulationIndex: 12.22,
  //   envelope: {
  //     attack: 0.01,
  //     decay: 0.2
  //   },
  //   modulation: {
  //     type: `square`
  //   },
  //   modulationEnvelope: {
  //     attack: 0.2,
  //     decay: 0.01
  //   }
  // }).toMaster();

  //return fmSynth;

  //to make a 4 voice MonoSynth
  //https://github.com/Tonejs/Tone.js/wiki/Instruments#polyphony-with-tonepolysynth
  //https://github.com/Tonejs/Tone.js/wiki/Effects
  const distortion = new Tone.Distortion(0.2).toMaster();
  const polySynth = new Tone.PolySynth(4, Tone.MonoSynth).connect(distortion);


  return polySynth.connect(distortion);
};

export default createSynth;
