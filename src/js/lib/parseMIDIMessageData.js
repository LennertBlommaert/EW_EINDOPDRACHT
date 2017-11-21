import frequencyFromNoteNumber from './frequencyFromNoteNumber';

const parseMIDIMessageData = data => {
  return {
    command: data[0] >> 4,
    channel: data[0] & 0xf,
    note: data[1],
    velocity: data[2] / 127,
    frequency: frequencyFromNoteNumber(data[1])
  };
};

export default parseMIDIMessageData;
