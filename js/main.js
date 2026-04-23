//ref: https://leafletjs.com/reference-1.3.4.html#marker

// constants
var BART_API_URI = 'https://api.bart.gov/api/';
var BART_API_KEY = 'MW9S-E7SL-26DU-VV8V';
var FREQ_GET_BART = 5000; // in millis
var FREQ_MOVE_TRAINS = 1000; // in millis

// config
var routeTimes = [];

// runtime data
var map;
var lastProcTime;
var liveTrains = [];
var showingStation;
var activeMarker;
var selectedTrain;
var stationTrainETA = [];
var selectedRouteColor = null; // for route filtering

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
  var station = lastReceivedData.station.find(station => station.abbr === stationKey);
  showingStation = stationKey;
  activeMarker = marker;
  showStationInfo(station);
  return;
}

function showStationInfo(station) {
  var platforms = [];
  asArray(station.etd).forEach(function(destination) {
    asArray(destination.estimate).forEach(function(estimate) {
      var plat = estimate.platform;
      if (!platforms[plat]) {
        platforms[plat] = {dir: estimate.direction, trains: []};
      }
      platforms[plat].trains.push({mins: estimate.minutes, destId: destination.abbreviation, dest: destination.destination, color: estimate.color})
    });
  });
  var stationInfo = 'Station: <a href="https://www.bart.gov/schedules/stnsched/' + station.abbr + '" target="_blank" rel="noopener" title="BART station info"><b>' + station.name + '</b> ⧉</a>';
  stationInfo += debug('<br>Key: ' + station.abbr);

  var stationData = stations[station.abbr];
  platforms.forEach(function(platform, platId) {
    platform.trains.sort((a, b) => toInt(a.mins) - toInt(b.mins));
    // Use actual direction from station data if available, fallback to API direction
    var dirLabel = platform.dir;
    var platformDirKey = 'platform' + platId + 'Dir';
    if (stationData && stationData[platformDirKey]) {
      var dirKey = stationData[platformDirKey];
      var dirInfo = platformDirections[dirKey];
      dirLabel = !dirInfo ? dirKey : dirInfo.label;
    }
    stationInfo += '<br>Platform ' + platId + ': ' + dirLabel;
    platform.trains.forEach(function(train) {
      stationInfo += '<br>' + train.mins + (train.mins === 'Leaving' ? '' : ' min') + ' -- '
          + debug(train.destId + ': ') + train.dest + ' (' + train.color.toLowerCase() + ')';
    });
    stationInfo += '<br>';
  });
  activeMarker.bindPopup(stationInfo);
}

/*----------------------------------------------------------------------*\
    Bart Estimated
\*----------------------------------------------------------------------*/
function getBART() {
  $.get(BART_API_URI + 'etd.aspx?cmd=etd&orig=ALL&key=' + BART_API_KEY + '&callback=?', processBARTxml);
}

function processBARTxml(xml) {
  // Parse XML
  var data = $.xml2json(xml);
  // sometimes we get the same data, or responses out of order, in such case, we just ignore them
  if (lastProcTime >= data.time || lastProcTime === "Manual") {
    return;
  }
  lastProcTime = data.time
  processBARTjson(data);
}

function processBARTjson(data) {
  $('#last_updated').html('Data as of <b>' + data.time + '</b>');
  var debug = 'Data: ' + data.time;
  fixLiveTrains(data);
  trackReceivedBartData(data); // Store parsed JSON for save functionality
  var trains2 = [];
  debug += computeLiveTrains(data, trains2);
  debug += drawLiveTrains(trains2);

  debugInfo(debug + '<br>');
}

// Fix bad data from BART API
function fixLiveTrains(data) {
  //bart API shows MLBR as destination for trains going to SFO from Antioch and Pittsburg Center, only some time of the day
  let pitt = asArray(data.station).find(station => station.abbr === 'PITT');
  if (pitt) {
    let pitt_sfia = asArray(pitt.etd).find(destination => destination.abbreviation === 'SFIA');
    asArray(data.station).forEach(station => {
      if (pitt_sfia && (station.abbr === 'ANTC' || station.abbr === 'PCTR')) {
        asArray(station.etd).forEach(destination => {
          if (destination.abbreviation === 'MLBR') {
            destination.abbreviation = 'SFIA';
            destination.destination = 'SF Airport';
          }
        });
      }
    });
  }
}

function computeLiveTrains(data, trains) {
  var debug = '';
  debug += normalizeTrains(data, trains);
  debug += removeDuplicates(trains);
  return debug;
}

