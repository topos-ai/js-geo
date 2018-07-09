import assert from 'assert'
import * as bits from '../src/bits'

describe('TrailingZeros8()', function() {
	it('undefined for values less than 0', function(){
		assert.equal(bits.TrailingZeros8(-1), undefined)
	})

	it('undefined for values greater than 255', function(){
  	assert.equal(bits.TrailingZeros8(256), undefined)
	})
})
