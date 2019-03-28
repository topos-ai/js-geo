import r3 from '../r3'

class Point {
	constructor(vector) {
		this.Vector = vector
	}
}

function PointFromLatLng(latLng) {
	const phi = latLng.Latitude.Radians
	const theta = latLng.Longitude.Radians
	const cosphi = Math.cos(phi)
	const vector = new r3.Vector(Math.cos(theta)*cosphi, Math.sin(theta)*cosphi, Math.sin(phi))
	return new Point(vector)
}

export { 
	Point,
	PointFromLatLng,
}
