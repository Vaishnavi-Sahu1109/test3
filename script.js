//javascript.js
//set map options

const kmMsg = document.querySelector(".km");

var myLatLng = { lat: 38.346, lng: -0.4907 };
var mapOptions = {
  center: myLatLng,
  zoom: 9,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};

//create map
var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

//define calcRoute function
function calcRoute() {
  directionsDisplay.setMap(map);

  //create request
  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      //Get distance and time
      const output = document.querySelector("#output");
      output.innerHTML =
        "<div> The distance between " +
        document.getElementById("from").value.bold() +
        " & " +
        document.getElementById("to").value.bold() +
        " is " +
        result.routes[0].legs[0].distance.text.bold() +
        "." +
        "<br />Duration  : " +
        result.routes[0].legs[0].duration.text.bold() +
        ".</div>";
      const manResult = result.routes[0].legs[0].distance.text;
      kmMsg.innerHTML = manResult;

      //display route
      directionsDisplay.setDirections(result);
    } else {
      //delete route from map
      directionsDisplay.setDirections({ routes: [] });
      //center map in London
      map.setCenter(myLatLng);

      //show error message
      output.innerHTML =
        "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
  });
}

//create autocomplete objects for all inputs
var options = {
  types: ["(cities)"],
};

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);

// Get current Location
const currentLocation = document.querySelector(".getCurrentLocation");
currentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    mapOptions.center.lat = position.coords.latitude;
    mapOptions.center.lng = position.coords.longitude;

    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ`
    )
      .then((response) => response.json())
      .then(
        (response) => (input1.value = response.results[1].formatted_address)
      );
  });
  map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
});

// // current position

// function success(pos) {
//   const crd = pos.coords;

//   console.log("Your current position is:");
//   console.log(`Latitude : ${crd.latitude}`);
//   console.log(`Longitude: ${crd.longitude}`);
//   console.log(`More or less ${crd.accuracy} meters.`);
// }

// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }

// navigator.geolocation.getCurrentPosition(success, error, options);
