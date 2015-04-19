var queryString = function () {
	var queryString = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (typeof queryString[pair[0]] === "undefined") {
			queryString[pair[0]] = pair[1];
		} else if (typeof queryString[pair[0]] === "string") {
			var arr = [queryString[pair[0]], pair[1]];
			queryString[pair[0]] = arr;
		} else {
			queryString[pair[0]].push(pair[1]);
		}
	}
	return queryString;
}();
function curry (fn, that) {
	var numargs = fn.length;
	var _this = this;
	return createRecurser([]);

	function createRecurser (acc) {
		return function () {
			var args = [].slice.call(arguments);
			return recurse(acc, args);
		};
	}

	function recurse (acc, args) {
		var newacc = acc.concat(args);
		if (newacc.length < numargs) {
			return createRecurser(newacc);
		}
		else {
			return fn.apply(_this, newacc);
		}
	}
}

function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}

function launchFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

function isFullScreen(){
	return !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement
}

function toggleFullScreen(element) {
	if ( isFullScreen() ) {
		launchFullscreen(element)
	} else {
		exitFullscreen();
	}
}

var spectrum_config = {
	allowEmpty: true,
	color: "#ECC",
	showInput: true,
	containerClassName: "full-spectrum",
	showInitial: true,
	showPalette: true,
	showSelectionPalette: true,
	showAlpha: true,
	maxPaletteSize: 10,
	preferredFormat: "hex",
	localStorageKey: "spectrum.demo",
	move: function (color) {
		// updateBorders(color);
	},
	show: function () {

	},
	beforeShow: function () {

	},
	hide: function (color) {
		// updateBorders(color);
	},

	palette: [
		["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/
			"rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"
		],
		["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"
		],
		["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			/*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
			"rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"
		]
	]
};




