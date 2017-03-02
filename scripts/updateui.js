// Methods to update/refresh the UI

// Toggles the visibility of the add new city dialog.
app.toggleAddDialog = function(visible) {
  if (visible) {
    app.addDialog.classList.add('dialog-container--visible');
  } else {
    app.addDialog.classList.remove('dialog-container--visible');
  }
};

// Updates a weather card with the latest weather forecast. If the card
// doesn't already exist, it's cloned from the template.
app.updateForecastCard = function(data, name) {
  var dataLastUpdated = new Date(data.created);
  var sunrise = data.channel.astronomy.sunrise;
  var sunset = data.channel.astronomy.sunset;
  var current = data.channel.item.condition;
  var humidity = data.channel.atmosphere.humidity;
  var wind = data.channel.wind;

  var card = app.visibleCards[data.key];
  if (!card) {
    card = app.cardTemplate.cloneNode(true);
    card.classList.remove('cardTemplate');
    card.querySelector('.location').textContent = data.label;
    card.removeAttribute('hidden');
    app.container.appendChild(card);
    card.name = name;
    app.visibleCards[data.key] = card;
  }

  var cardLastUpdatedElem = card.querySelector('.card-last-updated');
  var cardLastUpdated = cardLastUpdatedElem.textContent;
  if (cardLastUpdated) {
    cardLastUpdated = new Date(cardLastUpdated);
    if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
      return;
    }
  }
  cardLastUpdatedElem.textContent = data.created;

  card.querySelector('.description').textContent = current.text;
  card.querySelector('.date').textContent = current.date;
  card.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
  card.querySelector('.current .temperature .value').textContent = Math.round(current.temp);
  card.querySelector('.current .sunrise').textContent = sunrise;
  card.querySelector('.current .sunset').textContent = sunset;
  card.querySelector('.current .humidity').textContent = Math.round(humidity) + '%';
  card.querySelector('.current .wind .value').textContent = Math.round(wind.speed);
  card.querySelector('.current .wind .direction').textContent = wind.direction;
  var nextDays = card.querySelectorAll('.future .oneday');
  var today = new Date();
  today = today.getDay();
  for (var i = 0; i < 7; i++) {
    var nextDay = nextDays[i];
    var daily = data.channel.item.forecast[i];
    if (daily && nextDay) {
      nextDay.querySelector('.date').textContent = app.daysOfWeek[(i + today) % 7];
      nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
      nextDay.querySelector('.temp-high .value').textContent = Math.round(daily.high);
      nextDay.querySelector('.temp-low .value').textContent = Math.round(daily.low);
    }
  }
  if (app.isLoading) {
    app.spinner.setAttribute('hidden', true);
    app.container.removeAttribute('hidden');
    app.isLoading = false;
  }
};

app.updateForecastWaqi = function (key, data) {
  var card = app.visibleCards[key];
  if (!card) return

  var dataLastUpdated = new Date(data.time.v);
  var aqiLastUpdatedElem = card.querySelector('.aqi-last-updated');
  var aqiLastUpdated = aqiLastUpdatedElem.textContent;
  if (aqiLastUpdated) {
    aqiLastUpdated = new Date(aqiLastUpdated);
    if (dataLastUpdated.getTime() < aqiLastUpdated.getTime()) {
      return;
    }
  }
  aqiLastUpdatedElem.textContent = data.time.v;

  card.querySelector('.aqi_value').textContent = data.aqi;
  // card.querySelector('.aqi_info').textContent = data.infocn;
  // card.querySelector('.aqi_info2').textContent = data.info;
  card.querySelector('.aqi_time').textContent = data.time.s;
  if (app.isLoading) {
    app.spinner.setAttribute('hidden', true);
    app.isLoading = false;
  }
}

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