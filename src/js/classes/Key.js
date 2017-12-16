import EventEmitter2 from '../vendors/eventemitter2';

export default class Key extends EventEmitter2 {
  constructor(key) {
    super({});
    this.keyData = key;
    this.createDomElement();
  }

  createDomElement = () => {
    this.domElement = document.createElement(`div`);
    this.domElement.classList.add(`key`);
    this.domElement.textContent = this.keyData.key;
    this.domElement.addEventListener(`mousedown`, () => this.handleDomElementMouseDown());
    this.domElement.addEventListener(`mouseup`, () => this.handleDomElementMouseUp());
  }

  handleDomElementMouseDown = () => {
    this.emit(`keyboardVisualisationKeyOnMouseDown`, this.keyData);
    this.domElement.classList.add(`active`);
  }

  handleDomElementMouseUp = () => {
    this.emit(`keyboardVisualisationKeyOnMouseUp`, this.keyData);
    this.domElement.classList.remove(`active`);
  }
}
