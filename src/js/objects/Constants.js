const Constants = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
  MIDI_KEY_UP_COMMAND: 8,
  MIDI_KEY_DOWN_COMMAND: 9,
  //UNUSED - KEYS INCORRECT TOO
  KEY_TO_FREQ: [
    {
      key: `Q`,
      keyCode: 48,
      freq: 130.81
    },
    {
      key: `W`,
      keyCode: 50,
      freq: 146.83
    },
    {
      key: `E`,
      keyCode: 52,
      freq: 164.81
    },
    {
      key: `R`,
      keyCode: 53,
      freq: 174.61
    },
    {
      key: `T`,
      keyCode: 55,
      freq: 195.99
    },
    {
      key: `U`,
      keyCode: 57,
      freq: 220.00
    },
    {
      key: `I`,
      keyCode: 59,
      freq: 246.94
    },
    {
      key: `O`,
      keyCode: 60,
      freq: 261.62
    },
  ],
  KEY_NOTE_FREQUENCY: [
    {
      keyCode: 81,
      frequency: 130.81,
      note: 60
    },
    {
      keyCode: 87,
      frequency: 146.83,
      note: 62
    },
    {
      keyCode: 65,
      frequency: 164.81,
      note: 60
    },
    {
      keyCode: 90,
      frequency: 174.61,
      note: 62
    },
    {
      keyCode: 69,
      frequency: 195.99,
      note: 64
    },
    {
      keyCode: 82,
      frequency: 220.00,
      note: 65
    },
    {
      keyCode: 84,
      frequency: 246.94,
      note: 67
    },
    {
      keyCode: 89,
      frequency: 261.62,
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
