var buttonEl = document.getElementById("search-btn");
var cityHistoryEl = document.getElementById("recent-search");

var indexes = [0, 7, 15, 23, 31, 39];

// Set up arrays of references to HTML elements
var daysData = [
  document.getElementById("day"),
  document.getElementById("day1"),
  document.getElementById("day2"),
  document.getElementById("day3"),
  document.getElementById("day4"),
  document.getElementById("day5"),
];

var temperatureEls = [
  document.getElementById("temperature"),
  document.getElementById("temperature1"),
  document.getElementById("temperature2"),
  document.getElementById("temperature3"),
  document.getElementById("temperature4"),
  document.getElementById("temperature5"),
];

var weatherIconEls = [
  document.getElementById("weather-icon"),
  document.getElementById("day-icon1"),
  document.getElementById("day-icon2"),
  document.getElementById("day-icon3"),
  document.getElementById("day-icon4"),
  document.getElementById("day-icon5"),
];

var humidityIds = [
  document.getElementById("humid"),
  document.getElementById("humidity1"),
  document.getElementById("humidity2"),
  document.getElementById("humidity3"),
  document.getElementById("humidity4"),
  document.getElementById("humidity5"),
];

var windIds = [
  document.getElementById("wind"),
  document.getElementById("wind1"),
  document.getElementById("wind2"),
  document.getElementById("wind3"),
  document.getElementById("wind4"),
  document.getElementById("wind5"),
];

// Get reference to HTML element where weather information will be displayed
var weatherDisplayEl = document.getElementById("displayweather");
var weatherIconEl = document.getElementById("weather-icon");

// Set API key and initialize empty arrays for cities, city history, and weather data
var apiKey = "4019261bd78cd50daccdfd0a8e4719ed";
var cities = [];
var cityHistory = [];
var temperatures = [6];
var humidities = [6];
var winds = [6];
var dates = [6];

// Function to get the latitude and longitude for a given city
function getLocation(city) {
  console.log("hello");
  var locationUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;
  // Fetch data from the API and return a JSON object
  fetch(locationUrl)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data[0]);
      console.log(data[0].name);
      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeather(lat, lon);
    });
}

// Function to get the weather data for a given latitude and longitude
function getWeather(lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric" +
    "&lang=english" +
    "&appid=" +
    apiKey;
  fetch(weatherUrl)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      console.log(data);
      displayWeather(data);
    });
}

// Function to display weather data
function displayWeather(data) {
  console.log(data);
  // Extract the relevant weather data from the API response
  var city = data.city.name;
  cityHistoryEl.textContent = "";

  // Loop through the first 6 items in the API response and extract the temperature, humidity, wind speed, and date
  for (let i = 0; i < 6; i++) {
    temperatures[i] = data.list[indexes[i]].main.temp;
    humidities[i] = data.list[indexes[i]].main.humidity;
    winds[i] = data.list[indexes[i]].wind.speed;
    dates[i] = new Date(data.list[indexes[i]].dt * 1000);
  }

  // Add the first 5 items in the API response to the "cities" array
  for (let i = 0; i < 5; i++) {
    cities.push(data.list[i]);
  }

  // Update the DOM elements with the relevant weather data
  for (let i = 0; i < 6; i++) {
    humidityIds[i].textContent = "Humidity = " + humidities[i] + "%";
    windIds[i].textContent = "Wind Speed =" + winds[i] + "KM/H";
    temperatureEls[i].textContent = "Temperature = " + temperatures[i] + "°C";
    daysData[i].textContent =
      "City Day: " + city + " " + dates[i].toLocaleDateString();
    weatherIconEls[i].setAttribute(
      "src",
      `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`
    );
  }
}

// Event listener for the search button
var buttonsIds = document.getElementById("search-btn");
buttonsIds.addEventListener("click", function () {
  var searchQuery = document.getElementById("search-input").value;
  getLocation(searchQuery);

  if (cityHistory.length < 3) {
    console.log(cityHistory);
    cityHistory.unshift(searchQuery);
    console.log(cityHistory);
  } else {
    cityHistory.length = cityHistory.length - 1;
    cityHistory.unshift(searchQuery);
  }

  displayHis();
  updateHist(cityHistory);
});

var cityHistory = JSON.parse(localStorage.getItem("History")) || [];

// Function to print the city history on the page
function displayHis() {
  cityHistoryEl.innerHTML = "";
  let unique = cityHistory.filter((item, i, ar) => ar.indexOf(item) === i);
  for (let i = 0; i < unique.length; i++) {
    const list = document.createElement("li");
    list.setAttribute("id", cityHistory[i]);
    cityHistoryEl.appendChild(list);
    const container = document.getElementById(cityHistory[i]);
    const button = document.createElement("button");
    button.setAttribute("value", cityHistory[i]);
    button.textContent = cityHistory[i];
    container.appendChild(button);
    button.addEventListener("click", function (event) {
      const city = event.target.value;
      console.log(city);
      getLocation(city);
    });
  }
}

// Function to update the city history in local storage
function updateHist(searchQuery) {
  localStorage.setItem("History", JSON.stringify(searchQuery));
  displayHis();
}


displayHis();

