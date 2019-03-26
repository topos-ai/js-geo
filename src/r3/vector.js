const Axis = Object.freeze({
	X: 0,
	Y: 1,
	Z: 2
})

class Vector {
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

	Abs() {
		return new Vector(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z))
	}

	Add(ov) {
		return new Vector(this.X + ov.X, this.Y + ov.Y, this.Z + ov.Z)
	}

	LargestComponent() {
		const t = this.Abs()
		if (t.X > t.Y) {
			if (t.X > t.Z) {
				return Axis.X
			}

			return Axis.Z
		}

		if (t.Y > t.Z) {
			return Axis.Y
		}

		return Axis.Z
	}
}

export {Axis, Vector}
