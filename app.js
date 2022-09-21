var directionsService, directionsRenderer;
function initMap() {
  // source Prediction autcomplete
  source = new google.maps.places.Autocomplete(document.getElementById("from"));
  // source Prediction autcomplete

  // destination Prediction autcomplete
  destination = new google.maps.places.Autocomplete(
    document.getElementById("to")
  );
  // destination Prediction autcomplete

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom: 7,
    center: chicago,
  };
  var map = new google.maps.Map(
    document.getElementById("map-container"),
    mapOptions
  );
  directionsRenderer.setMap(map);
}

function km_change() {
  document.getElementById("perkm_value").innerHTML =
    document.getElementById("km").value;
  calcRoute();
}
function person_change() {
  document.getElementById("person_value").innerHTML =
    document.getElementById("persons").value;
  calcRoute();
}

function calcRoute() {
  var start = document.getElementById("from").value;
  var end = document.getElementById("to").value;

  if (start != "" && end != "") {
    document.getElementById("bg").style.backgroundSize = "cover";
    document.getElementById("wrap").style.width = "100%";
    document.getElementById("wrap").style.gridTemplateColumns = "1fr 1fr";
    document.getElementById("map-container").style.display = "inline-block";
    document.getElementById("choose-cat").style.gridColumn = "1 / span 3";
    document.getElementById("logo").style.gridColumn = "1 / span 3";
    document.getElementById("choose-cat").style.display = "block";
    document.getElementsByClassName("flex-inside-container")[0].style.display =
      "flex";
  }

  var request = {
    origin: start,
    destination: end,
    travelMode: "DRIVING",
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  };

  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      var distance = Math.round(result.routes[0].legs[0].distance.value / 1000);
      var time = (result.routes[0].legs[0].duration.value / 3600).toFixed(2);
      var fare = distance * document.getElementById("km").value;

      document.getElementById("distance").innerHTML = ` : ${distance} Km `;
      document.getElementById("time").innerHTML = ` : ${time} Hours `;
      document.getElementById("fare").innerHTML = ` : Rs. ${fare} `;

      directionsRenderer.setDirections(result);
    } else {
      directionsDisplay.setDirections({ routes: [] });
      map.center(chicago);
    }
  });
}
