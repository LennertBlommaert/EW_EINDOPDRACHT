export default class ShortcutVisualisation {
  constructor(domElement) {

    this.domElement = domElement;
    this.domElement.x = this.domElement.querySelector(`.x`);
    this.domElement.y = this.domElement.querySelector(`.y`);
    this.timer;
  }

  update({nameX = `x`, valueX = 0}, {nameY = `y`, valueY = 0}) {

    window.clearTimeout(this.timer);

    this.domElement.classList.add(`active`);

    this.domElement.x.textContent = `${nameX}: ${valueX.toFixed(2) * 100}%`;
    this.domElement.y.textContent = `${nameY}: ${valueY.toFixed(2) * 100}%`;

    // const timer = window.setTimeout(this.domElement.classList.remove(`active`), 1000);
    this.timer = window.setTimeout(() => this.domElement.classList.remove(`active`), 2000);
  }

  reposition = (x, y) => this.domElement.style.transform = `translate(${x}px, ${y}px)`;
}
