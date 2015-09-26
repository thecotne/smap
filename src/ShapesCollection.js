import {concat, find, propEq} from 'ramda';

/**
 * default marker icons
 * @type {Array}
 */
export var defaultIcons = [{
	id: 0,
	thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
	title: 'default',
	width: 22,
	height: 40,
}];

export default class MarkerIconsCollection {
	/**
	 * MarkerIcons Collection
	 * @param  {Array} marker icon object array
	 */
	constructor (icons = []) {
		this.icons = concat(defaultIcons, icons);
	}
	/**
	 * get by id
	 * @param  {Number} id
	 * @return {Object} marker icon object
	 */
	getById (id) {
		return find(propEq('id', id), this.icons);
	}
}
