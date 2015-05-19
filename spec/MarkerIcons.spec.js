import {MarkerIcons} from '../src/MarkerIcons';

describe('MarkerIcons', () => {
	it('does not explode!', () => {
		expect(() => {
			new MarkerIcons();
		}).not.toThrow();
	});
	it('returns default icon for 0', () => {
		var markerIcons = new MarkerIcons();
		expect(markerIcons.get(0)).toEqual({
			id: 0,
			thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
			title: 'default',
			width: 22,
			height: 40,
		});
	});
	it('you can retrive icon by id', () => {
		var myIcon = {
			id: 22,
			thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
			title: 'default',
			width: 22,
			height: 40,
		};
		var markerIcons = new MarkerIcons([myIcon]);
		expect(markerIcons.getById(22)).toEqual(myIcon);
	});
});
