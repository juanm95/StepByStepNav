vectorScalar = 10000;
vectorColor = 'purple';
epsilon = .001;
endDestination = 'Los Angeles'
var map;
steps = {}; //An array of steps that lead up to the destination.
directionServ = {};
step = 0;
function initMap() {
  directionServ = new google.maps.DirectionsService();
  if (navigator.geolocation) {
    $('#query').blur(function() {
      endDestination = $('#query').val();
      if (watchId) navigator.geolocation.clearWatch(watchId);
      navigator.geolocation.getCurrentPosition(initNavigation);
    })
    navigator.geolocation.getCurrentPosition(initNavigation);
  } else {
    $('#directions').html("Sorry, doesn't work");
  }
}
function initNavigation(position) {
  directionServ.route({
    origin: position.coords.latitude + "," + position.coords.longitude
    , destination: endDestination
    , travelMode: google.maps.TravelMode.WALKING
  }, directionsCallback);
}
function getDirections(position) {
  if (withinRadius(steps[step], position)) {
    step++;
    render(steps[step]);
  } else {
    console.log("still on the way");
  };
}
function render(step) {
  $('#directions').html(step.instructions);
  var startLat = step.start_location.lat();
  var startLng = step.start_location.lng();
  var endLat = step.end_location.lat();
  var endLng = step.end_location.lng();
  var myLatlng = new google.maps.LatLng(startLat, startLng);
  var mapOptions = {
    zoom: 18,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);
  // Define a symbol using a predefined path (an arrow)
  // supplied by the Google Maps JavaScript API.
  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };

  // Create the polyline and add the symbol via the 'icons' property.
  var line = new google.maps.Polyline({
    strokeColor: vectorColor,
    path: [{lat: startLat, lng: startLng}, normalizedEndPoints(startLat, startLng, endLat, endLng)],
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    map: map
  });
}
function normalizedEndPoints(x1, y1, x2, y2) {
  x2 -= x1;
  y2 -= y1;
  var magnitude = Math.sqrt(x2*x2 + y2*y2);
  magnitude = magnitude * vectorScalar;
  x2 = x2/magnitude;
  y2 = y2/magnitude;
  x2 += x1;
  y2 += y1;
  return {lat: x2, lng: y2};
}
function directionsCallback(result, status) {
  if (status === 'OK') {
    steps = result.routes[0].legs[0].steps;
    render(steps[step]);
    watchId = navigator.geolocation.watchPosition(getDirections);
  } else {
    alert("No result returned :(");
  }
}
function withinRadius(step, position) {
  var x1 = step.end_location.lat();
  var x2 = position.coords.latitude;
  var y1 = step.end_location.lng();
  var y2 = position.coords.longitude;
  return (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2),2)) <= epsilon);
}
