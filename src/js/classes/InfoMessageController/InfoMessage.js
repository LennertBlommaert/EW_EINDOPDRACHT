export default class InfoMessage {
  constructor(content = `This is an info message`, displayAfter = 1000, displayTime = 1000) {
    this.content = content;
    this.displayAfter = displayAfter;
    this.displayTime = displayTime;
  }
}
