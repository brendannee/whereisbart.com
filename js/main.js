//ref: https://leafletjs.com/reference-1.3.4.html#marker

// constants
var BART_API_URI = 'https://api.bart.gov/api/';
var BART_API_KEY = 'MW9S-E7SL-26DU-VV8V';
var REFRESH_FREQ = 5000; // in millis
var STATION_OPACITY = 0.6;

// config
var routeTimes = [];

// runtime data
var map;
var refreshCountDown = REFRESH_FREQ; // in millis
var lastProcTime;
var liveTrains = [];
var showingStation;
var activeMarker;

// debugging
var debugMode = false;
var debugText = '';

/*----------------------------------------------------------------------*\
    Setup
\*----------------------------------------------------------------------*/
function buildTimes() {
  links.forEach(function(link) {
    if (!routeTimes[link.start]) {
      routeTimes[link.start] = [];
    }

    if (!routeTimes[link.end]) {
      routeTimes[link.end] = [];
    }

    routeTimes[link.start][link.end] = link.time;
    routeTimes[link.end][link.start] = link.time;
  });
}

/*----------------------------------------------------------------------*\
    Bart Station
\*----------------------------------------------------------------------*/
function getBartStation(stationKey, marker) {
  if (showingStation == stationKey) {
    showingStation = '';
    activeMarker = undefined;
    $('#extra').html('');
    return;
  }
  $.get(BART_API_URI + 'etd.aspx?cmd=etd&orig=' + stationKey + '&key=' + BART_API_KEY + '&callback=?', function(xml) {
    // Parse XML
    var data = $.xml2json(xml);
    showingStation = data.station.abbr;
    activeMarker = marker;
    showStationInfo(data.station);
  });
}

function showStationInfo(station) {
  var platforms = [];
  asArray(station.etd).forEach(function(destination) {
    asArray(destination.estimate).forEach(function(estimate) {
      var plat = estimate.platform;
      if (!platforms[plat]) {
        platforms[plat] = {
          dir: estimate.direction,
          trains: []
        }
      };
      platforms[plat].trains.push({mins: estimate.minutes, destId: destination.abbreviation, dest: destination.destination, color: estimate.color})
    });
  });
  var stationInfo = 'Station: <b>' + station.name + '</b>';
  platforms.forEach(function(platform, platId) {
    platform.trains.sort((a, b) => toInt(a.mins) - toInt(b.mins));
    stationInfo += '<br>Platform ' + platId + ': ' + platform.dir;
    platform.trains.forEach(function(train) {
      stationInfo += '<br>' + train.mins + ' min -- ' + debug(train.destId + ': ') + train.dest + ' (' + train.color.toLowerCase() + ')';
    });
    stationInfo += '<br>';
  });
  activeMarker.bindPopup(stationInfo);
}

/*----------------------------------------------------------------------*\
    Bart Estimated
\*----------------------------------------------------------------------*/
function getBART() {
  $.get(BART_API_URI + 'etd.aspx?cmd=etd&orig=ALL&key=' + BART_API_KEY + '&callback=?', processBART);
}

function processBART(xml) {
  // Parse XML
  var data = $.xml2json(xml);
  refreshCountDown = REFRESH_FREQ;
  // some times we get the same data, or responses out of order, in such case, we just ignore them
  if (lastProcTime >= data.time) {
    return;
  }
  lastProcTime = data.time

  $('#last_updated').html('Data as of <b>' + data.time + '</b>');
  var debug = 'Data: ' + data.time;

  var trains2 = [];
  debug += computeLiveTrains(data, trains2);
  debug += drawLiveTrains(trains2);

  debugText = debug + '<br><br>' + debugText.substring(0, 6000);
  $('#debugOutput').html(debugText);
}