// normalize trains data from BART API
// trains is an array of trains, indexed by final route color + destination station
// in: data.station[].etd[].estimate[]
// out: trains[color_endDestStation][forStation]
function normalizeTrains(data, trains) {
  var debug = '';
  asArray(data.station).forEach(function(station) {
    if (showingStation == station.abbr) {
      showStationInfo(station);
    }
    asArray(station.etd).forEach(function(destination) {
      asArray(destination.estimate).forEach(function(estimate) {
        var route = getRouteInfo(estimate.color, station.abbr, destination.abbreviation);
        if (route) {
          var legMins = routeTimes[station.abbr][route.prev];
          if (!legMins || estimate.minutes == 'Leaving') {
            legMins = 0; // no legMins also means at the end of the segment
          }
          var estimateMins = toInt(estimate.minutes);
          var destKey = estimate.color + '_' + destination.abbreviation;
          if (!trains[destKey]) {
            trains[destKey] = [];
          }

          // in case there are more than one estimated train to the same destination
          let existingTrain = trains[destKey][station.abbr];
          if (!existingTrain) {
            trains[destKey][station.abbr] = {
              color: estimate.color,
              destStation: destination.abbreviation,
              forStation: station.abbr,
              prevStation: route.prev,
              nextStation: route.next,
              etaMins: estimateMins,
              legMins: legMins,
              valid: true,
              trainIcon: route.icon,
              sta: station,
              etd: destination,
              est: estimate
            };
          } else if (existingTrain.etaMins > estimateMins) {
            // when multiple estimates for the same route, we take the earliest one
            existingTrain.etaMins = estimateMins;
          }
        } else if (estimate.color != 'WHITE') { // ignore not in service trains
          debug += '<br>Link NotFound: ' + estimate.color + ': ' + station.abbr + '->' + destination.abbreviation + ',' + estimate.direction;
        }
      });
    });
  });
  return debug;
}

// remove duplicate entries (same physical train reported at multiple stations with different ETA)
function removeDuplicates(trains) {
  var debug = '';
  for (var destIdx in trains) {
    let trainRoute = trains[destIdx];
    for (var stationIdx in trainRoute) {
      var train = trainRoute[stationIdx];
      var prev = trainRoute[train.prevStation];
      var next = trainRoute[train.nextStation];
      if (prev && prev.etaMins <= train.etaMins) {
        // Check if this is likely the same train by comparing ETA difference with travel time
        var travelTime = routeTimes[train.prevStation] && routeTimes[train.prevStation][train.forStation];
        var etaDiff = train.etaMins - prev.etaMins;
        // If ETA difference is greater than travel time - 3 minutes, it's likely a different train
        if (prev.etaMins + travelTime - 10 < train.etaMins) {
          train.valid = false;
        }
      }
    }
  }
  return debug;
}

function drawLiveTrains(trains) {
  var renewTrains = [];
  var debug = '';
  var allTrains = orderTrains(trains);

  allTrains.forEach(function(train) {
    if (train.valid) {
      var trainMarker = extractPreviousLiveTrain(train, liveTrains);
      if (!trainMarker) {
        trainMarker = createTrainMarker(train);
        map.addLayer(trainMarker.marker);
        // Store reference and add click handler
        trainMarker.marker._trainMarkerRef = trainMarker;
        trainMarker.marker.on('click', function() {
          onTrainClick(this._trainMarkerRef);
        });
        debug = debugAddedTrain(train, debug);
      } else {
        // Existing train - update with new data
        trainMarker.train = train;
        updateTrainMarker(trainMarker);
      }
      renewTrains.push(trainMarker);
    }
  });
  debug = removeLiveTrains(debug);

  liveTrains = renewTrains;

  // Apply route filter visibility to all trains
  updateTrainVisibility();

  return debug;
}

// Flatten trains into a single array
// ordered by color, destStation, and ordinal position within route
function orderTrains(trains) {
  var allTrains = [];
  for (var destIdx in trains) {
    for (var stationIdx in trains[destIdx]) {
      allTrains.push(trains[destIdx][stationIdx]);
    }
  }

  // Sort by color, destStation, and ordinal position within route
  allTrains.sort(function(a, b) {
    if (a.color !== b.color) {
      return (a.color || '').localeCompare(b.color || '');
    }
    if (a.destStation !== b.destStation) {
      return (a.destStation || '').localeCompare(b.destStation || '');
    }
    // Sort by ordinal position within the route
    var aRoute = routes[a.color];
    var bRoute = routes[b.color];
    var aIdx = aRoute ? aRoute.stations.indexOf(a.forStation) : -1;
    var bIdx = bRoute ? bRoute.stations.indexOf(b.forStation) : -1;
    return aIdx - bIdx;
  });
  return allTrains;
}

