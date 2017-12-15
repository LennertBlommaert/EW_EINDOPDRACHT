const Constants = {
  //THREE
  SCENE_FOG_NEAR: 300,
  SCENE_FOG_FAR: 950,

  SCENE_SHRINK_CHILDREN_INTERVAL: 3000,

  SCENE_SHADOWLIGHT_INTENSITY: 0.9,

  SCENE_TERRIAN_DIMENSION: 2200,
  SCENE_TERRIAN_XSEGMENTS: 100,
  SCENE_TERRIAN_YSEGMENTS: 100,

  CAMERA_POINTLIGHT_INTENSITY_CHANGE: 0.1,
  CAMERA_ASPECTRATIO: 1,
  CAMERA_FIELD_OF_VIEW: 100,
  CAMERA_NEAR: 1,
  CAMERA_FAR: 2000,
  CAMERA_POSITION: {x: 0, y: 100, z: 0},

  CONTROLS_AUTROTATE_SPEED: 10,

  PARTICLES_AMOUNT: 500,
  PARTICLES_SPREAD: 1500,

  //TONE
  BEAT_NOTE: `C0`,
  AMBIENT_NOISE_BASE_FREQUENCY: 200,
  AMBIENT_NOISE_VOLUME: 14,
  AMBIENT_NOISE_TYPE: `brown`,

  //MIDI
  MIDI_KEY_UP_COMMAND: 8,
  MIDI_KEY_DOWN_COMMAND: 9,
  //GLOBAL
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
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
