/**
 * lineStyles
 * @namespace lineStyles
 */
export var lineStyles = {
	solid (strokeWeight) {},
	dashed (strokeWeight) {
		return [{
			icon: {
				path: 'M 0,-2 0,2',
				strokeOpacity: 1,
			},
			repeat: strokeWeight*10 +'px'
		}];
	},
	doted (strokeWeight) {
		return [{
			icon: {
				path: 'M -0.5,-0.5 0.5,-0.5, 0.5,0.5 -0.5,0.5',
				fillOpacity: 1,
				scale: strokeWeight
			},
			repeat: strokeWeight*3 +'px'
		}];
	},
};
