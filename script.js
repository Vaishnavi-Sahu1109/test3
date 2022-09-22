//javascript.js
//set map options

const kmMsg = document.querySelector(".km");
let km;

let myLatLng = { lat: 26.8467, lng: 80.9462 };
let mapOptions = {
  center: myLatLng,
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};

//create map
let map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
let directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
let directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

// selected vehical
let selectedClass;
const allVehical = document.querySelectorAll(".vehical-bar>div");
allVehical.forEach((e) => {
  e.addEventListener("click", (e) => {
    selectedClass = e.path[1].classList;
    selectedClass.forEach(
      (c) =>
        (c === "tucsonCar" || c === "dzireCar" || c === "mercedesCar") &&
        priceCalculate(c)
    );
  });
});

const priceByCar = [
  {
    name: "tucsonCar",
    displayName: "Tucson",
    baseprice: 60,
    perkm: 30,
    img: `<img src="./assets/tucson.png" alt="">`,
  },
  {
    name: "dzireCar",
    displayName: "Dzire",
    baseprice: 50,
    perkm: 25,
    img: `<img src="./assets/dzire.png" alt="">`,
  },
  {
    name: "mercedesCar",
    displayName: "Mercedes",
    baseprice: 100,
    perkm: 60,
    img: `<img src="./assets/mercedes.png" alt="">`,
  },
];
// price calculate for any car
function priceCalculate(car) {
  const selectedCar = priceByCar.find((carObject) => {
    return carObject.name === car;
  });

  document.querySelector(".car").innerHTML = "by " + selectedCar.displayName;

  const calculatedFare =
    Math.floor(km * selectedCar.perkm) + selectedCar.baseprice;

  const farePriceSpan = document.querySelector(".fare-price-span");
  farePriceSpan.innerHTML = calculatedFare;

  document.querySelector(".selected-car").innerHTML = selectedCar.img;
}

//define calcRoute function
function calcRoute() {
  directionsDisplay.setMap(map);

  //create request
  let request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // my--------------
      const detailsContainer = document.querySelector(".details-container");
      const fareContainer = document.querySelector(".fare-container");

      detailsContainer.classList.remove("hidden");
      fareContainer.classList.remove("hidden");

      km = result.routes[0].legs[0].distance.value / 1000;

      // calculate fare
      const calculatedFare =
        Math.floor((result.routes[0].legs[0].distance.value / 1000) * 30) + 60;

      const farePriceSpan = document.querySelector(".fare-price-span");
      farePriceSpan.innerHTML = calculatedFare;

      detailsContainer.innerHTML = `<div class="distance-container">
          <p>Distance</p>
          <div class="distance-from">from : <br /> <span class="distance-from-span">${
            document.getElementById("from").value
          }</span></div>
          <div class="distance-to">to : <br /> <span class="distance-to-span">${
            document.getElementById("to").value
          }</span></div>

          <div class="distance">${result.routes[0].legs[0].distance.text}</div>
      </div>

      <div class="separator"></div>

      <div class="duration-container">
          <p>Duration</p>
          <div class="vehical">by <span class="vehical-span">Sedan</span></div>

          <div class="duration">${result.routes[0].legs[0].duration.text}</div>
      </div>`;

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
let options = {
  types: ["(cities)"],
};

let input1 = document.getElementById("from");
let autocomplete1 = new google.maps.places.Autocomplete(input1, options);

let input2 = document.getElementById("to");
let autocomplete2 = new google.maps.places.Autocomplete(input2, options);

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
