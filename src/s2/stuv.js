import r3 from '../r3'

function stToUV(s) {
	if (s >= 0.5) {
		return (1 / 3) * (4*s*s - 1)
	}

	return (1 / 3) * (1 - 4*(1-s)*(1-s))
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

export {stToUV, faceUVToXYZ}
