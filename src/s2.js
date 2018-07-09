import * as bits from './bits'
import * as r2 from './r2'
import * as r3 from './r3'
import * as s1 from './s1'

const maxLevel = 30
const maxSize = 1 << maxLevel

const posToIJ = [
	[0, 1, 3, 2], // canonical order:    (0,0), (0,1), (1,1), (1,0)
	[0, 2, 3, 1], // axes swapped:       (0,0), (1,0), (1,1), (0,1)
	[3, 2, 0, 1], // bits inverted:      (1,1), (1,0), (0,0), (0,1)
	[3, 1, 0, 2], // swapped & inverted: (1,1), (0,1), (0,0), (1,0)
]

const swapMask   = 0x01
const invertMask = 0x02
const posToOrientation = [swapMask, 0, 0, invertMask | swapMask]

const lookupBits = 4
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

const hex8tab = [
	'00',
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
	'09',
	'0a',
	'0b',
	'0c',
	'0d',
	'0e',
	'0f',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'1a',
	'1b',
	'1c',
	'1d',
	'1e',
	'1f',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'29',
	'2a',
	'2b',
	'2c',
	'2d',
	'2e',
	'2f',
	'30',
	'31',
	'32',
	'33',
	'34',
	'35',
	'36',
	'37',
	'38',
	'39',
	'3a',
	'3b',
	'3c',
	'3d',
	'3e',
	'3f',
	'40',
	'41',
	'42',
	'43',
	'44',
	'45',
	'46',
	'47',
	'48',
	'49',
	'4a',
	'4b',
	'4c',
	'4d',
	'4e',
	'4f',
	'50',
	'51',
	'52',
	'53',
	'54',
	'55',
	'56',
	'57',
	'58',
	'59',
	'5a',
	'5b',
	'5c',
	'5d',
	'5e',
	'5f',
	'60',
	'61',
	'62',
	'63',
	'64',
	'65',
	'66',
	'67',
	'68',
	'69',
	'6a',
	'6b',
	'6c',
	'6d',
	'6e',
	'6f',
	'70',
	'71',
	'72',
	'73',
	'74',
	'75',
	'76',
	'77',
	'78',
	'79',
	'7a',
	'7b',
	'7c',
	'7d',
	'7e',
	'7f',
	'80',
	'81',
	'82',
	'83',
	'84',
	'85',
	'86',
	'87',
	'88',
	'89',
	'8a',
	'8b',
	'8c',
	'8d',
	'8e',
	'8f',
	'90',
	'91',
	'92',
	'93',
	'94',
	'95',
	'96',
	'97',
	'98',
	'99',
	'9a',
	'9b',
	'9c',
	'9d',
	'9e',
	'9f',
	'a0',
	'a1',
	'a2',
	'a3',
	'a4',
	'a5',
	'a6',
	'a7',
	'a8',
	'a9',
	'aa',
	'ab',
	'ac',
	'ad',
	'ae',
	'af',
	'b0',
	'b1',
	'b2',
	'b3',
	'b4',
	'b5',
	'b6',
	'b7',
	'b8',
	'b9',
	'ba',
	'bb',
	'bc',
	'bd',
	'be',
	'bf',
	'c0',
	'c1',
	'c2',
	'c3',
	'c4',
	'c5',
	'c6',
	'c7',
	'c8',
	'c9',
	'ca',
	'cb',
	'cc',
	'cd',
	'ce',
	'cf',
	'd0',
	'd1',
	'd2',
	'd3',
	'd4',
	'd5',
	'd6',
	'd7',
	'd8',
	'd9',
	'da',
	'db',
	'dc',
	'dd',
	'de',
	'df',
	'e0',
	'e1',
	'e2',
	'e3',
	'e4',
	'e5',
	'e6',
	'e7',
	'e8',
	'e9',
	'ea',
	'eb',
	'ec',
	'ed',
	'ee',
	'ef',
	'f0',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'f9',
	'fa',
	'fb',
	'fc',
	'fd',
	'fe',
	'ff',
]

export class CellID {
	constructor(bytes) {
		this.bytes = new Uint8Array(bytes)
	}

	ToToken() {
		if (this.bytes.length == 0) {
			return 'X'
		}

		var token = ''
		for (const b of this.bytes) {
			token += hex8tab[b]
		}

		if (token[token.length-1] == '0') {
			return token.substr(0, token.length - 1)
		}

		return token
	}

	lastByte() {
		return this.bytes[this.bytes.length-1]
	}

	lsb() {
		const lastByte = this.lastByte()
		return lastByte & -lastByte
	}

	Level() {
		return 30 - ((64 - (this.bytes.length<<3) + bits.TrailingZeros8(this.lastByte()))>>1)
	}

	Face() {
		return this.bytes[0]>>5
	}

	faceIJOrientation() {
		const f = this.Face()
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

export function CellIDFromToken(token) {
	const bytes = new Uint8Array((token.length+1)>>1)
	for (const i in token) {
		bytes[i>>1] |= parseInt(token[i], 16)<<((i&1^1)<<2)
	}

	return new CellID(bytes)
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

function ijLevelToBoundUV(i, j, level) {
	const cellSize = sizeIJ(level)
	const xLo = i & -cellSize
	const yLo = j & -cellSize
	return new r2.Rect(
		new r2.Point(stToUV(ijToSTMin(xLo)), stToUV(ijToSTMin(yLo))),
		new r2.Point(stToUV(ijToSTMin(xLo + cellSize)), stToUV(ijToSTMin(yLo + cellSize)))
	)
}

function faceUVToXYZ(face, u, v) {
	switch (face) {
	case 0:
		return new r3.Vector(1, u, v)
	case 1:
		return new r3.Vector(-u, 1, v)
	case 2:
		return new r3.Vector(-u, -v, 1)
	case 3:
		return new r3.Vector(-1, -v, -u)
	case 4:
		return new r3.Vector(v, -1, -u)
	default:
		return new r3.Vector(v, u, -1)
	}
}

function latitude(p) {
	return new s1.Angle(Math.atan2(p.Vector.Z, Math.sqrt(p.Vector.X*p.Vector.X+p.Vector.Y*p.Vector.Y)))
}

function longitude(p)  {
	return new s1.Angle(Math.atan2(p.Vector.Y, p.Vector.X))
}

export class LatLng {
	constructor(point) {
		this.Latitude = latitude(point)
		this.Longitude = longitude(point)
	}
}

export class Point {
	constructor(vector) {
		this.Vector = vector
	}
}

export class Cell {
	constructor(id) {
		this.id = id
		const [f, i, j, o] = id.faceIJOrientation()
		this.face = f
		this.level = id.Level()
		this.orientation = o
		this.uv = ijLevelToBoundUV(i, j, this.level)
	}

	Vertex(k) {
		return new Point(faceUVToXYZ(this.face, this.uv.Vertex(k).X, this.uv.Vertex(k).Y).Normalize())
	}
}
