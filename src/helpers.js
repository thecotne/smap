/**
 * helper functions.
 * @namespace helpers
 */

import {
	pick,
	concat,
	curry
} from 'ramda';


/**
 * create latLng instance from latLng object
 * @function helpers.latLng
 * @param  {Object} latLng
 * @return {object} google.maps.LatLng instance
 */
export var latLng = latLng => new google.maps.LatLng(latLng.lat, latLng.lng);


/**
 * create latLngBounds instance from bounds object
 * @function helpers.latLngBounds
 * @param  {Object} bounds
 * @return {object} google.maps.LatLngBounds instance
 */
export function latLngBounds(bounds) {
	return new google.maps.LatLngBounds(latLng(bounds.sw), latLng(bounds.ne));
}

/**
 * pick properties from given opts object
 * @function helpers.pickOpts
 * @param  {Array} names names of properties to pick
 * @param  {object} opts options object
 * @return {object} options picked from given options object
 */
export var pickOpts = (names, opts) => {
	var commonOverlayOptions = [
		'title',
		'content',
		'fillColor',
		'fillOpacity',
		'strokeColor',
		'strokeOpacity',
		'strokeWeight',
		'icon',
	];

	return pick(concat(names, commonOverlayOptions), opts);
};

/**
 * set center to given map
 * @function helpers.setCenter
 * @param {object} latLng
 * @param {object} google map instance
 */
export var setCenter = curry((latLng, map) => map.setCenter(latLng));

/**
 * set zoom to given map
 * @function helpers.setZoom
 * @param {Number} zoom zoom
 * @param {object} map google map instance
 */
export var setZoom = curry((zoom, map) => map.setZoom(zoom));
