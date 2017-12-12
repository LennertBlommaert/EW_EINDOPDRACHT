const Constants = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
  MIDI_KEY_UP_COMMAND: 8,
  MIDI_KEY_DOWN_COMMAND: 9,
  KEY_NOTE_FREQUENCY_OBJECTNAME: [
    {
      keyCode: 81,
      frequency: 130.81,
      note: 60,
      objectName: `Terrain`
    },
    {
      keyCode: 87,
      frequency: 146.83,
      note: 62,
      objectName: `Tree`
    },
    {
      keyCode: 65,
      frequency: 164.81,
      note: 60,
      objectName: `Cloud`
    },
    {
      keyCode: 90,
      frequency: 174.61,
      note: 62,
      objectName: `Rock`
    },
    {
      keyCode: 69,
      frequency: 195.99,
      note: 64,
      objectName: `Mushroom`
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
