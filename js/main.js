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
var selectedTrain;
var stationTrainETA = [];

// debugging
var debugMode = false;
var debugText = '';
var drawRoutePathDone = false;

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
        var trainMarker = extractPreviousLiveTrain(train, liveTrains);
        if (!trainMarker) {
          trainMarker = createTrainMarker(train, position)
          map.addLayer(trainMarker.marker);
          // Store reference and add click handler
          trainMarker.marker._trainMarkerRef = trainMarker;
          trainMarker.marker.on('click', function() {
            onTrainClick(this._trainMarkerRef);
          });

          debug += '<br>(add) ' + getTrainShortInfo(train);
        } else if (position.lat != trainMarker.position.lat || position.lng != trainMarker.position.lng) {
          trainMarker.train = train;
          updateTrainMarker(trainMarker, position);
        }
        renewTrains.push(trainMarker);
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
    if (train.destStation == check.train.destStation
        && train.color == check.train.color
        && (train.forStation == check.train.forStation
            || train.prevStation == check.train.forStation)) {
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
  map.setView(sf, 10).addLayer(layer);
  drawStations();
}

// Draw all route path segments (for debugging)
function drawRoutePath() {
  if (drawRoutePathDone) return;
  drawRoutePathDone = true;

  routePath.forEach(function(segment) {
    var latlngs = segment.waypoints.map(function(point) {
      return [point.lat, point.lng];
    });

    var polyline = L.polyline(latlngs, {
      color: '#0066cc',
      weight: 6,
      opacity: 0.4,
      smoothFactor: 1
    });

    polyline.bindPopup('<b>Route:</b> ' + segment.start + ' → ' + segment.end);
    map.addLayer(polyline);
  });
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
function getTrainPosition(toStationCode, fromStationCode, estimateMins, threshold) {
  toStation = stations[toStationCode];
  fromStation = stations[fromStationCode];

  if (estimateMins > threshold) {
    estimateMins = threshold;
  }

  var percent = (estimateMins + 0.25) / (threshold + 1.0);
  if (estimateMins == 0) {
    percent = 0;
  }

  // Try to use detailed route path if available
  var waypoints = getRoutePath(fromStationCode, toStationCode);
  if (waypoints && waypoints.length > 2) {
    var position = getPositionAlongRoute(waypoints, percent);
    if (position) {
      return position;
    }
  }

  // Fallback to simple linear interpolation if no route path available
  var lat = toStation.lat - ((toStation.lat - fromStation.lat) * percent);
  var lng = toStation.lng - ((toStation.lng - fromStation.lng) * percent);
  var bearing = getBearing(fromStation, toStation);

  return {lat: lat, lng: lng, bearing: bearing};
}

function createTrainMarker(train, position) {
  var anchors = calculateIconAnchor(position);
  var icon = L.divIcon({
    className: 'train-icon train-' + train.route.icon,
    iconSize: [18, 14],
    iconAnchor: anchors.iconAnchor,
    popupAnchor: anchors.popupAnchor
  });

  var marker = new L.Marker(new L.LatLng(position.lat, position.lng), {
    icon: icon,
    title: `${train.etd.destination} bound train`,
    zIndexOffset: 1000
  });

  var trainMarker = {
    train: train,
    position: position,
    marker: marker
  };

  // Store reference to trainMarker object for click handler
  marker._trainMarkerRef = null;

  setTrainPopup(marker, train);
  return trainMarker;
}

function updateTrainMarker(trainMarker, position) {
  trainMarker.adjCount = 30;
  trainMarker.adjLat = (position.lat - trainMarker.position.lat) / trainMarker.adjCount;
  trainMarker.adjLng = (position.lng - trainMarker.position.lng) / trainMarker.adjCount;

  var anchors = calculateIconAnchor(position);
  trainMarker.marker.options.icon.options.iconAnchor = anchors.iconAnchor;
  trainMarker.marker.options.icon.options.popupAnchor = anchors.popupAnchor;

  setTrainPopup(trainMarker.marker, trainMarker.train);
}

// Calculate icon offset based on bearing
// Offset perpendicular to direction of travel (to the right)
// Default center of 18x14 icon
function calculateIconAnchor(position) {
  var offsetPixels = 8;
  // Convert bearing to radians and add 90 degrees for perpendicular (right side)
  var bearingRad = (position.bearing + 90) * Math.PI / 180;
  // Calculate perpendicular offset
  var xOffset = offsetPixels * Math.sin(bearingRad);
  var yOffset = -offsetPixels * Math.cos(bearingRad);
  // Apply offset to icon anchor
  var iconAnchor = [9 - xOffset, 7 - yOffset];
  // Popup anchor should compensate for the icon offset to center on the train
  // The popup anchor is relative to the icon anchor, so we need to reverse the offset
  var popupAnchor = [xOffset+2, yOffset-4];

  return {
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor
  };
}

function setTrainPopup(marker, train) {
  var station = train.sta
  var destination = train.etd
  var estimate = train.est
  var threshold = train.legMins
  var fromStation = train.prevStation

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
    Train Selection and Station Train ETA
\*----------------------------------------------------------------------*/
function onTrainClick(trainMarker) {
  // Toggle selection if clicking the same train
  if (selectedTrain === trainMarker) {
    clearStationTrainETA();
    selectedTrain = null;
    return;
  }

  // Update selection
  clearStationTrainETA();
  selectedTrain = trainMarker;

  // Validate route exists
  var train = trainMarker.train;
  var route = routes[train.color];
  if (!route) {
    return;
  }

  // Get route information
  var routeInfo = getRouteIndices(train, route);
  if (!routeInfo) {
    return;
  }

  // Display ETAs for all stations on route
  displayTrainETAs(train, routeInfo);
}

function clearStationTrainETA() {
  stationTrainETA.forEach(function(bubble) {
    map.removeLayer(bubble);
  });
  stationTrainETA = [];
}

function getRouteIndices(train, route) {
  var routeStations = route.stations;
  var currentIdx = routeStations.indexOf(train.forStation);
  var destIdx = routeStations.indexOf(train.destStation);

  if (currentIdx < 0 || destIdx < 0) {
    return null;
  }

  return {
    routeStations: routeStations,
    currentIdx: currentIdx,
    destIdx: destIdx,
    directionForward: currentIdx < destIdx
  };
}

function calculateStationETA(i, startIdx, step, train, routeStations, cumulativeTime) {
  if (i === startIdx) {
    return {
      timeToStation: train.etaMins,
      cumulativeTime: train.etaMins
    };
  }

  var prevStationKey = routeStations[i - step];
  var currentStationKey = routeStations[i];
  var travelTime = routeTimes[prevStationKey][currentStationKey];

  if (!travelTime) {
    return null;
  }

  var newCumulativeTime = cumulativeTime + travelTime;
  return {
    timeToStation: newCumulativeTime,
    cumulativeTime: newCumulativeTime
  };
}

function createETAMarker(station, timeToStation) {
  var timeString = minsToTime(timeToStation);
  var trainEtaIcon = L.divIcon({
    className: 'station-train-eta`',
    html: '<div class="train-eta-time">' + timeString + '</div>',
    iconSize: [45, 20],
    iconAnchor: [22.5, 25]
  });

  var bubble = new L.Marker(new L.LatLng(station.lat, station.lng), {
    icon: trainEtaIcon,
    zIndexOffset: 2000,
    interactive: false
  });

  bubble.bindPopup('<b>' + station.name + '</b><br>ETA: ' + timeString + ' (' + Math.round(timeToStation) + ' minutes)');
  return bubble;
}

function displayTrainETAs(train, routeInfo) {
  var routeStations = routeInfo.routeStations;
  var startIdx = routeInfo.currentIdx;
  var endIdx = routeInfo.destIdx;
  var directionForward = routeInfo.directionForward;
  var step = directionForward ? 1 : -1;
  var cumulativeTime = 0;

  for (var i = startIdx; directionForward ? i <= endIdx : i >= endIdx; i += step) {
    var stationKey = routeStations[i];
    var station = stations[stationKey];

    if (!station) {
      continue;
    }

    var etaResult = calculateStationETA(i, startIdx, step, train, routeStations, cumulativeTime);
    if (!etaResult) {
      continue;
    }

    cumulativeTime = etaResult.cumulativeTime;
    var bubble = createETAMarker(station, etaResult.timeToStation);

    map.addLayer(bubble);
    stationTrainETA.push(bubble);
  }
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
  if (debugMode) drawRoutePath();
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
