const degree = Math.PI / 180

class Angle {
	constructor(radians) {
		this.radians = radians
	}

	degrees() {
		return this.radians / degree
	}
}

const exported = {
	Angle,
}

export default exported
