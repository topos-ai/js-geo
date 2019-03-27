import assert from 'assert'
import { uvToST, stToUV, faceUVToXYZ } from '../src/s2/stuv.js'
import { r3 } from '../src'


describe('uvToST()', function () {
    it('correctly maps UV to ST', function () {
        assert.equal(uvToST(stToUV(.125)), .125)
    })
})

describe('stToUV()', function () {
    it('correctly maps ST to UV', function () {
        assert.equal(stToUV(uvToST(.125)), .125)
    })
})

describe('faceUVToXYZ()', function () {
    it('correctly maps face and UV to XYZ', function () {
        var sum = new r3.Vector()
        for (let face = 0; face < 6; face++){
            const center = faceUVToXYZ(face, 0, 0)
            switch(center.LargestComponent()) {
                case r3.Axis.X:
                    assert.equal(Math.abs(center.X), 1)
                    break;
                case r3.Axis.Y:
                    assert.equal(Math.abs(center.Y), 1)
                    break;
                case r3.Axis.Z:
                    assert.equal(Math.abs(center.Z), 1)
                    break;
            }

            sum = sum.Add(center)
        }
    })
})
