import {Map} from '../src/base';

describe('Map', () => {
	it('does not explode if pass container', () => {
		var mapContainer = document.createElement('div');
		expect(() => {
			new Map(mapContainer);
		}).not.toThrow();
	});

});
