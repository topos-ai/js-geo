import assert from 'assert'
import { uvToST, stToUV, faceUVToXYZ } from '../src/s2/stuv.js'
import {r3} from '../src'


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


// func TestFaceUVToXYZ(t * testing.T) {
//     // Check that each face appears exactly once.
//     var sum r3.Vector
//     for face := 0; face < 6; face++ {
//         center:= faceUVToXYZ(face, 0, 0)
//         if !center.ApproxEqual(unitNorm(face).Vector) {
//             t.Errorf("faceUVToXYZ(%d, 0, 0) != unitNorm(%d), should be equal", face, face)
//         }
//         switch center.LargestComponent() {
//             case r3.XAxis:
//                 if math.Abs(center.X) != 1 {
//                     t.Errorf("%v.X = %v, want %v", center, math.Abs(center.X), 1)
//                 }
//             case r3.YAxis:
//                 if math.Abs(center.Y) != 1 {
//                     t.Errorf("%v.Y = %v, want %v", center, math.Abs(center.Y), 1)
//                 }
//             default:
//                 if math.Abs(center.Z) != 1 {
//                     t.Errorf("%v.Z = %v, want %v", center, math.Abs(center.Z), 1)
//                 }
//         }
//         sum = sum.Add(center.Abs())

//         // Check that each face has a right-handed coordinate system.
//         if got := uAxis(face).Vector.Cross(vAxis(face).Vector).Dot(unitNorm(face).Vector); got != 1 {
//             t.Errorf("right-handed check failed. uAxis(%d).Cross(vAxis(%d)).Dot(unitNorm%v) = %f, want 1", face, face, face, got)
//         }

//         // Check that the Hilbert curves on each face combine to form a
//         // continuous curve over the entire cube.
//         // The Hilbert curve on each face starts at (-1,-1) and terminates
//         // at either (1,-1) (if axes not swapped) or (-1,1) (if swapped).
//         var sign float64 = 1
//         if face & swapMask == 1 {
//             sign = -1
//         }
//         if faceUVToXYZ(face, sign, -sign) != faceUVToXYZ((face + 1) % 6, -1, -1) {
//             t.Errorf("faceUVToXYZ(%v, %v, %v) != faceUVToXYZ(%v, -1, -1)", face, sign, -sign, (face + 1) % 6)
//         }
//     }

//     // Adding up the absolute value all all the face normals should equal 2 on each axis.
//     if !sum.ApproxEqual(r3.Vector{ 2, 2, 2}) {
//         t.Errorf("sum of the abs of the 6 face norms should = %v, got %v", r3.Vector{ 2, 2, 2}, sum)
//     }
// }


// describe('CellIDFromToken()', function () {
//     const nominalCases = [
//         { 'token': '1', 'value': 0x1000000000000000 },
//         { 'token': '3', 'value': 0x3000000000000000 },
//         { 'token': '14', 'value': 0x1400000000000000 },
//         { 'token': '41', 'value': 0x4100000000000000 },
//         { 'token': '094', 'value': 0x0940000000000000 },
//         { 'token': '537', 'value': 0x5370000000000000 },
//         { 'token': '3fec', 'value': 0x3fec000000000000 },
//         { 'token': '72f3', 'value': 0x72f3000000000000 },
//         { 'token': '52b8c', 'value': 0x52b8c00000000000 },
//         { 'token': '990ed', 'value': 0x990ed00000000000 },
//         { 'token': '4476dc', 'value': 0x4476dc0000000000 },
//         { 'token': '2a724f', 'value': 0x2a724f0000000000 },
//         { 'token': '7d4afc4', 'value': 0x7d4afc4000000000 },
//         { 'token': 'b675785', 'value': 0xb675785000000000 },
//         { 'token': '40cd6124', 'value': 0x40cd612400000000 },
//         { 'token': '3ba32f81', 'value': 0x3ba32f8100000000 },
//         { 'token': '08f569b5c', 'value': 0x08f569b5c0000000 },
//         { 'token': '385327157', 'value': 0x3853271570000000 },
//         { 'token': '166c4d1954', 'value': 0x166c4d1954000000 },
//         { 'token': '96f48d8c39', 'value': 0x96f48d8c39000000 },
//         { 'token': '0bca3c7f74c', 'value': 0x0bca3c7f74c00000 },
//         { 'token': '1ae3619d12f', 'value': 0x1ae3619d12f00000 },
//         { 'token': '07a77802a3fc', 'value': 0x07a77802a3fc0000 },
//         { 'token': '4e7887ec1801', 'value': 0x4e7887ec18010000 },
//         { 'token': '4adad7ae74124', 'value': 0x4adad7ae74124000 },
//         { 'token': '90aba04afe0c5', 'value': 0x90aba04afe0c5000 },
//         { 'token': '8ffc3f02af305c', 'value': 0x8ffc3f02af305c00 },
//         { 'token': '6fa47550938183', 'value': 0x6fa4755093818300 },
//         { 'token': 'aa80a565df5e7fc', 'value': 0xaa80a565df5e7fc0 },
//         { 'token': '01614b5e968e121', 'value': 0x01614b5e968e1210 },
//         { 'token': 'aa05238e7bd3ee7c', 'value': 0xaa05238e7bd3ee7c },
//         { 'token': '48a23db9c2963e5b', 'value': 0x48a23db9c2963e5b },
//     ]

//     func TestSTUV(t * testing.T) {
//         if x := stToUV(uvToST(.125)); x != .125 {
//             t.Error("stToUV(uvToST(.125) == ", x)
//         }
//         if x := uvToST(stToUV(.125)); x != .125 {
//             t.Error("uvToST(stToUV(.125) == ", x)
//         }
//     }


//     for (const test of nominalCases) {
//         it('correctly decodes and encodes ' + test.token, function () {
//             const ci = s2.CellIDFromToken(test.token)
//             const token = ci.ToToken()
//             assert.equal(test.token, token)
//         })
//     }
// })
