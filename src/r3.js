export class Vector {
	constructor(x, y, z) {
		this.X = x
		this.Y = y
		this.Z = z
	}

	Dot(ov) {
		return this.X*ov.X + this.Y*ov.Y + this.Z*ov.Z
	}

	Norm2(){
		return this.Dot(this)
	}

	Mul(m) {
		return new Vector(this.X*m, this.Y*m, this.Z*m)
	}

	Normalize() {
		const n2 = this.Norm2()
		if (n2 == 0) {
			return new Vector(0, 0, 0)
		}

		return this.Mul(1 / Math.sqrt(n2))
	}
}
