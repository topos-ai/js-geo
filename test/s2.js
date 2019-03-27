import assert from 'assert'
import {s2} from '../src'


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
		{cellId: 0x47a1cbd595522b39, lat: 49.703498679, lng: 11.770681595},
		{cellId: 0x47a1cbd5eacc31e3, lat: 49.703498, lng: 11.770680},
		// {cellId: 0x46525318b63be0f9, lat: 55.685376759, lng: 12.588490937},
		// {cellId: 0x52b30b71698e729d, lat: 45.486546517, lng: -93.449700022},
		// {cellId: 0x46ed8886cfadda85, lat: 58.299984854, lng: 23.049300056},
		// {cellId: 0x3663f18a24cbe857, lat: 34.364439040, lng: 108.330699969},
		// {cellId: 0x10a06c0a948cf5d, lat: -30.694551352, lng: -30.048758753},
		// {cellId: 0x2b2bfd076787c5df, lat: -25.285264027, lng: 133.823116966},
		// {cellId: 0xb09dff882a7809e1, lat: -75.000000031, lng: 0.000000133},
		// {cellId: 0x94daa3d000000001, lat: -24.694439215, lng: -47.537363213},
		// {cellId: 0x87a1000000000001, lat: 38.899730392, lng: -99.901813021},
		// {cellId: 0x4fc76d5000000001, lat: 81.647200334, lng: -55.631712940},
		// {cellId: 0x3b00955555555555, lat: 10.050986518, lng: 78.293170610},
		// {cellId: 0x1dcc469991555555, lat: -34.055420593, lng: 18.551140038},
		// {cellId: 0xb112966aaaaaaaab, lat: -69.219262171, lng: 49.670072392}
	]

	for (const test of nominalCases) {
		it(`correctly decodes and encodes {lat: ${test.lat}, lng: ${test.lng}}`, function() {
			const binary = test.cellId.toString(2)
			console.log(binary)


			const binary64 = `${(64 - binary.length) * '0'}${binary}`

			// console.log(binary64.length)

			let binaryBytes = new Uint8Array(8)
			for (var i = 0; i <= 7; i++) {
				const byte = binary64.slice((8 * i), ( 8 * i ) + 8)
				binaryBytes[i] = parseInt( byte, 2 );
			}

			const testCell = new s2.CellID(binaryBytes)
			const testToken = testCell.ToToken()

			const latLng = s2.LatLngFromDegrees(test.lat, test.lng)
			const latLngCellId = s2.CellIDFromLatLng(latLng)
			const latLngToken = latLngCellId.ToToken()

			console.log("Our value", latLngCellId)
			console.log("Test value", testCell)


			assert.equal(testToken, latLngToken)
		})
	}
})