function removeLiveTrains(debug) {
  liveTrains.forEach(function (trainMarker) {
    map.removeLayer(trainMarker.marker);
    debug = debugDeletedTrains(trainMarker.train, debug);
  });
  liveTrains = [];
  return debug;
}

// the ! menans that the train was not expected to be added at this station, ie, not at the end of a leg
function debugAddedTrain(train, debug) {
  let label = (train.forStation == train.prevStation || ['DALY', 'SFIA'].includes(train.prevStation)) ? '(add ) ' : '(add!) ';
  debug += '<br>' + label + getTrainShortInfo(train);
  return debug;
}

// the ! menans that the train was not expected to be removed from this station, ie not at the end of a leg
function debugDeletedTrains(train, debug) {
  let label = (train.legMins == 0 && train.nextStation == train.destStation) ? '(del ) ' : '(del!) ';
  debug += '<br>' + label + getTrainShortInfo(train);
  return debug;
}

function getTrainShortInfo(train) {
  if (!train) return 'null';
  let emoji = routes[train.color].emoji;
  let travel = null;
  if (train.legMins === 0) {
    travel = train.forStation + '>' + train.nextStation;
  } else {
    travel = train.prevStation + '>' + train.forStation;
  }
  return emoji + " " + travel + '..' + train.destStation + ': ' + train.etaMins + "/" + train.legMins;
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
  var route = routes[color];
  if (!route) {
    return null;
  }

  var stations = route.stations;
  var currIdx = stations.indexOf(curr);
  var destIdx = stations.indexOf(dest);
  if (currIdx < 0 || destIdx < 0) {
    return null;
  }

  var dirUp = currIdx != destIdx ? currIdx < destIdx : destIdx != 0;
  var nextIdx = clamp(currIdx + (dirUp ? 1 : -1), 0, stations.length - 1);
  var prevIdx = clamp(currIdx - (dirUp ? 1 : -1), 0, stations.length - 1);
  let icon = dirUp ? route.iconUp : route.iconDown;
  let prev = stations[prevIdx];
  let next = stations[nextIdx];
  return {icon: icon, prev: prev, next: next};
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

  // Clear train ETAs when clicking on the map outside of a train marker.
  // Leaflet marker clicks don't propagate to the map, so this only fires
  // for clicks on empty map areas.
  map.on('click', function() {
    if (selectedTrain) {
      clearStationTrainETA();
      selectedTrain = null;
    }
  });

  drawStations();
}