(function($) {
	$.fn.mapEditor = function(opts) {
		var MapEditor = Class({
			'private wrapper': null,
			'private opts': null,
			'private map': null,
			'private contextmenu': null,
			'private activeItem': null,
			'private fields': {},
			'private shapeDefaults': {
				fillColor: '#000',
				fillOpacity: 0.5,
				strokeColor: '#000',
				strokeOpacity: 1,
				strokeWeight: 2,
				zIndex: 0,
				editable: false,
				draggable: false,
				iconId: 0,
				lineStyle: 'solid',
			},
			'private shapes': [],
			'private sidebar': null,
			'private markerHighlight': null,

			__construct: function(wrapper, opts) {
				this.wrapper = wrapper[0];
				this.opts = $.extend({}, opts);

				// this.opts.markerIcons = $.extend({0:'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}, this.opts.markerIcons || {});

				this.opts.markerIcons = [{
					id: 0,
					thumb: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
					title: 'default',
					width: 22,
					height: 40,
				}].concat(this.opts.markerIcons || []);

				this.opts.lineStyles = $.extend({
					solid: function(){},
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
				}, this.opts.lineStyles || {});

				google.maps.event.addDomListener(window, 'load', this.initializeMap.bind(this));
			},
			initializeMap: function() {
				var mapOptions = {
					center: new google.maps.LatLng(42.110449, 44.004879),
					zoom: 8,
					disableDefaultUI: true,
				};

				this.map = new google.maps.Map(this.wrapper, mapOptions);

				this.drawingManager = new google.maps.drawing.DrawingManager({
					// drawingMode: google.maps.drawing.OverlayType.MARKER,
					drawingControl: true,
					drawingControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_LEFT,
						drawingModes: [
							google.maps.drawing.OverlayType.MARKER,
							google.maps.drawing.OverlayType.CIRCLE,
							google.maps.drawing.OverlayType.POLYGON,
							google.maps.drawing.OverlayType.POLYLINE,
							google.maps.drawing.OverlayType.RECTANGLE
						]
					},
					markerOptions: {
						// editable: true,
						// draggable: true,
					},
					polygonOptions: this.shapeDefaults,
					polylineOptions: this.shapeDefaults,
					rectangleOptions: this.shapeDefaults,
					circleOptions: this.shapeDefaults,
				});
				this.drawingManager.setMap(this.map);

				google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.overlayComplete.bind(this));
				google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', this.clearSelection.bind(this));
				google.maps.event.addListener(this.map, 'click', this.clearSelection.bind(this) );





				this.markerHighlight = new google.maps.Marker({
					position: new google.maps.LatLng(0, 0),
					visible: false,
					map: this.map,
					icon: {
						path:  '\
								m -75, -70\
								a 75,75 0 1,0 150,0\
								a 75,75 0 1,0 -150,0',
						fillColor: "#ffffff",
						fillOpacity: 0.47,
						strokeColor: "#ffffff",
						strokeOpacity: 1,
						strokeWeight: 2,
						lineStyle: "solid",
						scale: 0.3
					}
				});
				// this.markerHighlight.setMap(this.map);

				this.addButton('fullscreen', 'bottom_left', this.toggleFullScreen.bind(this));
				this.addButton('delete', 'bottom_left', this.deleteSelectedShape.bind(this), 'trash');

				Mousetrap.bind('del', this.deleteSelectedShape.bind(this));

				if (this.opts.json) {
					this.fromJSONString(this.opts.json);
				};
				this.leftPanel();

			},
			setSelection: function (shape) {
				this.clearSelection();
				this.activeItem = shape;
				this.activeItem.setEditable &&
					this.activeItem.setEditable(true);
				this.activeItem.setDraggable &&
					this.activeItem.setDraggable(true);

				this.reflectColor('fill', shape);
				this.reflectColor('stroke', shape);
				this.reflectInput('strokeWeight', shape);
				this.reflectInput('zIndex', shape);
				this.reflectLatLng(shape);
				this.reflectLineStyle(shape);
				this.reflectIcon(shape);
				this.reflectIconOverPoint(shape);

				this.sidebar.dataset.shapeType = shape.type;

				if (shape.type == 'marker') {
					this.sidebar.classList.remove('shape');
					this.sidebar.classList.add('marker');

					var loc = shape.getPosition();
					this.markerHighlight.setPosition(new google.maps.LatLng(loc.lat(), loc.lng()));
					this.markerHighlight.setVisible(true);
					// debugger;
					this.fields.iconOverPoint.checked = !!shape.iconOverPoint;
					$(this.fields.icon).trigger('change');
				} else {
					this.sidebar.classList.remove('marker');
					this.sidebar.classList.add('shape');
				}
			},
			clearSelection: function () {
				if (this.activeItem) {
					this.activeItem.setEditable &&
						this.activeItem.setEditable(false);

					this.activeItem.setDraggable &&
						this.activeItem.setDraggable(false);

					this.activeItem = null;
				}
				this.sidebar.classList.remove('marker');
				this.sidebar.classList.remove('shape');

				this.markerHighlight.setVisible(false);
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
					// if (this.shapes[i].icon) {
					// 	tmpOverlay.icon = this.shapes[i].icon;
					// }
					if (this.shapes[i].iconId) {
						tmpOverlay.iconId = this.shapes[i].iconId;
					}
					if (this.shapes[i].iconOverPoint) {
						tmpOverlay.iconOverPoint = this.shapes[i].iconOverPoint;
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
				return JSON.stringify(this.toObject());
			},
			fromJSONString: function(jsonString) {
				if (typeof jsonString == 'undefined' || jsonString.length == 0) {
					return false;
				}
				var inputData = JSON.parse(jsonString);
				if (inputData.zoom) {
					this.map.setZoom(inputData.zoom);
				} else {
					this.map.setZoom(10);
				}

				if (inputData.tilt) {
					this.map.setTilt(inputData.tilt);
				} else {
					this.map.setTilt(0);
				}

				if (inputData.mapTypeId) {
					this.map.setMapTypeId(inputData.mapTypeId);
				} else {
					this.map.setMapTypeId("hybrid");
				}

				if (inputData.center) {
					this.map.setCenter(new google.maps.LatLng(inputData.center.lat, inputData.center.lng));
				} else {
					this.map.setCenter(new google.maps.LatLng(19.006295, 73.309021));
				}

				var tmpOverlay, ovrOptions;
				var properties = new Array('fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight', 'icon');
				for (var m = inputData.overlays.length - 1; m >= 0; m--) {
					ovrOptions = new Object();

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
						// debugger;
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

						if (inputData.overlays[m].iconId) {
							ovrOptions.iconId = inputData.overlays[m].iconId;
							ovrOptions.iconOverPoint = !!inputData.overlays[m].iconOverPoint;
							if (this.opts.markerIcons) {
								var icons =  $.grep(this.opts.markerIcons, function(e){ return e.id == inputData.overlays[m].iconId; })
								if (icons.length) {
									if (inputData.overlays[m].iconOverPoint) {
										ovrOptions.icon = {
											url: icons[0].thumb,
											// size: new google.maps.Size(71, 71),
											// origin: new google.maps.Point(0, 0),
											anchor: new google.maps.Point(icons[0].width/2, icons[0].height/2),
											// scaledSize: new google.maps.Size(36, 36)
										};
									} else {
										ovrOptions.icon = {
											url: icons[0].thumb
										};
									}
								};
							};
						} else {
							ovrOptions.iconId = 0;
							ovrOptions.icon = {
								url: this.opts.markerIcons[0].thumb
							};
						}

						// if (isEditable) {
						// 	ovrOptions.draggable = true;
						// }
						tmpOverlay = new google.maps.Marker(ovrOptions);

					}
					tmpOverlay.type = inputData.overlays[m].type;
					tmpOverlay.setMap(this.map);
					// if (isEditable && inputData.overlays[m].type != "marker") {
					// 	tmpOverlay.setEditable(true);
					// }

					// var uniqueid = uniqid();
					// tmpOverlay.uniqueid = uniqueid;
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

					this.overlayAdded(tmpOverlay.type, tmpOverlay);
				}
			},
			deleteSelectedShape: function (){
				if (this.activeItem) {
					this.activeItem.setMap(null);
					var index = this.shapes.indexOf(this.activeItem);
					if (index > -1) {
						this.shapes.splice(index, 1);
					};
					this.activeItem = null;
				};
				this.clearSelection();
			},
			overlayComplete: function(e){
				this.drawingManager.setDrawingMode(null);
				var newShape = this.overlayAdded(e.type, e.overlay);
				this.setSelection(newShape);
			},
			deleteVertex: function(shape, point){
				// quick fix http://goo.gl/xT4Lup
				if (point.vertex != null) {
					shape.getPath().removeAt(point.vertex);
				}
			},
			overlayAdded: function(type, overlay){
				var newShape = overlay;
				if (type == 'polygon' || type == 'polyline') {
					var _deleteVertex = curry.bind(this)(this.deleteVertex)(newShape);
					google.maps.event.addListener(newShape, 'rightclick', _deleteVertex);
				};
				newShape.type = type;
				this.shapes.push(newShape);
				google.maps.event.addListener(newShape, 'click', function() {
					this.setSelection(newShape);
				}.bind(this));

				google.maps.event.addListener(newShape, 'drag', function() {
					this.reflectLatLng(newShape);
				}.bind(this));

				return newShape;
			},
			toggleFullScreen: function(){

				toggleFullScreen(document.body);

			},
			addButton: function(name, position, callback, glyphiconName){
				var button = document.createElement('a');
				button.className = 'gm-button';
				button.title = name;
				var glyphicon = document.createElement('span');
				glyphicon.className = 'glyphicon glyphicon-'+ (glyphiconName || name);
				button.appendChild(glyphicon);
				button.addEventListener('click', callback);
				this.map.controls[google.maps.ControlPosition[position.toUpperCase()]].push(button);
			},
			createField: function(name, type, options){
				var options = options || {};
				var type = type || 'text';

				var formGroup = document.createElement('div');
				formGroup.className = 'form-group fg-'+name;
				var label = document.createElement('label');
				label.setAttribute('for', name);
				label.textContent = name;

				if (type == 'imagepicker') {
					var input = document.createElement('input');
					options.options = options.options || [];
					var data = [];
					$.each(options.options, function(k, v){
						data.push({
							id: v.id,
							text: v.title,
							image: v.thumb
						});
					});
					delete options.options;
					function format(item) {
						return "<img class=\"flag\" src=\""+item.image+"\"/>" + item.text;
					}
				} else if (type == 'select') {
					var input = document.createElement('select');
					options.options = options.options || [];
					$.each(options.options, function(key, value){
						var option = document.createElement('option');
						option.value = key;
						option.text = value;
						input.appendChild(option);
					});
				} else {
					var input = document.createElement('input');
					input.type = type;
				}
				input.className = 'form-control';
				// input.name = name;
				input.id = name;

				$(input).attr(options);
				formGroup.appendChild(label);
				formGroup.appendChild(input);
				this.fields[name] = input;

				if (type == 'imagepicker') {
					$(input).select2({
						data: {
							results: data,
						},
						formatSelection: format,
						formatResult: format
					});
				};

				return formGroup;
			},

			leftPanel: function(){
				this.sidebar = document.createElement('div');
				this.sidebar.className = 'gm-sidebar';

				var fill = this.createField('fill', 'text');
				$(this.fields.fill).spectrum(spectrum_config);

				$(this.fields.fill).on('change', curry.bind(this)(this.colorChanged)('fill'));
				this.sidebar.appendChild(fill);

				var stroke = this.createField('stroke', 'text');
				$(this.fields.stroke).spectrum(spectrum_config);

				$(this.fields.stroke).on('change', curry.bind(this)(this.colorChanged)('stroke'));
				this.sidebar.appendChild(stroke);

				var strokeWeight = this.createField('strokeWeight', 'range', {min:1, max: 3, step: 1, value: this.shapeDefaults.strokeWeight})
				$(this.fields.strokeWeight).on('input', curry.bind(this)(this.inputChanged)('strokeWeight'));
				this.sidebar.appendChild(strokeWeight);

				var zIndex = this.createField('zIndex', 'number', {min:-1000, max: 1000, step: 1, value: this.shapeDefaults.zIndex})
				$(this.fields.zIndex).on('input', curry.bind(this)(this.inputChanged)('zIndex'));
				this.sidebar.appendChild(zIndex);

				var icon = this.createField('icon', 'imagepicker', {options: this.opts.markerIcons, value: 0})
				$(this.fields.icon).on('change', curry.bind(this)(this.iconChanged)('icon'));
				this.sidebar.appendChild(icon);

				var iconOverPoint = this.createField('iconOverPoint', 'checkbox', {value: 0})
				$(this.fields.iconOverPoint).on('change', curry.bind(this)(this.iconOverPointChanged)('iconOverPoint'));
				this.sidebar.appendChild(iconOverPoint);


				var lineStyle = this.createField('lineStyle', 'select', {options: Object.keys(this.opts.lineStyles), value: 0})
				$(this.fields.lineStyle).on('change', curry.bind(this)(this.lineStyleChanged)('lineStyle'));
				this.sidebar.appendChild(lineStyle);

				var lat = this.createField('lat', 'text', {value: 0})
				$(this.fields.lat).on('input', curry.bind(this)(this.LatLngChanged)('lat'));
				this.sidebar.appendChild(lat);

				var lng = this.createField('lng', 'text', {value: 0})
				$(this.fields.lng).on('input', curry.bind(this)(this.LatLngChanged)('lng'));
				this.sidebar.appendChild(lng);

				this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(this.sidebar);

				$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', this.onFullScreen.bind(this));
			},
			LatLngChanged: function(name, e){
				var latLng = this.fields.lat.value.split(',');
				if (latLng.length >= 2) {
					var loc = new google.maps.LatLng(parseFloat(latLng[0]), parseFloat(latLng[1]));
					this.reflectLatLng(this.activeItem);
				} else {
					var loc = new google.maps.LatLng(parseFloat(this.fields.lat.value), parseFloat(this.fields.lng.value));
				}
				this.activeItem.setPosition( loc );
				this.markerHighlight.setPosition(new google.maps.LatLng(loc.lat(), loc.lng()));
			},
			lineStyleChanged: function(name, e) {
				var styleKey = Object.keys(this.opts.lineStyles)[parseInt(e.target.value)]
				var options = {};
				if (styleKey == 'solid') {
					options.icons = [];
					options.strokeOpacity = options._strokeOpacity || 1;
				} else {
					options.icons = this.opts.lineStyles[styleKey](this.activeItem.strokeWeight || this.shapeDefaults.strokeWeight);
					options._strokeOpacity = options.strokeOpacity;
					options.strokeOpacity = 0;
				}
				options.lineStyle = styleKey;
				this.activeItem.setOptions(options);
			},
			onFullScreen: function(){
				if ( ! isFullScreen() ) {
					$(document.body).addClass('map-editor-fullscreen');
				} else {
					$(document.body).removeClass('map-editor-fullscreen');
				}
			},
			reflectLatLng: function(shape){
				if (shape.getPosition) {
					var loc = shape.getPosition();
					this.fields.lat.value = loc.lat();
					this.fields.lng.value = loc.lng();

					if (shape.type == 'marker') {
						var loc = shape.getPosition();
						this.markerHighlight.setPosition(new google.maps.LatLng(loc.lat(), loc.lng()));
					};

				};
			},
			reflectColor: function(name, shape) {
				$(this.fields[name]).spectrum('set',
						tinycolor(shape[name+'Color'] || this.shapeDefaults[name+'Color'])
							.setAlpha(shape[name+'Opacity'] || this.shapeDefaults[name+'Opacity']  )
							.toRgbString());
			},
			reflectLineStyle: function(shape) {
				$(this.fields.lineStyle).val(Object.keys(this.opts.lineStyles).indexOf(shape.lineStyle || this.shapeDefaults.lineStyle));
			},
			reflectInput: function(name, shape) {
				$(this.fields[name]).val(shape[name] || this.shapeDefaults[name] );
			},

			reflectIcon: function(shape) {
				// $(this.fields.icon).val(shape.iconId || this.shapeDefaults.iconId );
				$(this.fields.icon).select2("val", shape.iconId || this.shapeDefaults.iconId);
				// debugger;
				// $(this.fields.icon).data('picker').sync_picker_with_select();
			},
			reflectIconOverPoint: function(shape){
				this.fields.iconOverPoint.checked = !!shape.iconOverPoint;
			},
			iconChanged: function(name, e) {
				if (this.activeItem) {
					var options = {};
					var id = e.target.value;
					var icons =  $.grep(this.opts.markerIcons, function(e){ return e.id == id; })
					if (icons.length) {
						if (this.activeItem.iconOverPoint) {
							options[name] = {
								url: icons[0].thumb,
								anchor: new google.maps.Point(icons[0].width/2, icons[0].height/2),
							}
							var icon = this.markerHighlight.getIcon();
							icon.anchor = new google.maps.Point(0, -60);
							this.markerHighlight.setIcon(icon);
						} else {
							options[name] = {
								url: icons[0].thumb,
								// anchor: new google.maps.Point(icons[0].width/2, icons[0].height/2),
							}
							var icon = this.markerHighlight.getIcon();
							delete icon.anchor;
							this.markerHighlight.setIcon(icon);
						}
						options[name+'Id'] = e.target.value;
						this.activeItem.setOptions(options);
					} else {
						var icon = this.markerHighlight.getIcon();
						delete icon.anchor;
						this.markerHighlight.setIcon(icon);
					}
				};
			},
			iconOverPointChanged: function(name, e){
				// debugger;
				this.activeItem.iconOverPoint = e.currentTarget.checked;
				$(this.fields.icon).trigger('change');
			},
			inputChanged: function(name, e) {
				if (this.activeItem) {
					var options = {};
					options[name] = parseFloat(e.target.value);
					this.activeItem.setOptions(options);
					if (name == 'strokeWeight') {
						$(this.fields.lineStyle).trigger('change');
					};
				};
			},
			colorChanged: function(name, e) {
				if (this.activeItem) {
					var options = {};
					options[name+'Opacity'] = $(e.target).spectrum('get')._a;
					options[name+'Color'] = e.target.value;
					this.activeItem.setOptions(options);
				};
			},
			optionChange: function(name, e) {
				if (this.activeItem) {
					var options = {};
					options[name] = e.target.value;
					this.activeItem.setOptions(options);
				};
			}
		});

		if (this.length>1) {
			var objects = [];
			$(this).each(function(){
				objects.push(new MapEditor(this, opts));
			});
			return objects;
		} else {
			return new MapEditor(this, opts);
		}
	}
})(jQuery);


