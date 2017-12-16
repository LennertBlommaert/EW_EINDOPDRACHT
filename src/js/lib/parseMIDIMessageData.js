import frequencyFromNoteNumber from './frequencyFromNoteNumber';

//Note is a MIDI note (not the same as a normal music note)
const parseMIDIMessageData = data => {
  return {
    command: data[0] >> 4,
    channel: data[0] & 0xf,
    note: data[1] % 12,
    velocity: data[2] / 127,
    frequency: frequencyFromNoteNumber(data[1])
  };
};

export default parseMIDIMessageData;
