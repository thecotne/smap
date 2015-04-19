import {MarkerIcons} from './MarkerIcons';
import {lineStyles} from './lineStyles';

var R = require('ramda');
var GoogleMapsLoader = require('google-maps');

export class map {
	constructor(_container, _markerIcons, _lineStyles) {
		this.container = _container;
		this.markerIcons = new MarkerIcons(_markerIcons);
		this.lineStyles = R.merge(lineStyles, _lineStyles || {});
		this.shapes = [];

		GoogleMapsLoader.load(this.googleApiLoaded.bind(this));
	}
	googleApiLoaded() {
		google.maps.event.addDomListener(window, 'load', this.googleMapApiLoaded.bind(this));
	}
	googleMapApiLoaded() {
		var mapOptions = {
			center: new google.maps.LatLng(42.110449, 44.004879),
			zoom: 8,
			disableDefaultUI: true,
		};
		this.map = new google.maps.Map(this.container, mapOptions);
		this.infowindow = new google.maps.InfoWindow();

		this.fromObject({
			overlays: [{
				"type": "marker",
				"title": "Mestia Airport ",
				"content": "cotne sdsdsds",
				"icon": "http:\/\/investingeorgia.local.itdc.ge\/uploads\/photo\/main\/0\/130.png",
				"iconId": "130",
				"position": {
					"lat": 43.052539,
					"lng": 42.748066
				},
				"catId": 92
			}, {
				"type": "marker",
				"title": "Batumi Airport ",
				"content": "",
				"icon": "http:\/\/investingeorgia.local.itdc.ge\/uploads\/photo\/main\/0\/130.png",
				"iconId": "130",
				"position": {
					"lat": 41.608501,
					"lng": 41.597518
				},
				"catId": 92
			}, {
				"type": "marker",
				"title": "Kutaisi Airport ",
				"content": "",
				"icon": "http:\/\/investingeorgia.local.itdc.ge\/uploads\/photo\/main\/0\/130.png",
				"iconId": "130",
				"position": {
					"lat": 42.175272,
					"lng": 42.48368
				},
				"catId": 92
			}, {
				"type": "marker",
				"title": "Tbilisi Airport ",
				"content": "",
				"icon": "http:\/\/investingeorgia.local.itdc.ge\/uploads\/photo\/main\/0\/130.png",
				"iconId": "130",
				"position": {
					"lat": 41.672743,
					"lng": 44.957108
				},
				"catId": 92
			}]
		});
	}
	setCenter(lat, lng) {
		this.map.setCenter(new google.maps.LatLng(lat, lng));
	}
	setZoom(zoom) {
		this.map.setZoom(zoom);
	}
	fromObject(data) {
		if (data.zoom) {
			this.setZoom(data.zoom);
		};

		if (data.center) {
			this.setCenter(data.center.lat, data.center.lng);
		}

		if (data.overlays) {
			data.overlays.forEach((overlay)=>{
				var options = {};
				options.title = overlay.title || '';
				options.content = overlay.content || '';

				for (let key of ['fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight', 'icon']) {
					options[key] = overlay[key];
				}

				if (overlay.type == 'polygon') {
					options.paths = R.map((path)=>{
						return R.map((latLng)=>{
							return new google.maps.LatLng(latLng.lat, latLng.lng);
						}, path);
					}, overlay.paths);

					var _overlay = new google.maps.Polygon(options);

				} else if (overlay.type == "polyline") {
					options.path = R.map((latLng)=>{
						return new google.maps.LatLng(latLng.lat, latLng.lng)
					});

					if (overlay.lineStyle) {
						options.lineStyle = overlay.lineStyle;
						if (this.lineStyles) {
							try{
								if (overlay.lineStyle == 'solid') {
									options.icons = [];
									options.strokeOpacity = options._strokeOpacity || 1;
								} else {
									options.icons = this.lineStyles[overlay.lineStyle](this.activeItem.strokeWeight || this.shapeDefaults.strokeWeight);
									options._strokeOpacity = options.strokeOpacity;
									options.strokeOpacity = 0;
								}
							} catch(e){}
						};
					}
					_overlay = new google.maps.Polyline(options);
				} else if (overlay.type == "rectangle") {
					options.bounds = new google.maps.LatLngBounds(
						new google.maps.LatLng(overlay.bounds.sw.lat, overlay.bounds.sw.lng),
						new google.maps.LatLng(overlay.bounds.ne.lat, overlay.bounds.ne.lng));
					_overlay = new google.maps.Rectangle(options);
				} else if (overlay.type == "circle") {
					options.center = new google.maps.LatLng(overlay.center.lat, overlay.center.lng);;
					options.radius = overlay.radius;
					_overlay = new google.maps.Circle(options);
				} else if (overlay.type == "marker") {

					options.position = new google.maps.LatLng(overlay.position.lat, overlay.position.lng);
					if (overlay.icon) {
						options.icon = overlay.icon;
					}
					if (this.markerIcons && overlay.iconId) {

						options.iconId = parseInt(overlay.iconId);
						options.iconOverPoint = !!overlay.iconOverPoint;
						var icon = this.markerIcons.getById(options.iconId);
						if (icon) {
							if (options.iconOverPoint) {
								options.icon = {
									url: icon.thumb,
									// size: new google.maps.Size(71, 71),
									// origin: new google.maps.Point(0, 0),
									anchor: new google.maps.Point(icon.width/2, icon.height/2),
									// scaledSize: new google.maps.Size(36, 36)
								};
							} else {
								options.icon = {
									url: icon.thumb
								};
							}
						} else {
							options.iconId = 0;
							options.icon = {
								url: this.markerIcons.getById(0).thumb
							};
						}
					}
					_overlay = new google.maps.Marker(options);
				}
				_overlay.type = overlay.type;
				_overlay.setMap(this.map);

				options.title = overlay.title || '';
				options.content = overlay.content || '';
				options.contId = overlay.contId || '';
				options.catId = overlay.catId || '';
				options.id = overlay.id || '';

				this.overlayAdded(_overlay.type, _overlay);
			});
		}
	}
	overlayAdded(type, overlay) {
		var newShape = overlay;
		if (type == 'marker' && overlay.content) {
			var hendler = R.partial(R.bind(this.showMarker, this), overlay);
			google.maps.event.addListener(overlay, 'click', hendler);
		};
		newShape.type = type;
		this.shapes.push(newShape);
		return newShape;
	}
	showMarker(overlay, mt) {
		this.infowindow.close();
		this.infowindow.setContent(overlay.content);
		this.infowindow.open(this.map, overlay);
	}

}