function computeLiveTrains(data, trains) {
  var debug = '';
  data.station.forEach(function(station) {
    if (showingStation == station.abbr) {
      showStationInfo(station);
    }
    asArray(station.etd).forEach(function(destination) {
      asArray(destination.estimate).forEach(function(estimate) {
        var route = getRouteInfo(estimate.color, station.abbr, destination.abbreviation);
        if (route) {
          var legMins = routeTimes[station.abbr][route.prev];
          if (!legMins) {
            legMins = 0;
          }
          var estimateMins = toInt(estimate.minutes);
          var destKey = estimate.color + '_' + destination.abbreviation;
          if (!trains[destKey]) {
            trains[destKey] = [];
          }

          // in case there are more than one estimated train to the same destination
          if (!trains[destKey][station.abbr]) {
            trains[destKey][station.abbr] = {
              color: estimate.color,
              destStation: destination.abbreviation,
              forStation: station.abbr,
              prevStation: route.prev,
              nextStation: route.next,
              next: station.abbr,
              etaMins: estimateMins,
              legMins: legMins,
              valid: true,
              route: route,
              sta: station,
              etd: destination,
              est: estimate
            };
          }
        } else {
          debug += '<br>Link NotFound: ' + estimate.color + ', ' + station.abbr + '->' + destination.abbreviation + ',' + estimate.direction;
        }
      });
    });
  });

  // remove duplicate entries
  for (var destIdx in trains) {
    for (var stationIdx in trains[destIdx]) {
      var train = trains[destIdx][stationIdx];
      var prev = trains[destIdx][train.prevStation];
      var next = trains[destIdx][train.nextStation];
      if (prev && prev.etaMins < train.etaMins) {
        train.valid = false;
      } else if (train.etaMins > 10 && train.prevStation != stationIdx && next && next.etaMins < train.etaMins) {
        debug += '<br> dir? ' + train.forStation + '/' + train.etaMins + ' next: ' + next.forStation + '/' + next.etaMins + ' -> ' + train.destStation;
      }
    }
  }
  return debug;
}

function drawLiveTrains(trains) {
  var renewTrains = [];
  var debug = '';
  for (var destIdx in trains) {
    for (var stationIdx in trains[destIdx]) {
      var train = trains[destIdx][stationIdx];
      if (train.valid) {
        var position = getTrainPosition(train.forStation, train.prevStation, train.etaMins, train.legMins);
        var exisiting = extractPreviousLiveTrain(train, liveTrains);
        if (!exisiting) {
          var marker = createTrainMarker(train, train.sta, train.etd, train.est, position, train.legMins, train.prevStation)
          var trainMarker = {
            train: train,
            position: position,
            marker: marker
          };
          map.addLayer(trainMarker.marker);
          renewTrains.push(trainMarker);
          debug += '<br>(add) ' + getTrainShortInfo(train);
        } else if (position.lat != exisiting.position.lat || position.lng != exisiting.position.lng) {
          exisiting.train = train;
          exisiting.adjCount = 30;
          exisiting.adjLat = (position.lat - exisiting.position.lat) / exisiting.adjCount;
          exisiting.adjLng = (position.lng - exisiting.position.lng) / exisiting.adjCount;
          setTrainPopup(exisiting.marker, train, train.sta, train.etd, train.est, position, train.legMins, train.prevStation);
          renewTrains.push(exisiting);
          // we also want to update the markerText with new/updated info
        } else {
          renewTrains.push(exisiting);
        }
      }
    }
  }
  liveTrains.forEach(function(trainMarker) {
    map.removeLayer(trainMarker.marker);
    debug += '<br>(del) ' + getTrainShortInfo(trainMarker.train);
  });
  liveTrains = renewTrains;
  return debug;
}

function getTrainShortInfo(train) {
  return train.forStation + ',  ' + train.color + ' -> ' + train.destStation + ': ' + train.etaMins;
}

// search for train for a possible previous/same position from liveTrains
function extractPreviousLiveTrain(train, trains) {
  for (var i in trains) {
    var check = trains[i];
    if (train.destStation == check.train.destStation && train.color == check.train.color && (train.forStation == check.train.forStation || train.prevStation == check.train.forStation)) {
      trains.splice(i, 1);
      return check;
    }
  }
}

function getRouteInfo(color, curr, dest) {
  if (!routes[color]) {
    return;
  }

  var route = routes[color].stations;
  var currIdx = route.indexOf(curr);
  var destIdx = route.indexOf(dest);
  if (currIdx < 0 || destIdx < 0) {
    return;
  }

  var dirUp = currIdx < destIdx;
  var nextIdx = Math.min(Math.max(currIdx + (
    dirUp
    ? 1
    : -1), 0), route.length - 1);
  var prevIdx = Math.min(Math.max(currIdx - (
    dirUp
    ? 1
    : -1), 0), route.length - 1);
  return {
    icon: dirUp
      ? routes[color].iconUp
      : routes[color].iconDown,
    prev: route[prevIdx]
      ? route[prevIdx]
      : '',
    next: route[nextIdx]
  };
}

