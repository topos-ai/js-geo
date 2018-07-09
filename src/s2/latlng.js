import s1 from '../s1'

function latitude(p) {
	return new s1.Angle(Math.atan2(p.Vector.Z, Math.sqrt(p.Vector.X*p.Vector.X+p.Vector.Y*p.Vector.Y)))
}

function longitude(p)  {
	return new s1.Angle(Math.atan2(p.Vector.Y, p.Vector.X))
}

class LatLng {
	constructor(point) {
		this.Latitude = latitude(point)
		this.Longitude = longitude(point)
	}
}

export {LatLng}
