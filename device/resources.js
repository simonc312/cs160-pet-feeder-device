//@module
exports.pins = {
	water: { type: "A2D" },
	hay: { type: "A2D" },
	lettuce: { type: "A2D" }
};

exports.configure = function() {
    this.water.init();
    this.hay.init();
    this.lettuce.init();
}

exports.read = function() {
    return {  water: this.water.read(), lettuce: this.lettuce.read(), hay: this.hay.read() };
}

exports.close = function() {
	this.water.close();
	this.hay.close();
	this.lettuce.close();
}