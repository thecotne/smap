import {pick, concat} from 'ramda';

export var latLng = latLng => new google.maps.LatLng(latLng.lat, latLng.lng);
export var latLngBounds = bounds => new google.maps.LatLngBounds(latLng(bounds.sw), latLng(bounds.ne));

export var commonOverlayOptions = [
	'title',
	'content',
	'fillColor',
	'fillOpacity',
	'strokeColor',
	'strokeOpacity',
	'strokeWeight',
	'icon',
];
export var pickOpts = (_pick, opts) => pick(concat(_pick, commonOverlayOptions), opts);
