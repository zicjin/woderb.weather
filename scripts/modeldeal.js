// Methods for dealing with the model

app.getForecast = function(key, label) {
  var statement = 'select * from weather.forecast where woeid=' + key;
  var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;
  // TODO add cache logic here
  if ('caches' in window) {
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

