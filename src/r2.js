export class Point {
	constructor(x, y) {
		this.X = x
		this.Y = y
	}
}

export class Rect {
	constructor(lo, hi) {
		this.lo = lo
		this.hi = hi
	}

	Vertex(k) {
		switch (k&3) {
		case 0:
			return new Point(this.lo.X, this.lo.Y)
		case 1:
			return new Point(this.hi.X, this.lo.Y)
		case 2:
			return new Point(this.hi.X, this.hi.Y)
		default:
			return new Point(this.lo.X, this.hi.Y)
		}
	}
}