/*----------------------------------------------------------------------*\
    Map Interaction
\*----------------------------------------------------------------------*/
function setupMap() {
  //create map
  map = new L.Map('map');
  var layer = new L.TileLayer('https://mt1.google.com/vt/lyrs=m@121,transit|vm:1&hl=en&opts=r&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy;2012 Google',
    maxZoom: 16
  });
  var sf = new L.LatLng(37.735, -122.17);
  map.setView(sf, 11).addLayer(layer);
  drawStations();
}

function drawStations() {
  $.each(stations, function(stationKey, station) {
    var marker = new L.Marker(new L.LatLng(station.lat, station.lng), {
      icon: L.divIcon({
        className: 'station-icon',
        iconSize: [
          9, 9
        ],
      }),
      title: station.name,
      zIndexOffset: 100,
      opacity: STATION_OPACITY
    });
    marker.bindPopup('Station: <b>' + station.name + '</b>');
    marker.on('click', function() {
      getBartStation(stationKey, marker);
    });
    map.addLayer(marker);
  });
}

// Finds postion of trains.
function getTrainPosition(toStation, fromStation, estimateMins, threshold) {
  toStation = stations[toStation];
  fromStation = stations[fromStation];

  if (estimateMins > threshold) {
    estimateMins = threshold;
  }

  var percent = (estimateMins + 0.25) / (threshold + 1.0);
  if (estimateMins == 0) {
    percent = 0;
  }

  var lat = toStation.lat - ((toStation.lat - fromStation.lat) * percent);
  var lng = toStation.lng - ((toStation.lng - fromStation.lng) * percent);

  return {lat: lat, lng: lng};
}

function createTrainMarker(train, station, destination, estimate, position, threshold, fromStation) {
  var icon = L.divIcon({
    className: 'train-icon train-' + train.route.icon,
    iconSize: [18, 14]
  });
  var marker = new L.Marker(new L.LatLng(position.lat, position.lng), {
    icon: icon,
    title: train.etd.destination,
    zIndexOffset: 1000
  });
  setTrainPopup(marker, train, station, destination, estimate, position, threshold, fromStation);
  return marker;
}

function setTrainPopup(marker, train, station, destination, estimate, position, threshold, fromStation) {
  var iconLabel = stations[destination.abbreviation]
    ? stations[destination.abbreviation].iconAbbreviation
    : '';
  if (estimate.delay > 0) {
    iconLabel += '!';
  }

  if (marker.options.icon) {
    marker.options.icon.options.html = iconLabel;
  }

  var markerText = '<b>' + destination.destination + '</b> Train';
  if (estimate.minutes == 'Leaving') {
    markerText += '<br>Leaving Station: <b>' + stations[station.abbr].name + '</b>';
  } else {
    markerText += '<br>Next Station: <b>' + stations[station.abbr].name + '</b> in ' + estimate.minutes + ' min' + debug(' (total ' + threshold + ')');
  }

  markerText += debug('<br> ' + estimate.color + '/' + estimate.direction + ', from: ' + fromStation + ', to: ' + station.abbr + ', final: ' + destination.abbreviation);

  if (estimate.delay > 0) {
    markerText += '<br>Delayed: <b>' + secondsToMins(estimate.delay) + '</b> mins.';
  }

  marker.bindPopup(markerText);
}

function moveTrains() {
  liveTrains.forEach(function(train) {
    if (train.adjCount) {
      train.adjCount--;
      train.position.lat += train.adjLat;
      train.position.lng += train.adjLng;
      train.marker.setLatLng(train.position);
    }
  });
}

/*----------------------------------------------------------------------*\
    Main
\*----------------------------------------------------------------------*/
function debug(text) {
  return debugMode
    ? text
    : '';
}

function sizeWindow() {
  $('#map').height($(window).height() - 40);
}

function developmentMode() {
  debugMode = !debugMode;
  $('#development')[0].style.visibility = debugMode
    ? 'visible'
    : '';
}

function updateClock() {
  if (refreshCountDown > 0) {
    refreshCountDown -= 1000;
    $('#clock span').html(refreshCountDown / 1000);
  }
}

// On page load
$(document).ready(function() {
  sizeWindow();
  window.onResize = sizeWindow;
  setupMap();
  buildTimes();
  getBART();
  setInterval(updateClock, 1000);
  setInterval(getBART, REFRESH_FREQ);
  setInterval(moveTrains, 1000);
});
