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
						valueLabel : "Water Bottle Level",
						valueID : "water",
						speed : 0.5,
						defaultControl : PinsSimulators.SLIDER
					}
				),
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Pellet Count",
						valueID : "pellet",
						speed : 0.5,
						defaultControl : PinsSimulators.SLIDER
					}
				),
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Lettuce Count",
						valueID : "lettuce",
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
		return axes;
}

exports.pins = {
	water: { type: "A2D" },
	pellet: { type: "A2D" },
	lettuce: { type: "A2D" }
		};