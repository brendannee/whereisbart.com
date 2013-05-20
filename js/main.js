var southbound
  , northbound
  , map
  , updateTime = 15000
  , trains
  , icons = {}
  , endpoints = ['DALY','FRMT','DUBL','PITT','24TH','MLBR','SFIA','RICH'];


function sizeWindow() {
  $('#map').height($(window).height() - 120);
}


function buildTimes() {
  northbound = {};
  southbound = {};
  links.forEach(function (link) {
    northbound[link.start] = {
        time: link.time
      , next: link.end
      , color: link.color
      , endpoint: link.endpoint || null
    };
    southbound[link.end] = {
        time: link.time
      , next: link.start
      , color: link.color
      , endpoint: link.endpoint || null
    };
  });
}


function setupMap() {
  //create map
  map = new L.Map('map');
  var layer = new L.TileLayer('http://mt1.google.com/vt/lyrs=m@121,transit|vm:1&hl=en&opts=r&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy;2012 Google',
    maxZoom: 14
});
  var sf = new L.LatLng(37.779224, -122.313831);
  map.setView(sf, 10).addLayer(layer);

  //create markers
  var station_icon = L.Icon.extend({
    options: {
      iconUrl: 'images/icon_bart.png',
      shadowUrl: 'images/blank.png',
      iconSize: new L.Point(32, 32),
      iconAnchor: new L.Point(16, 16),
      popupAnchor: new L.Point(0, -3)
    }
  });
  icons.station = new station_icon();

  //add stations
  $.each(stations, function(i, station) {
    var marker = new L.Marker(new L.LatLng(station.lat, station.lng), {
      icon: icons.station, 
      zIndexOffset:-10
    });
    map.addLayer(marker);
  });

  endpoints.forEach(function(endpoint) {
    var icon = L.Icon.extend({
      options: {
        iconUrl: 'images/icon_' + endpoint + '.png',
        shadowUrl: 'images/icon_shadow.png',
        iconSize: new L.Point(32, 32),
        shadowSize: new L.Point(36, 25),
        iconAnchor: new L.Point(16, 16),
        popupAnchor: new L.Point(0, -3)
      }
    });
    icons[endpoint] = new icon();
  });

}


function getBART() {
  var BARTApi = 'MW9S-E7SL-26DU-VV8V';
  $.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + BARTApi + '&callback=?', processBART);
}

function processBART(xml) {
  //parse XML
  var data = $.xml2json(xml);

  updateTime = 15000;

  removeTrains();

  trains = [];

  $('#last_updated').html('Data as of ' + data.time); 

  var results = {};
  data.station.forEach(function(station) {
      var destinations = [];
      if (!(station.etd instanceof Array)) {
        station.etd = [ station.etd ];
      }
      station.etd.forEach(function(destination) {
        var estimates = [];
        if (! (destination.estimate instanceof Array)) {
          destination.estimate = [ destination.estimate ];
        }
        destination.estimate.forEach(function(estimate) {
          //check if endpoint
          if(
             (estimate.direction == 'North' && !southbound[station.abbr]) ||
             (estimate.direction == 'South' && !northbound[station.abbr])
          ) {
            //its an endpoint
          } else {
            //check if between adjacent link
            var threshold = (estimate.direction == 'North') ? 
                southbound[station.abbr].time :
                northbound[station.abbr].time;
            var next = (estimate.direction == 'North') ? 
                southbound[station.abbr].next :
                northbound[station.abbr].next;

            var time = parseInt(estimate.minutes, 10);

            if(time <= threshold) {
              estimates.push(time);
              var position = findTrain(station.abbr, next, time, threshold);
              var marker = new L.Marker(new L.LatLng(position.lat, position.lng), {
                icon: icons[destination.abbreviation]});
              var markerText = '<b>' + destination.destination + ' Bound</b><br>' +
                'Next Station: ' + stations[station.abbr].name + ' in ' + time + ' minutes';
              marker.bindPopup(markerText);

              var train = {
                  direction: estimate.direction
                , destination: destination.abbreviation
                , station: station.abbr
                , position: position
                , time: time
                , marker: marker
              }
              trains.push(train);
            }
          }
        });
        if(estimates.length){
          destinations.push({
              destination: destination.abbreviation
            , estimates: estimates
            , direction: estimates[0].direction
          });
        }
      });

      results[station.abbr] = {
          name: station.name
        , destinations: destinations
      }
  });
  drawTrains();
}


/**
 * Finds postion of trains.
 */

function findTrain(toStation, fromStation, time, threshold) {
  toStation = stations[toStation];
  fromStation = stations[fromStation];

  if(time == 0){
    return { lat: toStation.lat, lng: toStation.lng };
  }

  var percent = time/threshold
    , lat = toStation.lat - ( (toStation.lat - fromStation.lat) * percent )
    , lng = toStation.lng - ( (toStation.lng - fromStation.lng) * percent );

  return { lat: lat, lng: lng };
}


function drawTrains() {
  if(trains){
    trains.forEach(function(train) {
      map.addLayer(train.marker);
    });
  }
}


function removeTrains() {
  if(trains){
    trains.forEach(function(train) {
      map.removeLayer(train.marker);
    });
  }
}


function updateClock() {
  if(updateTime > 0) {
    updateTime -= 1000;
    $('#clock span').html(updateTime / 1000);
  }
}


/** 
 * On page load
 */
$(document).ready(function() {
  sizeWindow();
  window.onResize = sizeWindow;
  setupMap();
  buildTimes();
  getBART();
  setInterval(updateClock, 1000);
  setInterval(getBART, 15000);
});
