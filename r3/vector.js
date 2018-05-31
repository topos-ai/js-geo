class Vector {
	constructor(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
	}

	dot(ov) {
		return this.x*ov.x + this.y*ov.y + this.z*ov.z
	}

	norm2(){
		return this.dot(this)
	}

	mul(m) {
		return new Vector(this.x*m, this.y*m, this.z*m)
	}

	normalize() {
		const n2 = this.norm2()
		if (n2 == 0) {
			return new Vector(0, 0, 0)
		}

		return this.mul(1 / Math.sqrt(n2))
	}
}

const exported = {
	Vector,
}

export default exported
