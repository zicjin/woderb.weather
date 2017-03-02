// Event listeners for UI elements
document.getElementById('butRefresh').addEventListener('click', function() {
  // Refresh all of the forecasts
  app.updateForecasts();
});

document.getElementById('butAdd').addEventListener('click', function() {
  // Open/show the add new city dialog
  app.toggleAddDialog(true);
});

document.getElementById('butAddCity').addEventListener('click', function() {
  // Add the newly selected city
  var select = document.getElementById('selectCityToAdd');
  var selected = select.options[select.selectedIndex];
  var key = selected.value;
  var label = selected.textContent;
  if (!app.selectedCities) {
    app.selectedCities = [];
  }
  app.getForecast(key, label);
  app.selectedCities.push({key: key, label: label});
  app.saveSelectedCities();
  app.toggleAddDialog(false);
});

document.getElementById('butAddCancel').addEventListener('click', function() {
  // Close the add new city dialog
  app.toggleAddDialog(false);
});