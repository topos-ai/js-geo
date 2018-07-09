import assert from 'assert'
import {s2} from '../src'


describe('CellIDFromToken()', function() {
	const nominalCases = [
		{'token': '1', 'value': 0x1000000000000000},
		{'token': '3', 'value': 0x3000000000000000},
		{'token': '14', 'value': 0x1400000000000000},
		{'token': '41', 'value': 0x4100000000000000},
		{'token': '094', 'value': 0x0940000000000000},
		{'token': '537', 'value': 0x5370000000000000},
		{'token': '3fec', 'value': 0x3fec000000000000},
		{'token': '72f3', 'value': 0x72f3000000000000},
		{'token': '52b8c', 'value': 0x52b8c00000000000},
		{'token': '990ed', 'value': 0x990ed00000000000},
		{'token': '4476dc', 'value': 0x4476dc0000000000},
		{'token': '2a724f', 'value': 0x2a724f0000000000},
		{'token': '7d4afc4', 'value': 0x7d4afc4000000000},
		{'token': 'b675785', 'value': 0xb675785000000000},
		{'token': '40cd6124', 'value': 0x40cd612400000000},
		{'token': '3ba32f81', 'value': 0x3ba32f8100000000},
		{'token': '08f569b5c', 'value': 0x08f569b5c0000000},
		{'token': '385327157', 'value': 0x3853271570000000},
		{'token': '166c4d1954', 'value': 0x166c4d1954000000},
		{'token': '96f48d8c39', 'value': 0x96f48d8c39000000},
		{'token': '0bca3c7f74c', 'value': 0x0bca3c7f74c00000},
		{'token': '1ae3619d12f', 'value': 0x1ae3619d12f00000},
		{'token': '07a77802a3fc', 'value': 0x07a77802a3fc0000},
		{'token': '4e7887ec1801', 'value': 0x4e7887ec18010000},
		{'token': '4adad7ae74124', 'value': 0x4adad7ae74124000},
		{'token': '90aba04afe0c5', 'value': 0x90aba04afe0c5000},
		{'token': '8ffc3f02af305c', 'value': 0x8ffc3f02af305c00},
		{'token': '6fa47550938183', 'value': 0x6fa4755093818300},
		{'token': 'aa80a565df5e7fc', 'value': 0xaa80a565df5e7fc0},
		{'token': '01614b5e968e121', 'value': 0x01614b5e968e1210},
		{'token': 'aa05238e7bd3ee7c', 'value': 0xaa05238e7bd3ee7c},
		{'token': '48a23db9c2963e5b', 'value': 0x48a23db9c2963e5b},
	]

	for (const test of nominalCases) {
		it('correctly decodes and encodes ' + test.token, function() {
			const ci = s2.CellIDFromToken(test.token)
			const token = ci.ToToken()
			assert.equal(test.token, token)
		})
	}
})
