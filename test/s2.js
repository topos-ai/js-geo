import assert from 'assert'
import { s2 } from '../src'

describe('CellIDFromToken()', function() {
	const nominalCases = [
		{ 'token': '1' },
		{ 'token': '3' },
		{ 'token': '14' },
		{ 'token': '41' },
		{ 'token': '094' },
		{ 'token': '537' },
		{ 'token': '3fec' },
		{ 'token': '72f3' },
		{ 'token': '52b8c' },
		{ 'token': '990ed' },
		{ 'token': '4476dc' },
		{ 'token': '2a724f' },
		{ 'token': '7d4afc4' },
		{ 'token': 'b675785' },
		{ 'token': '40cd6124' },
		{ 'token': '3ba32f81' },
		{ 'token': '08f569b5c' },
		{ 'token': '385327157' },
		{ 'token': '166c4d1954' },
		{ 'token': '96f48d8c39' },
		{ 'token': '0bca3c7f74c' },
		{ 'token': '1ae3619d12f' },
		{ 'token': '07a77802a3fc' },
		{ 'token': '4e7887ec1801' },
		{ 'token': '4adad7ae74124' },
		{ 'token': '90aba04afe0c5' },
		{ 'token': '8ffc3f02af305c' },
		{ 'token': '6fa47550938183' },
		{ 'token': 'aa80a565df5e7fc' },
		{ 'token': '01614b5e968e121' },
		{ 'token': 'aa05238e7bd3ee7c' },
		{ 'token': '48a23db9c2963e5b' },
	]

	for (const test of nominalCases) {
		it('correctly decodes and encodes ' + test.token, function() {
			const ci = s2.CellIDFromToken(test.token)
			const token = ci.ToToken()
			assert.equal(test.token, token)
		})
	}
})

describe('CellIDFromLatLng()', function() {
	const nominalCases = [
		{ latitude: 160.27061374588192, longitude: -91.8125692942393, token: "3a0582bf7f219c0b" },
		{ latitude: 56.144255470345854, longitude: -160.43621774410786, token: "56fb065a3e131361" },
		{ latitude: -47.668605612314934, longitude: -75.7870440636266, token: "bd9bc54c2b17ffc7" },
		{ latitude: -110.72210051702443, longitude: 55.91957429333968, token: "a4612ebab25262df" },
		{ latitude: 142.98109673392838, longitude: -119.752400678739, token: "3f6bc067b47c1bc9" },
		{ latitude: -76.10916535003616, longitude: 144.9377446573817, token: "af0636866be87f9d" },
		{ latitude: 125.92090143463446, longitude: -81.70315030314615, token: "5d1ec3e964fb5f95" },
		{ latitude: 39.26886911652821, longitude: -88.68383768057873, token: "887383b25766176b" },
		{ latitude: 98.87552610695292, longitude: -173.706925623607, token: "457c6b585c17c3a1" },
		{ latitude: 103.34662426943794, longitude: 107.78173126540361, token: "4e36e15b846db84b" },
	]

	for (const test of nominalCases) {
		it(`correctly encodes (${test.latitude}, ${test.longitude})`, function() {
			const token = s2.CellIDFromLatLng(s2.LatLngFromDegrees(test.latitude, test.longitude)).ToToken()
			assert.equal(test.token, token)
		})
	}
})