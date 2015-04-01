//@module
exports.pins = {
	status: { type: "A2D" }
};

exports.configure = function() {
    this.status.init();
}

exports.read = function() {
    return this.status.read();
}

exports.close = function() {
	this.status.close();
}