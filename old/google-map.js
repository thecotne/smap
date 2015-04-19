var is = R.curry(function (constructor, a) {
	if (R.is(Object, a) && R.is(Function, a.instanceOf)) {
		return a.instanceOf(constructor);
	} else {
		return R.is(constructor, a);
	}
});

var googleMap = {};


googleMap.lineStyles = {
	solid: function(strokeWeight){
		//
		//
	},
	dashed: function(strokeWeight){
		return [{
			icon: {
				path: 'M 0,-2 0,2',
				strokeOpacity: 1,
			},
			repeat: strokeWeight*10 +'px'
		}]
	},
	doted: function(strokeWeight){
		return [{
			icon: {
				path: 'M -0.5,-0.5 0.5,-0.5, 0.5,0.5 -0.5,0.5',
				fillOpacity: 1,
				scale: strokeWeight
			},
			repeat: strokeWeight*3 +'px'
		}]
	},
};

googleMap.GoogleMap = Class({
	'protected map': null,
	'protected wrapper': null,
	'protected opts': null,
	'protected shapes': [],
	'protected infowindow': null,

	__construct: function(wrapper, opts) {
		if ( ! (wrapper instanceof HTMLElement)) {
			throw 'wrapper not instanceof HTMLElement';
		};
		if ( ! ( !! opts && typeof opts == 'object')) {
			throw 'typeof opts not Object';
		};

		this.wrapper = wrapper;
		this.opts = opts;

		this.markerIcons = new googleMap.MarkerIcons(this.opts.markerIcons);

		// this.opts.markerIcons = R.merge(googleMap.markerIcons, this.opts.markerIcons || {});

		this.opts.lineStyles = R.merge(googleMap.lineStyles, this.opts.lineStyles || {});

		google.maps.event.addDomListener(window, 'load', this.initializeMap.bind(this));
	},
	clearShapesByCatId: function(id) {
		this.shapes = R.filter(function(x) {
			if (x.catId == id) {
				x.setMap(null);
			} else {
				return true;
			}
		}, this.shapes);
	},
	clearShapes: function() {
		R.forEach(function(x) {
			x.setMap(null);
		}, this.shapes);
		this.shapes = [];
	},
	initializeMap: function() {
		var mapOptions = {
			center: new google.maps.LatLng(42.110449, 44.004879),
			zoom: 8,
			disableDefaultUI: true,
		};
		this.map = new google.maps.Map(this.wrapper, mapOptions);

		this.infowindow = new google.maps.InfoWindow();
	},
	fromObject: function(inputData) {
		if (inputData.zoom) {
			this.map.setZoom(inputData.zoom);
		}
		if (inputData.tilt) {
			this.map.setTilt(inputData.tilt);
		}
		if (inputData.mapTypeId) {
			this.map.setMapTypeId(inputData.mapTypeId);
		}
		if (inputData.center) {
			this.map.setCenter(new google.maps.LatLng(inputData.center.lat, inputData.center.lng));
		}

		var tmpOverlay, ovrOptions;
		var properties = new Array('fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight', 'icon');
		for (var m = inputData.overlays.length - 1; m >= 0; m--) {
			ovrOptions = new Object();

			if (inputData.overlays[m].title) {
				ovrOptions.title = inputData.overlays[m].title;
			} else {
				ovrOptions.title = "";
			}
			if (inputData.overlays[m].content) {
				ovrOptions.content = inputData.overlays[m].content;
			} else {
				ovrOptions.content = "";
			}

			for (var x = properties.length; x >= 0; x--) {
				if (inputData.overlays[m][properties[x]]) {
					ovrOptions[properties[x]] = inputData.overlays[m][properties[x]];
				}
			}
			if (inputData.overlays[m].type == "polygon") {
				var tmpPaths = new Array();
				for (var n = 0; n < inputData.overlays[m].paths.length; n++) {
					var tmpPath = new Array();
					for (var p = 0; p < inputData.overlays[m].paths[n].length; p++) {
						tmpPath.push(new google.maps.LatLng(inputData.overlays[m].paths[n][p].lat, inputData.overlays[m].paths[n][p].lng));
					}
					tmpPaths.push(tmpPath);
				}
				ovrOptions.paths = tmpPaths;
				tmpOverlay = new google.maps.Polygon(ovrOptions);
			} else if (inputData.overlays[m].type == "polyline") {
				var tmpPath = new Array();
				for (var p = 0; p < inputData.overlays[m].path.length; p++) {
					tmpPath.push(new google.maps.LatLng(inputData.overlays[m].path[p].lat, inputData.overlays[m].path[p].lng));
				}
				ovrOptions.path = tmpPath;
				if (inputData.overlays[m].lineStyle) {
					ovrOptions.lineStyle = inputData.overlays[m].lineStyle;
					if (this.opts.lineStyles) {
						try{
							if (inputData.overlays[m].lineStyle == 'solid') {
								ovrOptions.icons = [];
								ovrOptions.strokeOpacity = ovrOptions._strokeOpacity || 1;
							} else {
								ovrOptions.icons = this.opts.lineStyles[inputData.overlays[m].lineStyle](this.activeItem.strokeWeight || this.shapeDefaults.strokeWeight);
								ovrOptions._strokeOpacity = ovrOptions.strokeOpacity;
								ovrOptions.strokeOpacity = 0;
							}
						} catch(e){}
					};
				}

				tmpOverlay = new google.maps.Polyline(ovrOptions);
			} else if (inputData.overlays[m].type == "rectangle") {
				var tmpBounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(inputData.overlays[m].bounds.sw.lat, inputData.overlays[m].bounds.sw.lng),
					new google.maps.LatLng(inputData.overlays[m].bounds.ne.lat, inputData.overlays[m].bounds.ne.lng));
				ovrOptions.bounds = tmpBounds;
				tmpOverlay = new google.maps.Rectangle(ovrOptions);

			} else if (inputData.overlays[m].type == "circle") {
				var cntr = new google.maps.LatLng(inputData.overlays[m].center.lat, inputData.overlays[m].center.lng);
				ovrOptions.center = cntr;
				ovrOptions.radius = inputData.overlays[m].radius;
				tmpOverlay = new google.maps.Circle(ovrOptions);

			} else if (inputData.overlays[m].type == "marker") {
				var pos = new google.maps.LatLng(inputData.overlays[m].position.lat, inputData.overlays[m].position.lng);
				ovrOptions.position = pos;
				if (inputData.overlays[m].icon) {
					ovrOptions.icon = inputData.overlays[m].icon;
				}
				if (this.markerIcons && inputData.overlays[m].iconId) {

					ovrOptions.iconId = parseInt(inputData.overlays[m].iconId);
					ovrOptions.iconOverPoint = !!inputData.overlays[m].iconOverPoint;
					var icon = this.markerIcons.getById(ovrOptions.iconId);
					if (icon) {
						if (ovrOptions.iconOverPoint) {
							ovrOptions.icon = {
								url: icon.thumb,
								// size: new google.maps.Size(71, 71),
								// origin: new google.maps.Point(0, 0),
								anchor: new google.maps.Point(icon.width/2, icon.height/2),
								// scaledSize: new google.maps.Size(36, 36)
							};
						} else {
							ovrOptions.icon = {
								url: icon.thumb
							};
						}
					} else {
						ovrOptions.iconId = 0;
						ovrOptions.icon = {
							url: this.markerIcons.getById(0).thumb
						};
					}
				}
				tmpOverlay = new google.maps.Marker(ovrOptions);
			}
			tmpOverlay.type = inputData.overlays[m].type;
			tmpOverlay.setMap(this.map);

			if (inputData.overlays[m].title) {
				tmpOverlay.title = inputData.overlays[m].title;
			} else {
				tmpOverlay.title = "";
			}
			if (inputData.overlays[m].content) {
				tmpOverlay.content = inputData.overlays[m].content;
			} else {
				tmpOverlay.content = "";
			}
			if (inputData.overlays[m].contId) {
				tmpOverlay.contId = inputData.overlays[m].contId;
			} else {
				tmpOverlay.contId = "";
			}
			if (inputData.overlays[m].catId) {
				tmpOverlay.catId = inputData.overlays[m].catId;
			} else {
				tmpOverlay.catId = "";
			}
			if (inputData.overlays[m].id) {
				tmpOverlay.id = inputData.overlays[m].id;
			} else {
				tmpOverlay.id = "";
			}
			this.overlayAdded(tmpOverlay.type, tmpOverlay);
		}
	},
	fromJSONString: function(jsonString) {
		//
		this.fromObject(JSON.parse(jsonString));
	},
	toObject: function() {
		var tmpMap = new Object;
		var tmpOverlay, paths;
		tmpMap.zoom = this.map.getZoom();
		tmpMap.tilt = this.map.getTilt();
		tmpMap.mapTypeId = this.map.getMapTypeId();
		tmpMap.center = {
			lat: this.map.getCenter().lat(),
			lng: this.map.getCenter().lng()
		};
		tmpMap.overlays = new Array();
		for (var i = 0; i < this.shapes.length; i++) {
			if (this.shapes[i].getMap() == null) {
				continue;
			}
			tmpOverlay = new Object;
			tmpOverlay.type = this.shapes[i].type;
			tmpOverlay.title = this.shapes[i].title;
			tmpOverlay.content = this.shapes[i].content;
			if (this.shapes[i].fillColor) {
				tmpOverlay.fillColor = this.shapes[i].fillColor;
			}
			if (this.shapes[i].fillOpacity) {
				tmpOverlay.fillOpacity = this.shapes[i].fillOpacity;
			}
			if (this.shapes[i].strokeColor) {
				tmpOverlay.strokeColor = this.shapes[i].strokeColor;
			}
			if (this.shapes[i].strokeOpacity) {
				tmpOverlay.strokeOpacity = this.shapes[i].strokeOpacity;
			}
			if (this.shapes[i].strokeWeight) {
				tmpOverlay.strokeWeight = this.shapes[i].strokeWeight;
			}
			if (this.shapes[i].icon) {
				tmpOverlay.icon = this.shapes[i].icon;
			}
			if (this.shapes[i].iconId) {
				tmpOverlay.iconId = this.shapes[i].iconId;
			}
			if (this.shapes[i].lineStyle) {
				tmpOverlay.lineStyle = this.shapes[i].lineStyle;
			}
			if (this.shapes[i].flat) {
				tmpOverlay.flat = this.shapes[i].flat;
			}
			if (this.shapes[i].type == "polygon") {
				tmpOverlay.paths = new Array();
				paths = this.shapes[i].getPaths();
				for (var j = 0; j < paths.length; j++) {
					tmpOverlay.paths[j] = new Array();
					for (var k = 0; k < paths.getAt(j).length; k++) {
						tmpOverlay.paths[j][k] = {
							lat: paths.getAt(j).getAt(k).lat().toString(),
							lng: paths.getAt(j).getAt(k).lng().toString()
						};
					}
				}
			} else if (this.shapes[i].type == "polyline") {
				tmpOverlay.path = new Array();
				path = this.shapes[i].getPath();
				for (var j = 0; j < path.length; j++) {
					tmpOverlay.path[j] = {
						lat: path.getAt(j).lat().toString(),
						lng: path.getAt(j).lng().toString()
					};
				}
			} else if (this.shapes[i].type == "circle") {
				tmpOverlay.center = {
					lat: this.shapes[i].getCenter().lat(),
					lng: this.shapes[i].getCenter().lng()
				};
				tmpOverlay.radius = this.shapes[i].radius;
			} else if (this.shapes[i].type == "rectangle") {
				tmpOverlay.bounds = {
					sw: {
						lat: this.shapes[i].getBounds().getSouthWest().lat(),
						lng: this.shapes[i].getBounds().getSouthWest().lng()
					},
					ne: {
						lat: this.shapes[i].getBounds().getNorthEast().lat(),
						lng: this.shapes[i].getBounds().getNorthEast().lng()
					}
				};
			} else if (this.shapes[i].type == "marker") {
				tmpOverlay.position = {
					lat: this.shapes[i].getPosition().lat(),
					lng: this.shapes[i].getPosition().lng()
				};
			}
			tmpMap.overlays.push(tmpOverlay);
		}
		return tmpMap;
	},
	toJSONString: function(){
		//
		return JSON.stringify(this.toObject());
	},
	showMarker: function(overlay, mt){
		if (overlay.content) {
			this.infowindow.close();
			this.infowindow.setContent(overlay.content);
			this.infowindow.open(this.map, overlay);
		}
	},
	overlayAdded: function(type, overlay){
		var newShape = overlay;
		if (type == 'marker') {
			var hendler = R.partial(R.bind(this.showMarker, this), overlay);
			google.maps.event.addListener(overlay, 'click', hendler);
		};
		newShape.type = type;
		this.shapes.push(newShape);
		return newShape;
	},
	changeMapType: function(type){
		this.map.setMapTypeId(google.maps.MapTypeId[type.toUpperCase()]);
	}
});

