var R = require('ramda');
var defaultIcons = [{
	id: 0,
	thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
	title: 'default',
	width: 22,
	height: 40,
}];

export class MarkerIcons {
	constructor (icons = []) {
		this.icons = R.concat(defaultIcons, icons);
	}
	get (index) {
		return this.icons[index];
	}
	getById (id){
		return R.find(R.propEq('id', id), this.icons);
	}
}
