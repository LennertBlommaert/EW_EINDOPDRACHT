// //QUESTION overkill in onze toepassing?
//
// import EventEmitter2 from '../vendors/eventemitter2';
// import Constants from '../objects/Constants';
//
// export default class Keyboard {
//   constructor() {
//     window.addEventListener(`keydown`, event => this.handleKeyDown(event));
//     window.addEventListener(`keyup`, event => this.handleKeyUp(event));
//     // Keyboard.Q = 81;
//     // Keyboard.W = 87;
//     // Keyboard.E = 69;
//     // Keyboard.R = 82;
//     // Keyboard.T = 84;
//     // Keyboard.Y = 89;
//     // Keyboard.U = 85;
//     // Keyboard.I = 73;
//     // // Keyboard.A = 65;
//     // // Keyboard.Z = 90;
//   }
//   handleKeyDown({keyCode}) {
//   }
//
//   handleKeyUp({keyCode}) {
//     this.keys.filter(key => key !== keyCode);
//     console.log(this.keys);
//   }
//
//   getData(keyCode) {
//     return Constants.KEY_NOTE_FREQ(d => d.keyCode === keyCode);
//   }
// }
