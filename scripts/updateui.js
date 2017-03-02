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
app.updateForecastCard = function(data) {
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
    app.visibleCards[data.key] = card;
  }

  // Verifies the data provide is newer than what's already visible
  // on the card, if it's not bail, if it is, continue and update the
  // time saved in the card
  var cardLastUpdatedElem = card.querySelector('.card-last-updated');
  var cardLastUpdated = cardLastUpdatedElem.textContent;
  if (cardLastUpdated) {
    cardLastUpdated = new Date(cardLastUpdated);
    // Bail if the card has more recent data then the data
    if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
      return;
    }
  }
  cardLastUpdatedElem.textContent = data.created;

  card.querySelector('.description').textContent = current.text;
  card.querySelector('.date').textContent = current.date;
  card.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
  card.querySelector('.current .temperature .value').textContent =
    Math.round(current.temp);
  card.querySelector('.current .sunrise').textContent = sunrise;
  card.querySelector('.current .sunset').textContent = sunset;
  card.querySelector('.current .humidity').textContent =
    Math.round(humidity) + '%';
  card.querySelector('.current .wind .value').textContent =
    Math.round(wind.speed);
  card.querySelector('.current .wind .direction').textContent = wind.direction;
  var nextDays = card.querySelectorAll('.future .oneday');
  var today = new Date();
  today = today.getDay();
  for (var i = 0; i < 7; i++) {
    var nextDay = nextDays[i];
    var daily = data.channel.item.forecast[i];
    if (daily && nextDay) {
      nextDay.querySelector('.date').textContent =
        app.daysOfWeek[(i + today) % 7];
      nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
      nextDay.querySelector('.temp-high .value').textContent =
        Math.round(daily.high);
      nextDay.querySelector('.temp-low .value').textContent =
        Math.round(daily.low);
    }
  }
  if (app.isLoading) {
    app.spinner.setAttribute('hidden', true);
    app.container.removeAttribute('hidden');
    app.isLoading = false;
  }
};