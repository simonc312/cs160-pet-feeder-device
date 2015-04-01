//@module
exports.pins = {
	water: { type: "A2D" },
	pellet: { type: "A2D" },
	lettuce: { type: "A2D" }
};

exports.configure = function() {
    this.water.init();
    this.pellet.init();
    this.lettuce.init();
}

exports.read = function() {
    return {  water: this.water.read(), pellet: this.pellet.read(), lettuce: this.lettuce.read() };
}

exports.close = function() {
	this.water.close();
	this.pellet.close();
	this.lettuce.close();
}