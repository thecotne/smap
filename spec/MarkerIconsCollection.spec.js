import MarkerIconsCollection from '../src/MarkerIconsCollection';

describe('MarkerIconsCollection', () => {
	it('does not explode!', () => {
		expect(() => {
			new MarkerIconsCollection();
		}).not.toThrow();
	});
	it('returns default icon for 0', () => {
		let markerIconsCollection = new MarkerIconsCollection();
		expect(markerIconsCollection.getById(0)).toEqual({
			id: 0,
			thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
			title: 'default',
			width: 22,
			height: 40,
		});
	});
	it('you can retrive icon by id', () => {
		let myIcon = {
			id: 22,
			thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
			title: 'default',
			width: 22,
			height: 40,
		};
		let markerIconsCollection = new MarkerIconsCollection([myIcon]);
		expect(markerIconsCollection.getById(22)).toEqual(myIcon);
	});
});
