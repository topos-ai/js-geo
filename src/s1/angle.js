const degree = Math.PI / 180

class Angle {
	constructor(radians) {
		this.Radians = radians
	}

	Degrees() {
		return this.Radians / degree
	}
}

export {Angle}
