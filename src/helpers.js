export var latLng = latLng => new google.maps.LatLng(latLng.lat, latLng.lng);
export var latLngBounds = bounds => new google.maps.LatLngBounds(latLng(bounds.sw), latLng(bounds.ne));
