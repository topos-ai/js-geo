import assert from 'assert'
import { TrailingZeros8 } from '../src/bits'

describe('TrailingZeros8()', function() {
	it('undefined for values less than 0', function(){
		assert.equal(TrailingZeros8(-1), undefined)
	})

	it('undefined for values greater than 255', function(){
  	assert.equal(TrailingZeros8(256), undefined)
	})
})
