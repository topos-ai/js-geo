class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

class Rect {
	constructor(lo, hi) {
		this.lo = lo
		this.hi = hi
	}

	vertex(k) {
		switch (k&3) {
		case 0:
			return new Point(this.lo.x, this.lo.y)
		case 1:
			return new Point(this.hi.x, this.lo.y)
		case 2:
			return new Point(this.hi.x, this.hi.y)
		default:
			return new Point(this.lo.x, this.hi.y)
		}
	}
}

const exported = {
	Point,
	Rect,
}

export default exported
