//@module
var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Analog", 
				name : "Analog Input", 
				iconVariant : PinsSimulators.SENSOR_SLIDER 
			},
			axes : [
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Value",
						valueID : "analogValue",
						speed : 0.5,
						defaultControl : PinsSimulators.SLIDER
					}
				),
			]
		});
}

var close = exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

var read = exports.read = function() {
	var axes = this.pinsSimulator.delegate("getValue");
		return axes.analogValue;
}

exports.pins = {
			analog: { type: "A2D" }
		};