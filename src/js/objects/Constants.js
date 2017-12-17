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
  CAMERA_POSITION: {x: 0, y: 20, z: 500},

  CONTROLS_MAX_POLAR_ANGLE: Math.PI * 0.47, //Math.PI to 0
  CONTROLS_MAX_DISTANCE: 1200,
  CONTROLS_MIN_DISTANCE: 100,
  //CONTROLS_AUTROTATE_SPEED: 5,

  PARTICLES_AMOUNT: 500,
  PARTICLES_SPREAD: 1500,

  WORLD_ELEMENT_POSITION_SPREAD: 1000,

  //TONE
  BEAT_NOTE: `C0`,
  AMBIENT_NOISE_BASE_FREQUENCY: 200,
  AMBIENT_NOISE_VOLUME: 14,
  AMBIENT_NOISE_TYPE: `brown`,
  BPM: 120,
  BPM_MIN: 80,
  BPM_MAX: 160,
  MASTER_VOLUME_MIN: - 15,
  MASTER_VOLUME_MAX: 15,

  //MIDI
  MIDI_KEY_UP_COMMAND: 8,
  MIDI_KEY_DOWN_COMMAND: 9,
  //GLOBAL
  GAME_MODUS_ACTIVATED: false,
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
  KEYS: [
    //STANDARD KEYS
    {
      key: `Q`,
      keyCode: 81,
      frequency: 130.81,
      note: 0,
      type: `white`,
      objectName: `Terrain`
    },
    // {
    //   key: `A`,
    //   keyCode: 65,
    //   frequency: 130.81,
    //   note: 0,
    //   objectName: `Terrain`
    // },
    {
      key: `2`,
      keyCode: 50,
      frequency: 138.59,
      type: `black`,
      note: 1
    },
    {
      key: `W`,
      keyCode: 87,
      frequency: 146.83,
      note: 2,
      type: `white`,
      objectName: `Tree`
    },
    // {
    //   key: `Z`,
    //   keyCode: 90,
    //   frequency: 146.83,
    //   note: 2,
    //   objectName: `Tree`
    // },
    {
      key: `3`,
      keyCode: 51,
      frequency: 155.56,
      type: `black`,
      note: 3
    },
    {
      key: `E`,
      keyCode: 69,
      frequency: 164.81,
      note: 4,
      type: `white`,
      objectName: `Cloud`
    },
    {
      key: `R`,
      keyCode: 82,
      frequency: 174.61,
      note: 5,
      type: `white`,
      objectName: `Rock`
    },
    {
      key: `5`,
      keyCode: 53,
      frequency: 185,
      type: `black`,
      note: 6
    },
    {
      key: `T`,
      keyCode: 84,
      frequency: 195.99,
      note: 7,
      type: `white`,
      objectName: `Mushroom`
    },
    {
      key: `6`,
      keyCode: 54,
      frequency: 207.65,
      type: `black`,
      note: 8
    },
    {
      key: `Y`,
      keyCode: 89,
      frequency: 220,
      note: 9,
      type: `white`,
      objectName: `Evergreen`
    },
    {
      key: `7`,
      keyCode: 55,
      frequency: 233.08,
      type: `black`,
      note: 10
    },
    {
      key: `U`,
      keyCode: 85,
      frequency: 246.94,
      note: 11,
      type: `white`,
      objectName: `Flower`
    },
    {
      key: `I`,
      keyCode: 73,
      frequency: 261.62,
      type: `white`,
      note: 12
    },
    //EXTRA KEYS
  ],
};

export default Constants;
