// Event listeners for UI elements

document.getElementById('butRefresh').addEventListener('click', function () {
  app.updateForecasts();
});

document.getElementById('butAdd').addEventListener('click', function() {
  app.toggleAddDialog(true);
});

document.getElementById('butAddCity').addEventListener('click', function() {
  var select = document.getElementById('selectCityToAdd');
  var selected = select.options[select.selectedIndex];
  var key = selected.value;
  var label = selected.textContent;
  var name = selected.attributes["name"].nodeValue;
  if (!app.selectedCities) {
    app.selectedCities = [];
  }
  app.getForecast(key, label, name);
  app.selectedCities.push({key: key, label: label, name: name});
  app.saveSelectedCities();
  app.toggleAddDialog(false);
});

document.getElementById('butAddCancel').addEventListener('click', function() {
  app.toggleAddDialog(false);
});