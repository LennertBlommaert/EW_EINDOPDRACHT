import InfoMessage from './InfoMessage';
import EventEmitter2 from '../../vendors/eventemitter2';

/*
  A controller which controls the sequencially displaying of info messages
  One at a certain time
*/

export default class InfoMessageController extends EventEmitter2 {
  constructor(domElement) {

    super();

    this.domElement = domElement;

    this.messagesIndex = 0;
    //
    // this.messages = [
    //   new InfoMessage(`Move your mouse whilst playing`, 10000, 6000),
    //   new InfoMessage(`Why don't you test the arrow keys out?`, 10000, 6000),
    //   new InfoMessage(`Go on and hold <shift> while moving the mouse`, 10000, 6000),
    //   new InfoMessage(`Try holding <ctrl> while moving the mouse`, 10000, 6000),
    //   new InfoMessage(`Why don't you try to play a few minor chords?`, 10000, 6000),
    //   new InfoMessage(`Do you know some major chords?`, 10000, 6000),
    // ];
    //
    // this.messages = [
    //   new InfoMessage(`Moving the mouse changes the sound effects influence`, 10000, 6000),
    //   new InfoMessage(`Using the arrow keys changes the type of sound effects`, 10000, 6000),
    //   new InfoMessage(`Holding <shift> and moving the mouse changes the world volume and speed`, 10000, 6000),
    //   new InfoMessage(`Holding <ctrl> and moving the mouse changes the worlds light`, 10000, 6000),
    //   new InfoMessage(`Why don't you try to play a few minor chords?`, 10000, 6000),
    //   new InfoMessage(`Do you know some major chords?`, 10000, 6000),
    // ];

    this.messages = [
      new InfoMessage(`Moving the mouse changes the sound effects influence`, 100, 6000),
    ];

    this.timer = window.setTimeout(() => this.showInfoMessage(), this.messages[this.messagesIndex].displayAfter);
  }

  showInfoMessage() {
    this.domElement.textContent = this.messages[this.messagesIndex].content;
    this.toggleDomElementClasses();
    this.timer = window.setTimeout(() => this.hideInfoMessage(), this.messages[this.messagesIndex].displayTime);
  }

  hideInfoMessage() {
    this.toggleDomElementClasses();
    if (this.messagesIndex < this.messages.length - 1) {
      this.messagesIndex ++;
      this.timer = window.setTimeout(() => this.showInfoMessage(), this.messages[this.messagesIndex].displayTime);
    } else {
      this.timer = window.setTimeout(() => this.emit(`infoMessageControllerOnLastMessage`, {}), this.messages[this.messagesIndex].displayTime);
    }
  }

  toggleDomElementClasses() {
    this.domElement.classList.toggle(`active`);
  }

}
