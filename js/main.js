var map;
steps = {}; //An array of steps that lead up to the destination.
directionServ = {};
step = 0;
function initMap() {
  directionServ = new google.maps.DirectionsService();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initNavigation);
  } else {
    alert("Sorry, doesn't work")
  }
}
function initNavigation(position) {
  directionServ.route({
    origin: position.coords.latitude + "," + position.coords.longitude
    , destination: 'Los Angeles'
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
}
function directionsCallback(result, status) {
  steps = result.routes[0].legs[0].steps;
  $('#directions').html(steps[0].instructions);
  navigator.geolocation.watchPosition(getDirections);
}
function withinRadius(step, position) {
  var epsilon = .001;
  var x1 = step.end_location.lat();
  var x2 = position.coords.latitude;
  var y1 = step.end_location.lng();
  var y2 = position.coords.longitude;
  return (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2),2)) <= epsilon);
}