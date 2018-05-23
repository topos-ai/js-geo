const lookupBits = 4
const swapMask   = 0x01
const invertMask = 0x02
const maxLevel = 30
const degree = Math.PI / 180
const maxSize = 1 << maxLevel

const ntz8tab = new Uint8Array([
	0x08, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x05, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x06, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x05, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x07, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x05, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x06, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x05, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
	0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00,
])

const posToIJ = [
	[0, 1, 3, 2], // canonical order:    (0,0), (0,1), (1,1), (1,0)
	[0, 2, 3, 1], // axes swapped:       (0,0), (1,0), (1,1), (0,1)
	[3, 2, 0, 1], // bits inverted:      (1,1), (1,0), (0,0), (0,1)
	[3, 1, 0, 2], // swapped & inverted: (1,1), (0,1), (0,0), (1,0)
]

const posToOrientation = [swapMask, 0, 0, invertMask | swapMask]

const lookupIJ = new Uint16Array(1024)
const lookupPos = new Uint16Array(1024)

// initLookupCell initializes the lookupIJ table.
function initLookupCell(level, i, j, origOrientation, pos, orientation) {
	if (level === lookupBits) {
		const ij = (i << lookupBits) | j
		lookupPos[(ij<<2)+origOrientation] = (pos << 2) | orientation
		lookupIJ[(pos<<2)+origOrientation] = (ij << 2) | orientation
		return
	}

	level++
	i <<= 1
	j <<= 1
	pos <<= 2
	const r = posToIJ[orientation]
	initLookupCell(level, i+(r[0]>>1), j+(r[0]&1), origOrientation, pos, orientation^posToOrientation[0])
	initLookupCell(level, i+(r[1]>>1), j+(r[1]&1), origOrientation, pos+1, orientation^posToOrientation[1])
	initLookupCell(level, i+(r[2]>>1), j+(r[2]&1), origOrientation, pos+2, orientation^posToOrientation[2])
	initLookupCell(level, i+(r[3]>>1), j+(r[3]&1), origOrientation, pos+3, orientation^posToOrientation[3])
}

initLookupCell(0, 0, 0, 0, 0, 0)
initLookupCell(0, 0, 0, swapMask, 0, swapMask)
initLookupCell(0, 0, 0, invertMask, 0, invertMask)
initLookupCell(0, 0, 0, swapMask|invertMask, 0, swapMask|invertMask)


class CellID {
	constructor(token) {
		this.bytes = new Uint8Array((token.length+1)>>1)
		for (let i in token) {
			this.bytes[i>>1] |= parseInt(token[i], 16)<<((i&1^1)<<2)
		}
	}

	lastByte() {
		return this.bytes[this.bytes.length-1]
	}

	lsb() {
		const lastByte = this.lastByte()
		return lastByte & -lastByte
	}

	level() {
		return 30 - ((64 - (this.bytes.length<<3) + ntz8tab[this.lastByte()])>>1)
	}

	face() {
		return this.bytes[0]>>5
	}

	faceIJOrientation() {
		const f = this.face()
		var orientation = f & swapMask

		var i = 0
		var j = 0

		for (var index = 0; index <= this.bytes.length; index++) {

			if (index === 0) {

				// Handle the face bits.
				orientation += ((this.bytes[0] >> 1) & 15) << 2
			} else {

				// Get the last bit of the previous byte.
				var byte = (this.bytes[index-1] & 1) << 7
				if (index < this.bytes.length) {
					byte |= this.bytes[index] >> 1
				}

				orientation += byte << 2
			}

			// Get the iiiijjjjoo value from the lookup.
			orientation = lookupIJ[orientation]

			const position = (7 - index) << 2

			// Isolate the top 4 bits of the lookup value, iiii, and move those bits to their position in the i accumulator.
			i |= (orientation >> 6) << position

			// Isolate the next 4 bits of the lookup value, jjjj, and move those bits to their position in the j accumulator.
			j |= ((orientation >> 2) & 15) << position

			orientation &= 3
		}


		const lsb = this.lsb()
		if (this.bytes.length == 8) {
			if ((lsb & 16) !== 0) {
				orientation ^= swapMask
			}
		} else {
			if ((lsb & 17) !== 0) {
				orientation ^= swapMask
			}
		}

		return [f, i, j, orientation]
	}
}

function stToUV(s) {
	if (s >= 0.5) {
		return (1 / 3) * (4*s*s - 1)
	}

	return (1 / 3) * (1 - 4*(1-s)*(1-s))
}

function ijToSTMin(i) {
	return i / maxSize
}

function sizeIJ(level) {
	return 1 << (maxLevel-level)
}

class r2Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

class r2Rect {
	constructor(lo, hi) {
		this.lo = lo
		this.hi = hi
	}

	vertex(k) {
		switch (k%4) {
		case 0:
			return new r2Point(this.lo.x, this.lo.y)
		case 1:
			return new r2Point(this.hi.x, this.lo.y)
		case 2:
			return new r2Point(this.hi.x, this.hi.y)
		case 3:
			return new r2Point(this.lo.x, this.hi.y)
		}
	}
}

function ijLevelToBoundUV(i, j, level) {
	const cellSize = sizeIJ(level)
	const xLo = i & -cellSize
	const yLo = j & -cellSize

	return new r2Rect(
		new r2Point(stToUV(ijToSTMin(xLo)), stToUV(ijToSTMin(yLo))),
		new r2Point(stToUV(ijToSTMin(xLo + cellSize)), stToUV(ijToSTMin(yLo + cellSize)))
	)
}

class r3Vector {
	constructor(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
	}

	dot(ov) {
		return this.x*ov.x + this.y*ov.y + this.z*ov.z
	}

	// Norm2 returns the square of the norm.
	norm2(){
		return this.dot(this)
	}

	mul(m) {
		return new r3Vector(this.x*m, this.y*m, this.z*m)
	}

	normalize() {
		const n2 = this.norm2()
		if (n2 == 0) {
			return r3Vector(0, 0, 0)
		}

		return this.mul(1 / Math.sqrt(n2))
	}
}

function faceUVToXYZ(face, u, v) {
	switch (face) {
	case 0:
		return new r3Vector(1, u, v)
	case 1:
		return new r3Vector(-u, 1, v)
	case 2:
		return new r3Vector(-u, -v, 1)
	case 3:
		return new r3Vector(-1, -v, -u)
	case 4:
		return new r3Vector(v, -1, -u)
	default:
		return new r3Vector(v, u, -1)
	}
}

class s1Angle {
	constructor(radians) {
		this.radians = radians
	}

	degrees() {
		return this.radians / degree
	}
}

function latitude(p) {
	return new s1Angle(Math.atan2(p.vector.z, Math.sqrt(p.vector.x*p.vector.x+p.vector.y*p.vector.y)))
}

function longitude(p)  {
	return new s1Angle(Math.atan2(p.vector.y, p.vector.x))
}

class LatLng {
	constructor(point) {
		this.latitude = latitude(point)
		this.longitude = longitude(point)
	}
}

class Point {
	constructor(vector) {
		this.vector = vector
	}
}

class Cell {
	constructor(id) {
		this.id = id
		const [f, i, j, o] = id.faceIJOrientation()
		this.face = f
		this.level = id.level()
		this.orientation = o
		this.uv = ijLevelToBoundUV(i, j, this.level)
	}

	vertex(k) {
		return new Point(faceUVToXYZ(this.face, this.uv.vertex(k).x, this.uv.vertex(k).y).normalize())
	}
}

const exported = {
	Cell,
	CellID,
	LatLng,
	Point,
}

export default exported
