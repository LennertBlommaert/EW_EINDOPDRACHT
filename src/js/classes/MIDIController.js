import EventEmitter2 from '../vendors/eventemitter2';
import parseMIDIMessageData from '../lib/parseMIDIMessageData';

export default class MIDIController extends EventEmitter2 {
  constructor(MIDIAccess) {
    super({});

    this.MIDIAccess = MIDIAccess;

    this.MIDIInputValues = Array.from(MIDIAccess.inputs.values());

    //SCOPE THIS Error
    this.MIDIInputValues.forEach(val => val.onmidimessage = MIDIData => this.handleMIDIMessage(MIDIData));
    // this.MIDIInputValues.forEach(val => val.onmidimessage = MIDIData => this.emit(`midicontrollerkeyup`, parseMIDIMessageData(MIDIData)));

    this.KEY_UP_COMMAND = 8;
    this.KEY_DOWN_COMMAND = 9;
  }

  /*
    METHODS
  */

  // EVENT HANDLING
  handleMIDIMessage({data: MIDIData} = [0, 0, 0]) {
    const parsedMIDIData = parseMIDIMessageData(MIDIData);

    if (parsedMIDIData.command === this.KEY_UP_COMMAND) {
      this.emit(`midicontrollerkeyup`, parsedMIDIData);
    } else {
      this.emit(`midicontrollerkeydown`, parsedMIDIData);
    }
  }
}
