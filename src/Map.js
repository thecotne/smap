import MarkerIconsCollection from './MarkerIconsCollection';
import {lineStyles} from './lineStyles';
import {merge, map, partial, bind, pick, concat} from 'ramda';
import * as GoogleMapsLoader from 'node-google-maps/lib/Google';

import {latLng, latLngBounds} from './helpers';

var defaultMapOptions = {
	center: {
		lat: 42.110449,
		lng: 44.004879
	},
	zoom: 8
};

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

export class Map {
	constructor(container, mapOptions = {}, markerIcons = [], _lineStyles = {}) {
		this.container = container;
		this.mapOptions = merge(defaultMapOptions, mapOptions);

		if (markerIcons) {
			this.markerIcons = markerIcons;
		} else {
			this.markerIcons = new MarkerIconsCollection();
		}

		this.lineStyles = merge(lineStyles, _lineStyles);
		this.shapes = [];

		GoogleMapsLoader.load(bind(this.googleMapApiLoaded, this) );
	}
	googleMapApiLoaded() {
		this.map = new google.maps.Map(this.container, {});
		this.fromObject(this.mapOptions);
		this.infowindow = new google.maps.InfoWindow();
	}
	setCenter(lat, lng) {
		this.map.setCenter(latLng({lat, lng}));
	}
	setZoom(zoom) {
		this.map.setZoom(zoom);
	}
	addPolygon(overlayOptions) {
		var options = pick(concat(['paths'], commonOverlayOptions), overlayOptions);
		options.paths = map(map(latLng), options.paths);
		var overlay = new google.maps.Polygon(options);
		overlay.type = overlayOptions.type;
		overlay.setMap(this.map);
		this.shapes.push(overlay);
	}
	addPolyline(overlayOptions) {
		var options = pick(concat(['path', 'lineStyle'], commonOverlayOptions), overlayOptions);
		options.path = map(latLng);
		var overlay = new google.maps.Polyline(options);
		overlay.type = overlayOptions.type;
		overlay.setMap(this.map);
		this.shapes.push(overlay);
	}
	addRectangle(overlayOptions) {
		var options = pick(concat(['bounds'], commonOverlayOptions), overlayOptions);
		options.bounds = latLngBounds(options.bounds);
		var overlay = new google.maps.Rectangle(options);
		overlay.type = overlayOptions.type;
		overlay.setMap(this.map);
		this.shapes.push(overlay);
	}
	addCircle(overlayOptions) {
		var options = pick(concat(['center', 'radius'], commonOverlayOptions), overlayOptions);
		options.center = latLng(options.center);
		var overlay = new google.maps.Circle(options);
		overlay.type = overlayOptions.type;
		overlay.setMap(this.map);
		this.shapes.push(overlay);
	}
	addMarker(overlayOptions) {
		var options = pick(concat(['position', 'icon', 'iconId', 'iconOverPoint'], commonOverlayOptions), overlayOptions);
		options.position = latLng(options.position);
		if (this.markerIcons && options.iconId) {
			options.iconId = parseInt(options.iconId);
			options.iconOverPoint = !! options.iconOverPoint;
			var icon = this.markerIcons.getById(options.iconId);
			if ( ! icon) {
				icon = this.markerIcons.getById(0);
				options.iconId = 0;
			}
			options.icon = {
				url: icon.thumb
			};
			if (options.iconOverPoint) {
				options.icon.anchor = new google.maps.Point(icon.width/2, icon.height/2);
			}
		}
		var overlay = new google.maps.Marker(options);
		overlay.type = overlayOptions.type;
		overlay.setMap(this.map);
		if (overlay.content) {
			var hendler = partial(bind(this.showMarker, this), overlay);
			google.maps.event.addListener(overlay, 'click', hendler);
		};
		this.shapes.push(overlay);
	}
	addOverlay(overlay) {
		if (overlay.type == 'polygon') {
			this.addPolygon(overlay);
		} else if (overlay.type == "polyline") {
			this.addPolyline(overlay);
		} else if (overlay.type == "rectangle") {
			this.addRectangle(overlay);
		} else if (overlay.type == "circle") {
			this.addCircle(overlay);
		} else if (overlay.type == "marker") {
			this.addMarker(overlay);
		}
	}
	fromObject(data) {
		if (data.zoom) {
			this.setZoom(data.zoom);
		}
		if (data.center) {
			this.setCenter(data.center.lat, data.center.lng);
		}
		if (data.overlays) {
			data.overlays.forEach(bind(this.addOverlay, this));
		}
	}
	showMarker(overlay, mt) {
		this.infowindow.close();
		this.infowindow.setContent(overlay.content);
		this.infowindow.open(this.map, overlay);
	}
}

