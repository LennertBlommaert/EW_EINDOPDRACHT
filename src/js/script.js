//import parseMidiMessage from './lib/parseMidiMessage';

import getMIDIInputValues from './lib/getMIDIInputValues';
import parseMIDIMessageData from './lib/parseMIDIMessageData';
import onMIDIFailure from './lib/onMIDIFailure';
import onMIDIAccessStateChange from './lib/onMIDIAccessStateChange';

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

  console.log();

  MIDIInputValues.forEach(inputValue => {
    inputValue.onmidimessage = onMIDIMessage;
  });

  MIDIAccess.onstatechange = e => onMIDIAccessStateChange(e);
};

const onMIDIMessage = ({data: MIDIData} = [0, 0, 0]) => {
  const parsedMIDIData = parseMIDIMessageData(MIDIData);
  console.log(parsedMIDIData);
  //generateNoteOnParsedMIDIData(parsedMIDIData);
};

const init = () => {

  getMIDIAccess();

  console.log(`ello`);

};

init();
