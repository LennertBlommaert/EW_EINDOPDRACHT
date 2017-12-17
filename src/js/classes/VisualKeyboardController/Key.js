import EventEmitter2 from '../../vendors/eventemitter2';

export default class Key extends EventEmitter2 {
  constructor({note, frequency, key}) {
    super({});
    //console.log(key);
    this.note = note;
    this.frequency = frequency;
    this.key = key;
    this.createDomElement();
  }

  createDomElement = () => {
    this.domElement = document.createElement(`div`);
    this.domElement.classList.add(`key`);
    this.domElement.textContent = this.key;
    this.domElement.addEventListener(`mousedown`, () => this.handleDomElementMouseDown());
    this.domElement.addEventListener(`mouseup`, () => this.handleDomElementMouseUp());
  }

  handleDomElementMouseDown = () => this.emit(`keyboardVisualisationKeyOnMouseDown`, {note: this.note, frequency: this.frequency});

  handleDomElementMouseUp = () => this.emit(`keyboardVisualisationKeyOnMouseUp`, {note: this.note, frequency: this.frequency});

  toggleActive = () => {
    this.domElement.classList.toggle(`active`);
  }
}
