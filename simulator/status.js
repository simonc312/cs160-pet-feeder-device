//@module
var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Status", 
				name : "Status Input", 
				iconVariant : PinsSimulators.SENSOR_BUTTON 
			},
			axes : [
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Value",
						valueID : "statusValue",
						dataType: 'boolean',
						defaultControl : PinsSimulators.BUTTON
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
		return axes.statusValue;
}

exports.pins = {
			status: { type: "A2D" }
		};