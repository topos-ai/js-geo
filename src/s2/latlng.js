import s1 from '../s1'

function latitude(p) {
	return new s1.Angle(Math.atan2(p.Vector.Z, Math.sqrt(p.Vector.X*p.Vector.X+p.Vector.Y*p.Vector.Y)))
}

function longitude(p)  {
	return new s1.Angle(Math.atan2(p.Vector.Y, p.Vector.X))
}

class LatLng {
	constructor(lat, lng) {
		this.Latitude = lat
		this.Longitude = lng
	}
}



function LatLngFromDegrees(lat, lng)  {
	
	return new LatLng( new s1.Angle(lat), new s1.Angle(lng) )
}

function LatLngFromPoint(point) {
	return new LatLng(latitude(point), longitude(point))
}

export { LatLng, LatLngFromDegrees, LatLngFromPoint}
