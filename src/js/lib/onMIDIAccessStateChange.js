const onMIDIAccessStateChange = e => console.log(e.port.name, e.port.manufacturer, e.port.state);

export default onMIDIAccessStateChange;
