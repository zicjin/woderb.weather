// Methods for dealing with the model

/*
  * Gets a forecast for a specific city and updates the card with the data.
  * getForecast() first checks if the weather data is in the cache. If so,
  * then it gets that data and populates the card with the cached data.
  * Then, getForecast() goes to the network for fresh data. If the network
  * request goes through, then the card gets updated a second time with the
  * freshest data.
  */
app.getForecast = function(key, label) {
  var statement = 'select * from weather.forecast where woeid=' + key;
  var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;
  // TODO add cache logic here
  if ('caches' in window) {
    /*
      * Check if the service worker has already cached this city's weather
      * data. If the service worker has the data, then display the cached
      * data while the app fetches the latest data.
      */
    caches.match(url).then(function(response) {
      if (response) {
        response.json().then(function updateFromCache(json) {
          var results = json.query.results;
          results.key = key;
          results.label = label;
          results.created = json.query.created;
          app.updateForecastCard(results);
        });
      }
    });
  }
  // Fetch the latest data.
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        var response = JSON.parse(request.response);
        var results = response.query.results;
        results.key = key;
        results.label = label;
        results.created = response.query.created;
        app.updateForecastCard(results);
      }
    } else {
      // Return the initial weather forecast since no data is available.
      console.error("no data is available")
    }
  };
  request.open('GET', url);
  request.send();
};

// Iterate all of the cards and attempt to get the latest forecast data
app.updateForecasts = function() {
  var keys = Object.keys(app.visibleCards);
  keys.forEach(function(key) {
    app.getForecast(key);
  });
};

// TODO add saveSelectedCities function here
// Save list of cities to localStorage.
app.saveSelectedCities = function() {
  var selectedCities = JSON.stringify(app.selectedCities);
  localStorage.selectedCities = selectedCities;
};

app.getIconClass = function(weatherCode) {
  // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
  weatherCode = parseInt(weatherCode);
  switch (weatherCode) {
    case 25: // cold
    case 32: // sunny
    case 33: // fair (night)
    case 34: // fair (day)
    case 36: // hot
    case 3200: // not available
      return 'clear-day';
    case 0: // tornado
    case 1: // tropical storm
    case 2: // hurricane
    case 6: // mixed rain and sleet
    case 8: // freezing drizzle
    case 9: // drizzle
    case 10: // freezing rain
    case 11: // showers
    case 12: // showers
    case 17: // hail
    case 35: // mixed rain and hail
    case 40: // scattered showers
      return 'rain';
    case 3: // severe thunderstorms
    case 4: // thunderstorms
    case 37: // isolated thunderstorms
    case 38: // scattered thunderstorms
    case 39: // scattered thunderstorms (not a typo)
    case 45: // thundershowers
    case 47: // isolated thundershowers
      return 'thunderstorms';
    case 5: // mixed rain and snow
    case 7: // mixed snow and sleet
    case 13: // snow flurries
    case 14: // light snow showers
    case 16: // snow
    case 18: // sleet
    case 41: // heavy snow
    case 42: // scattered snow showers
    case 43: // heavy snow
    case 46: // snow showers
      return 'snow';
    case 15: // blowing snow
    case 19: // dust
    case 20: // foggy
    case 21: // haze
    case 22: // smoky
      return 'fog';
    case 24: // windy
    case 23: // blustery
      return 'windy';
    case 26: // cloudy
    case 27: // mostly cloudy (night)
    case 28: // mostly cloudy (day)
    case 31: // clear (night)
      return 'cloudy';
    case 29: // partly cloudy (night)
    case 30: // partly cloudy (day)
    case 44: // partly cloudy
      return 'partly-cloudy-day';
  }
};