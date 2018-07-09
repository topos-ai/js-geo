const degree = Math.PI / 180

export class Angle {
	constructor(radians) {
		this.Radians = radians
	}

	Degrees() {
		return this.Radians / degree
	}
}
