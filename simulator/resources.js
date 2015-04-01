//@module
var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Resources", 
				name : "3 Available Resource Sensors", 
				iconVariant : PinsSimulators.SENSOR_MODULE 
			},
			axes : [
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Water",
						valueID : "water",
						speed : 0.5,
						defaultControl : PinsSimulators.SLIDER,
						maxValue: 1000
					}
				),
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Lettuce",
						valueID : "lettuce",
						speed : 0.5,
						defaultControl : PinsSimulators.SLIDER,
						maxValue: 2
					}
				),
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Hay",
						valueID : "hay",
						speed : 0.5,
						defaultControl : PinsSimulators.SLIDER,
						maxValue: 5
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
		return axes;
}

exports.pins = {
	water: { type: "A2D" },
	hay: { type: "A2D" },
	lettuce: { type: "A2D" }
		};