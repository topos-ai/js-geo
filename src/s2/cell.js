import { Point } from './point'
import { ijLevelToBoundUV } from './cellid'
import { faceUVToXYZ } from './stuv'

class Cell {
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

export {
	Cell,
}
