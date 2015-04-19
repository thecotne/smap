export var lineStyles = {
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


