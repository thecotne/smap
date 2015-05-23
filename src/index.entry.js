import {Map} from './base';

var mapWrapper = document.getElementById('map');

var mapOptions = {
	overlays: [
		{
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
		}
	]
};

var _map = new Map(mapWrapper, mapOptions);

