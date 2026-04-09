function createPhotoMap() {

  // URL of a Google Sheets spreadsheet output as CSV
  var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRhSF1fOZp-FvWBScEDHQXzF6MpajJp6JIrKeVpqeYT__onGdBsZ-XsFqBf9pxq5_DkMF69yUYaMOlk/pub?gid=0&single=true&output=csv';

  // create map object with center lat/lon and zoom level
  var map = L.map('map').setView([30.433, -91.1833], 13);

  // create basemap object
  var basemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // use Papa Parse to get the Google Sheets CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(csv) {

      var place, marker, markersLayer;

      markersLayer = L.featureGroup().addTo(map);

      for (var row in csv.data) {
        place = csv.data[row];
        marker = L.marker([place.lat, place.long])
          .bindTooltip(place.name, {permanent: true})
          .addTo(markersLayer);
        marker.properties = {
          name: place.name,
          description: place.description,
          pic_url: place.pic_url
        };
      }

      markersLayer.on("click", function(event) {
        var place = event.layer.properties;
        $('.modal').modal('show');
        $('.modal-title').html(place.name);
        $('.modal-body').html(place.description + '<br><img src="' + place.pic_url + '">');
      });

    }
  });

  $('.closeButton').on('click', function(e) {
    $('.modal').modal('hide');
  });

}

window.addEventListener('load', createPhotoMap);
