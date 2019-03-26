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

function face(vector) {
	const f = vector.LargestComponent()
	if ((f == r3.Axis.X && vector.X < 0) || (f == r3.Axis.Y && vector.Y < 0) || f == r3.Axis.Z && vector.Z < 0) {
		return f+3
	}

	return f
}

function xyzToFaceUV(vector) {
	const f = face(vector)
	const [u, v] = validFaceXYZToUV(f, vector)
	return [f, u, v]
}

function validFaceXYZToUV(face, vector){
	switch (face) {
		case 0:
			return [vector.Y / vector.X, vector.Z / vector.X]
		case 1:
			return [-vector.X / vector.Y, vector.Z / vector.Y]
		case 2:
			return [-vector.X / vector.Z, -vector.Y / vector.Z]
		case 3:
			return [vector.Z / vector.X, vector.Y / vector.X]
		case 4:
			return [vector.Z / vector.Y, -vector.X / vector.Y]
	}

	return [-vector.Y / vector.Z, -vector.X / vector.Z]
}

function uvToST(u) {
	if (u >= 0) {
		return 0.5 * Math.sqrt(1 + 3 * u)
	}

	return 1 - 0.5 * Math.sqrt(1 - 3 * u)
}


export {stToUV, faceUVToXYZ, xyzToFaceUV, uvToST}

