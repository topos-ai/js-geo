import TrailingZeros8 from '../bits'
import r2 from '../r2'
import { xyzToFaceUV, uvToST} from './stuv.js'
import { PointFromLatLng} from './point.js'
import {clampInt} from './util.js'
import { LatLngFromDegrees} from './latlng.js'


const maxLevel = 30
const maxSize = 1 << maxLevel
const posBits = 2 * maxLevel + 1

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

class CellID {
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
		return 30 - ((64 - (this.bytes.length<<3) + TrailingZeros8(this.lastByte()))>>1)
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

// // cellIDFromPoint returns a leaf cell containing point p. Usually there is
// // exactly one such cell, but for points along the edge of a cell, any
// // adjacent cell may be (deterministically) chosen. This is because
// // s2.CellIDs are considered to be closed sets. The returned cell will
// // always contain the given point, i.e.
// //
// //   CellFromPoint(p).ContainsPoint(p)
// //
// // is always true.
// func cellIDFromPoint(p Point) CellID {
// 	f, u, v := xyzToFaceUV(r3.Vector{ p.X, p.Y, p.Z })
// 	i:= stToIJ(uvToST(u))
// 	j:= stToIJ(uvToST(v))
// 	return cellIDFromFaceIJ(f, i, j)
// }


function CellIDFromPoint(point) {
	const [f, u, v] = xyzToFaceUV(point.Vector)
	const i = stToIJ(uvToST(u))
	const j = stToIJ(uvToST(v))

	return cellIDFromFaceIJ(f, i, j)
}

// CellIDFromPoint(PointFromLatLng(new LatLngFromDegrees(40, -70)))

function stToIJ(s) {
	return clampInt(Math.floor(maxSize * s), 0, maxSize - 1)
}


// func cellIDFromFaceIJ(f, i, j int) CellID {
// 	// Note that this value gets shifted one bit to the left at the end
// 	// of the function.
// 	n:= uint64(f) << (posBits - 1)
// 	// Alternating faces have opposite Hilbert curve orientations; this
// 	// is necessary in order for all faces to have a right-handed
// 	// coordinate system.
// 	bits:= f & swapMask
// 	// Each iteration maps 4 bits of "i" and "j" into 8 bits of the Hilbert
// 	// curve position.  The lookup table transforms a 10-bit key of the form
// 	// "iiiijjjjoo" to a 10-bit value of the form "ppppppppoo", where the
// 	// letters [ijpo] denote bits of "i", "j", Hilbert curve position, and
// 	// Hilbert curve orientation respectively.
// 	for k := 7; k >= 0; k-- {
// 		mask:= (1 << lookupBits) - 1
// 		bits += int((i >> uint(k * lookupBits)) & mask) << (lookupBits + 2)
// 		bits += int((j >> uint(k * lookupBits)) & mask) << 2
// 		bits = lookupPos[bits]
// 		n |= uint64(bits >> 2) << (uint(k) * 2 * lookupBits)
// 		bits &= (swapMask | invertMask)
// 	}
// 	return CellID(n * 2 + 1)
// }


function cellIDFromFaceIJ(f, i, j) {
	let bytes = new Uint8Array(8)
	bytes[0] = f << 4

	// let n = BigInt(f) << BigInt(posBits - 1)

	let bits = f & swapMask
	
	for(let k = 7; k>=0; k--) {
		const mask = (1 << lookupBits) - 1
		bits += ((i >> (k * lookupBits)) & mask) << (lookupBits + 2)
		bits += ((j >> (k * lookupBits)) & mask) << 2
		bits = lookupPos[bits]

		bytes[-(k - 7)] |= (bits >> 2)

		// n |= BigInt(bits >> 2) << BigInt(k * 2 * lookupBits)

		bits &= (swapMask | invertMask)
	}

	let carry = 0
	for (let k = 7; k >= 0; k--) {
		let byte = bytes[k]
		let nextCarry = byte >> 7
		let shiftedByte = byte << 1 | carry
		carry = nextCarry
		bytes[k] = shiftedByte
	}

	bytes[7] += 1

	const binaryBytes = bytes.reduce((str, b) => {
		return str + b.toString(2).padStart(8, '0')
	}, '')

	// console.log(binaryBytes)
	// console.log(n * BigInt(2) + BigInt(1))

	return new CellID(bytes)
}

// CellIDFromLatLng returns the leaf cell containing ll.
// func CellIDFromLatLng(ll LatLng) CellID {
// 	return cellIDFromPoint(PointFromLatLng(ll))
// }

function CellIDFromLatLng(ll) {
	return CellIDFromPoint(PointFromLatLng(ll))
}



function CellIDFromToken(token) {
	const bytes = new Uint8Array((token.length+1)>>1)
	for (const i in token) {
		bytes[i>>1] |= parseInt(token[i], 16)<<((i&1^1)<<2)
	}

	return new CellID(bytes)
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

export { CellID, CellIDFromPoint, CellIDFromLatLng, CellIDFromToken, ijLevelToBoundUV }
