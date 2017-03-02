// TODO add startup code here

app.selectedCities = localStorage.selectedCities;
if (!app.selectedCities) {
  app.selectedCities = [
    {key: "2132574", label: "杭州"}
  ];
  app.saveSelectedCities();
} else {
  app.selectedCities = JSON.parse(app.selectedCities);
}

app.selectedCities.forEach(function(city) {
  app.getForecast(city.key, city.label);
});

// TODO add service worker code here
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(function() { console.log('Service Worker Registered'); });
}

/*
  * Fake weather data that is presented when the user first uses the app,
  * or when the user has not saved any cities. See startup code for more
  * discussion.
  */
// var initialWeatherForecast = {
//   key: '2459115',
//   label: 'New York, NY',
//   created: '2016-07-22T01:00:00Z',
//   channel: {
//     astronomy: {
//       sunrise: "5:43 am",
//       sunset: "8:21 pm"
//     },
//     item: {
//       condition: {
//         text: "Windy",
//         date: "Thu, 21 Jul 2016 09:00 PM EDT",
//         temp: 56,
//         code: 24
//       },
//       forecast: [
//         {code: 44, high: 86, low: 70},
//         {code: 44, high: 94, low: 73},
//         {code: 4, high: 95, low: 78},
//         {code: 24, high: 75, low: 89},
//         {code: 24, high: 89, low: 77},
//         {code: 44, high: 92, low: 79},
//         {code: 44, high: 89, low: 77}
//       ]
//     },
//     atmosphere: {
//       humidity: 56
//     },
//     wind: {
//       speed: 25,
//       direction: 195
//     }
//   }
// };
// TODO uncomment line below to test app with fake data
// app.updateForecastCard(initialWeatherForecast);