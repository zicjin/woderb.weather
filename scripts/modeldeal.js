// Methods for dealing with the model

app.getForecast = function(key, label, name) {
  var statement = 'select * from weather.forecast where woeid=' + key + ' and u="c"';
  var url = 'https://query.yahooapis.com/v1/public/yql?format=json&lang=zh-CN&q=' + statement;
  // TODO add cache logic here
  if ('caches' in window) {
    caches.match(url).then(function(response) {
      if (response) {
        response.json().then(function(json) {
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
        app.getForecastWaqi(key, name);
      }
    }
  };
  request.open('GET', url);
  request.send();
};

app.getForecastWaqi = function (key, name) {
  var url = 'http://api.waqi.info/feed/' + name + '/?token=830730e92b561a7394156358ba9bd9f3e546cbd0';
  if ('caches' in window) {
    caches.match(url).then(function(response) {
      if (response) {
        response.json().then(function(json) {
          app.updateForecastWaqi(key, json.data);
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
        app.updateForecastWaqi(key, response.data);
      }
    }
  };
  request.open('GET', url);
  // request.withCredentials = false;
  // request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.send();
};


// Iterate all of the cards and attempt to get the latest forecast data
app.updateForecasts = function() {
  var keys = Object.keys(app.visibleCards);
  keys.forEach(function (key) {
    var data = app.visibleCards[key]
    app.getForecast(key, data.label, data.name);
  });
};

// TODO add saveSelectedCities function here
// Save list of cities to localStorage.
app.saveSelectedCities = function() {
  var selectedCities = JSON.stringify(app.selectedCities);
  localStorage.selectedCities = selectedCities;
};

