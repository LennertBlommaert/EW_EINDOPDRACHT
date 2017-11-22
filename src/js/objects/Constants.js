const Constants = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
  MIDI_KEY_UP_COMMAND: 8,
  MIDI_KEY_DOWN_COMMAND: 9,
  //UNUSED - KEYS INCORRECT TOO
  KEY_TO_FREQ: [
    {
      key: `Q`,
      keyCode: 81,
      freq: 261.63
    },
    {
      key: `W`,
      keyCode: 87,
      freq: 293.66
    },
    {
      key: `E`,
      keyCode: 69,
      freq: 329.63
    },
    {
      key: `R`,
      keyCode: 82,
      freq: 349.23
    },
    {
      key: `T`,
      keyCode: 84,
      freq: 392.00
    },
    {
      key: `U`,
      keyCode: 89,
      freq: 440.00
    },
    {
      key: `I`,
      keyCode: 85,
      freq: 493.88
    },
    {
      key: `O`,
      keyCode: 73,
      freq: 523.25
    },
  ],
  KEY_NOTE_FREQUENCY: [
    {
      keyCode: 81,
      frequency: 261.63,
      note: 60
    },
    {
      keyCode: 87,
      frequency: 293.66,
      note: 62
    },
    {
      keyCode: 65,
      frequency: 261.63,
      note: 60
    },
    {
      keyCode: 90,
      frequency: 293.66,
      note: 62
    },
    {
      keyCode: 69,
      frequency: 329.63,
      note: 64
    },
    {
      keyCode: 82,
      frequency: 349.23,
      note: 65
    },
    {
      keyCode: 84,
      frequency: 392.00,
      note: 67
    },
    {
      keyCode: 89,
      frequency: 440.00,
      note: 69
    },
    {
      keyCode: 85,
      frequency: 493.88,
      note: 71
    },
    {
      keyCode: 73,
      frequency: 523.25,
      note: 72
    },
  ],
};

export default Constants;
