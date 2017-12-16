import Key from './Key';

export default class VisualKeyBoardController {
  constructor(keys) {
    this.$keysContainer = document.querySelector(`.keys-container`);
    this.keys = [];
    keys.forEach(key => this.createKey(key));
  }

  createKey = key => {
    const newKey = new Key(key);
    this.keys.push(newKey);
    this.$keysContainer.appendChild(newKey.domElement);
  }

  toggleCurrentKeyActive = note => {
    this.currentKey = this.keys.find(key => key.note === note);
    if (this.currentKey) this.currentKey.toggleActive();
  };
}