// Draw all route path segments (for debugging)
function drawRoutePath() {
  if (drawRoutePathDone) return;
  drawRoutePathDone = true;

  routePath.forEach(function(segment) {
    var waypoints = getRoutePath(segment.start, segment.end);
    if (!waypoints) return;
    var latlngs = waypoints.map(function(point) {
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
    drawSegmentMinuteMarks(segment)
  });
}

// Add minute marks along the route, the point of estimated time of the train on the route
function drawSegmentMinuteMarks(segment) {
  var travelTime = routeTimes[segment.start] && routeTimes[segment.start][segment.end];
  var waypoints = getRoutePath(segment.start, segment.end);
  if (travelTime && travelTime > 1 && waypoints && waypoints.length >= 2) {
    // Add markers at each minute interval (excluding start and end stations)
    for (var minute = 1; minute < travelTime; minute++) {
      var percent = minute / travelTime;
      var position = getPositionAlongRoute(waypoints, percent);
      if (position) {
        var minuteMarker = L.marker([position.lat, position.lng], {
          icon: L.divIcon({
            className: 'minute-marker',
            html: '<span>' + minute + '</span>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        });
        minuteMarker.bindPopup('<b>' + segment.start + ' → ' + segment.end + '</b><br>Minute ' + minute + ' of ' + travelTime);
        map.addLayer(minuteMarker);
      }
    }
  }
}

function drawStations() {
  $.each(stations, function(stationKey, station) {
    var marker = new L.Marker(new L.LatLng(station.lat, station.lng), {
      icon: L.divIcon({
        className: 'station-icon',
        iconSize: [14, 14],
      }),
      title: station.name,
      zIndexOffset: 100,
      opacity: 1
    });
    marker.bindPopup('Station: <b>' + station.name + '</b>');
    marker.on('click', function() {
      getBartStation(stationKey, marker);
    });
    map.addLayer(marker);
  });
}

// Calculates train position as percentage along route from prevStation to forStation.
// percent = 0 means at prevStation, percent = 1 means at forStation (next station)
function getTrainPosition(toStationCode, fromStationCode, percent) {
  // Try to use detailed route path if available
  var waypoints = getRoutePath(fromStationCode, toStationCode);
  if (waypoints && waypoints.length >= 2) {
    var position = getPositionAlongRoute(waypoints, percent); // percent as distance from START
    if (position) {
      return position;
    }
  }

  var toStation = stations[toStationCode];
  var fromStation = stations[fromStationCode];
  if (toStation == fromStation) {
    return {lat: toStation.lat, lng: toStation.lng, bearing: 0};
  }

  console.log('Missing route path for ' + fromStationCode + ' -> ' + toStationCode + ', waypoints: ' + waypoints);

  // Fallback to simple linear interpolation if no route path available
  var lat = fromStation.lat + ((toStation.lat - fromStation.lat) * percent);
  var lng = fromStation.lng + ((toStation.lng - fromStation.lng) * percent);
  var bearing = getBearing(fromStation, toStation);
  return {lat: lat, lng: lng, bearing: bearing};
}

// Calculate the percentage along the route based on ETA and leg time.
// Returns value from 0 (at prev station) to 1 (at next station), (legMins - etaMins) / legMins
// When etaMins == legMins -> percent = 0 (at start)
// When etaMins == 0 -> percent = 1 (at destination)
function calculateRoutePercent(etaMins, legMins) {
  if (legMins <= 0) {
    return 1; // At station at the end of the leg if no legMins
  }
  return clamp((legMins - Math.max(0, etaMins)) / legMins, 0, 1);
}

function createMarker(train, position) {
  var anchors = calculateIconAnchor(position);
  var icon = L.divIcon({
    className: 'train-icon train-' + train.trainIcon,
    iconSize: [18, 14],
    iconAnchor: anchors.iconAnchor,
    popupAnchor: anchors.popupAnchor
  });

  return new L.Marker(new L.LatLng(position.lat, position.lng), {
    icon: icon,
    title: `${train.etd.destination} bound train`,
    zIndexOffset: 1000
  });
}

function createTrainMarker(train) {
  // New train - calculate initial position based on ETA/legMins
  var actualLegMins = Math.max(train.etaMins, train.legMins); // sometimes the eta is greater than the legMins
  var legPercent = calculateRoutePercent(train.etaMins, actualLegMins);
  var position = getTrainPosition(train.forStation, train.prevStation, legPercent);
  var marker = createMarker(train, position);

  var trainMarker = {
    train: train,
    position: position,
    marker: marker,
    actualLegMins: actualLegMins,
    // Animation state
    beginTimeMsec: Date.now(),
    animationDuration: 60000,
    beginLegPercent: legPercent,
    currentLegPercent: legPercent,
    moveToPercent: calculateRoutePercent(train.etaMins - 1, actualLegMins),
    lastEtaMins: train.etaMins,
    lastStation: train.forStation,
  };

  // Store reference to trainMarker object for click handler
  marker._trainMarkerRef = null;

  setTrainPopup(marker, train);
  return trainMarker;
}

function updateTrainMarker(trainMarker) {
  var train = trainMarker.train;

  if (train.forStation != trainMarker.lastStation) {
    trainMarker.beginLegPercent = 0;
    trainMarker.currentLegPercent = 0;
    trainMarker.actualLegMins = Math.max(train.etaMins, train.legMins);
    trainMarker.lastEtaMins = -1; // force recompute route
    trainMarker.lastStation = train.forStation;
  }

  // Check if ETA changed
  if (train.etaMins != trainMarker.lastEtaMins) {
    // ETA changed - calculate where train currently is in the animation and use that as the new starting point
    trainMarker.beginTimeMsec = Date.now();
    // Use faster animation (15 seconds) when train has 0 leg (aka is "Leaving") to quickly reach station, otherwise a minute
    trainMarker.animationDuration = train.legMins == 0 ? 15000 : 60000;
    trainMarker.beginLegPercent = trainMarker.currentLegPercent;
    trainMarker.moveToPercent = calculateRoutePercent(train.etaMins - 1, trainMarker.actualLegMins); // Animate to new target over 1 minute

    // Update tracking state
    trainMarker.lastEtaMins = train.etaMins;
  }

  setTrainPopup(trainMarker.marker, train);
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
  // Add Show ETA button
  markerText += '&nbsp;&nbsp;<button class="show-eta-btn" onclick="onShowETAClick()">ETA</button>';

  if (estimate.minutes == 'Leaving') {
    markerText += '<br>Leaving Station: <b>' + stations[station.abbr].name + '</b>';
  } else {
    markerText += '<br>Next Station: <b>' + stations[station.abbr].name + '</b> in ' + estimate.minutes + ' min' + debug(' (total ' + threshold + ')');
  }

  markerText += debug('<br> ' + getTrainShortInfo(train));

  if (estimate.delay > 0) {
    markerText += '<br>Delayed: <b>' + secondsToMins(estimate.delay) + '</b> mins.';
  }

  marker.bindPopup(markerText);
}

function moveTrains() {
  var now = Date.now();

  liveTrains.forEach(function (trainMarker) {
    // Skip if no animation needed (already at target)
    if (trainMarker.currentLegPercent >= trainMarker.moveToPercent) {
      return;
    }

    var train = trainMarker.train;
    // Calculate animation progress (0 to 1 over animationDuration)
    var elapsed = now - trainMarker.beginTimeMsec;
    var animationProgress = Math.min(1, elapsed / trainMarker.animationDuration);

    // Interpolate between current and target percentages of the current leg
    var begin = trainMarker.beginLegPercent;
    var final = trainMarker.moveToPercent;
    trainMarker.currentLegPercent = begin + (final - begin) * animationProgress;

    var newPosition = getTrainPosition(train.forStation, train.prevStation, trainMarker.currentLegPercent);

    if (newPosition) {
      trainMarker.position.lat = newPosition.lat;
      trainMarker.position.lng = newPosition.lng;
      trainMarker.position.bearing = newPosition.bearing;
      trainMarker.marker.setLatLng(trainMarker.position);

      // Update icon anchor based on new bearing
      var anchors = calculateIconAnchor(newPosition);
      var currentIcon = trainMarker.marker.options.icon;

      // Create a new icon with updated anchors while preserving other properties
      if (currentIcon.options.iconAnchor[0] !== anchors.iconAnchor[0]) {
        var updatedIcon = L.divIcon({
          className: currentIcon.options.className,
          html: currentIcon.options.html,
          iconSize: currentIcon.options.iconSize,
          iconAnchor: anchors.iconAnchor,
          popupAnchor: anchors.popupAnchor
        });
        trainMarker.marker.setIcon(updatedIcon);
      }
    }
  });
}

/*----------------------------------------------------------------------*\
    Train Selection and Station Train ETA
\*----------------------------------------------------------------------*/
function onTrainClick(trainMarker) {
  // Clear any existing ETAs when clicking a different train
  if (selectedTrain !== trainMarker) {
    clearStationTrainETA();
  }

  // Update selection
  selectedTrain = trainMarker;
}

function onShowETAClick() {
  if (!selectedTrain) {
    return;
  }
  // Toggle ETAs if already showing for this train
  if (stationTrainETA.length > 0) {
    clearStationTrainETA();
    return;
  }

  // Validate route exists
  var train = selectedTrain.train;
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
    className: 'station-train-eta',
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

function debugInfo(text) {
  if (text === "<clear>") {
    debugText = "";
  }
  debugText = text + '<br>' + debugText.substring(0, 30_000);
  $('#debugOutput').html(debugText);
}

function sizeWindow() {
  $('#map').height($(window).height() - 40);
  // Invalidate Leaflet map size to make it react to resize
  if (map) {
    map.invalidateSize();
  }
}

function developmentMode() {
  debugMode = !debugMode;
  $('#development')[0].style.visibility = debugMode
    ? 'visible'
    : '';
  if (debugMode) drawRoutePath();
}

/*----------------------------------------------------------------------*\
    Route Filtering
\*----------------------------------------------------------------------*/
function toggleRouteFilter(color) {
  // Toggle: if same color clicked, clear filter; otherwise set new filter
  if (selectedRouteColor === color) {
    selectedRouteColor = null;
  } else {
    selectedRouteColor = color;
  }

  // Update UI to show which route is selected
  $('.route-filter').removeClass('active');
  if (selectedRouteColor) {
    $('.route-filter[data-color="' + selectedRouteColor + '"]').addClass('active');
  }

  // Update train visibility
  updateTrainVisibility();
}

function updateTrainVisibility() {
  liveTrains.forEach(function(trainMarker) {
    var trainColor = trainMarker.train.color;
    if (!selectedRouteColor || trainColor === selectedRouteColor) {
      trainMarker.marker.setOpacity(1);
    } else {
      trainMarker.marker.setOpacity(0.25);
    }
  });
}

// On page load
$(document).ready(function() {
  sizeWindow();
  window.onresize = sizeWindow;
  setupMap();
  buildTimes();
  getBART();
  setInterval(getBART, FREQ_GET_BART);
  setInterval(moveTrains, FREQ_MOVE_TRAINS);
});