googleMap.Legend = Class({
	'protected wrapper': null,
	'protected list': null,
	'protected nav': null,
	'protected collapseBtn': null,
	__construct: function(wrapper, list, nav, collapseBtn){
		this.wrapper = wrapper;
		this.list = list;
		this.nav = nav;
		this.collapseBtn = collapseBtn;
		$(this.list).append($(this.nav).find('> ul > li > ul > li.has_childs').clone());
		$(this.list).find('> li > a').click($.proxy(this.click, this));
		$(this.list).find('> li > ul a').removeAttr('href');

		$(this.collapseBtn).click(R.bind(this.toggleCollapse, this));

	},


	'protected afterCollapse': function() {
		$(this.collapseBtn).addClass('expand');
		$(this.wrapper).addClass('collapsed');
	},
	'protected toggleCollapse': function() {
		if ($(this.collapseBtn).hasClass('expand')) {
			$(this.wrapper).removeClass('collapsed');
			$(this.wrapper).slideDown();
			$(this.collapseBtn).removeClass('expand');
		} else {
			$(this.wrapper).slideUp(R.bind(this.afterCollapse, this));
		}
	},
	'protected click': function(e) {
		e.preventDefault();
		var li = $(e.target).parent();
		li.siblings().removeClass('active');
		li.addClass('active');
	},
	show: function(selector){
		var li = $(this.list).find(selector);
		if (li.length) {
			li.addClass('visible');
			if ( ! $(this.list).find('.active').length) {
				this.showFirstVisible();
			};
			if ( ! $(this.wrapper).is(':visible')) {
				$(this.wrapper).slideDown();
				$(this.wrapper).addClass('visible');
			};
		};
	},
	hide: function(selector){
		$(this.list).find(selector).removeClass('visible');
		this.showFirstVisible();

		if ( ! $(this.list).find('.visible').length) {
			if ($(this.wrapper).is(':visible')) {
				$(this.wrapper).slideUp();
				$(this.wrapper).removeClass('visible');
			}
		};
	},
	showCat: function(catId){
		this.show('[data-id='+ catId +']');
	},
	hideCat: function(catId){
		this.hide('[data-id='+ catId +']');
	},
	showFirstVisible: function(){
		$(this.list).find('.visible a').first().click();
	}
});

googleMap.MarkerIcons = Class({
	'protected icons': [{
		id: 0,
		thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
		title: 'default',
		width: 22,
		height: 40,
	}],
	__construct: function(icons){
		this.icons = R.concat(this.icons, icons || []);
	},
	get: function(index){
		return this.icons[index];
	},
	getById: function(id){
		return R.find(R.propEq('id', id), this.icons);
	},
});

