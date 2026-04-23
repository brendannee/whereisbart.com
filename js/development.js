/*----------------------------------------------------------------------*\
    Debugging Tools
\*----------------------------------------------------------------------*/
var lastReceivedData = null;
var allReceivedData = null; // Array to store all received data, newest first

function handleDebugMenuChange(select) {
  switch (select.value) {
    case 'track':
      toggleTracking();
      break;
    case 'save':
      saveCurrentData();
      break;
    case 'load':
      loadDataFromFile();
      break;
    case 'filter':
      showFilterDialog();
      break;
    case 'clear':
      debugInfo("<clear>");
      allReceivedData = null;
      break;
  }

  // Reset the dropdown to default
  select.value = '';
}

/*----------------------------------------------------------------------*\
    Tracking
\*----------------------------------------------------------------------*/
function toggleTracking() {
  if (!allReceivedData) {
    allReceivedData = [];
    debugInfo('Tracking ALL bart responses');
  } else {
    allReceivedData = null;
    debugInfo('Track only last response');
  }
}

function trackReceivedBartData(data) {
  // Only store in array if tracking is enabled and data is deeply different from lastReceivedData
  if (allReceivedData && !isDeepEqual(data, lastReceivedData, ['date', 'time'])) {
    allReceivedData.unshift(data); // Add to beginning (newest first)
  }

  // Always update lastReceivedData
  lastReceivedData = data;
}

// Deep equality comparison for objects
function isDeepEqual(obj1, obj2, ignoreKeys) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  var keys1 = Object.keys(obj1).filter(function(key) {
    return !ignoreKeys.includes(key);
  });
  var keys2 = Object.keys(obj2).filter(function(key) {
    return !ignoreKeys.includes(key);
  });
  if (keys1.length !== keys2.length) return false;

  for (var key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key], ignoreKeys)) return false;
  }
  return true;
}
/*----------------------------------------------------------------------*\
    Save Data
\*----------------------------------------------------------------------*/
function saveCurrentData() {
  var filename = 'bart_' + getFileNameTimestamp(new Date()) + (allReceivedData? '-list' : '')+'.json';

  // Convert data to JSON string
  let dataToSave = allReceivedData ? allReceivedData : lastReceivedData;
  var jsonString = JSON.stringify(dataToSave, null, 2);

  // Create blob and download link
  var blob = new Blob([jsonString], {type: 'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/*----------------------------------------------------------------------*\
    Load Data
\*----------------------------------------------------------------------*/
function loadDataFromFile() {
  // Create a temporary file input element
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  // Handle file selection
  input.onchange = function (e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        lastProcTime = "Manual"
        removeLiveTrains()
        debugInfo("<clear>")
        // Check if data is an array of entries
        if (Array.isArray(data)) {
          // Process entries from last to first to simulate original chronological order
          // (array is stored newest first, so we reverse to process oldest first)
          for (var i = data.length - 1; i >= 0; i--) {
            processBARTjson(data[i]);
          }
          debugInfo('Load: ' + file.name + ': ' + data.length + ' entries');
        } else {
          // Single data entry
          processBARTjson(data);
          debugInfo('Load: ' + file.name);
        }
      } catch (err) {
        console.error('Error parsing JSON file:', err);
      }
    };

    reader.readAsText(file);
  };

  // Trigger the file picker
  input.click();
}

/*----------------------------------------------------------------------*\
    Filter Data
\*----------------------------------------------------------------------*/
function showFilterDialog() {
  // Create the file input first to maintain user gesture
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  // Trigger file picker immediately
  input.click();

  // Handle file selection
  input.onchange = function (e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var filters = promptFilters();

    // Check if any filters were provided
    if (Object.keys(filters).length === 0) {
      alert('No filters specified. Please provide at least one filter.');
      return;
    }

    // Process the file with filters
    var reader = new FileReader();

    reader.onload = function (e) {
      try {
        filterAndSave(e.target.result, filters);

      } catch (err) {
        console.error('Error processing JSON file:', err);
        debugInfo('Error: ' + err.message);
      }
    };

    reader.readAsText(file);
  };
}

function promptFilters() {
  // Now prompt for filters after file is selected
  var filters = {};

  // Prompt for color
  var color = prompt('Enter line color (ORANGE, YELLOW, RED, GREEN, BLUE) or leave empty:');
  if (color && color.trim()) {
    filters.color = color.trim().toUpperCase();
  }

  // Prompt for destination
  var destination = prompt('Enter destination station code (e.g., BERY) or leave empty:');
  if (destination && destination.trim()) {
    filters.destination = destination.trim().toUpperCase();
  }

  // Prompt for station
  var station = prompt('Enter station code (e.g., LAKE) or leave empty:');
  if (station && station.trim()) {
    filters.station = station.trim().toUpperCase();
  }

  // Show what filters will be applied
  var filterDesc = 'Applying filters:\n';
  if (filters.destination) filterDesc += '- Destination: ' + filters.destination + '\n';
  if (filters.color) filterDesc += '- Color: ' + filters.color + '\n';
  if (filters.station) filterDesc += '- Station: ' + filters.station + ' (includes next station)\n';
  debugInfo(filterDesc.replace(/\n/g, '<br>'));

  return filters;
}

function filterAndSave(fileData, filters) {
  var data = JSON.parse(fileData);
  var filteredData;

  // Check if data is an array of entries
  if (Array.isArray(data)) {
    filteredData = data.map(entry => filterDataEntry(entry, filters));
  } else {
    // Single data entry
    filteredData = filterDataEntry(data, filters);
  }

  // Generate output filename
  var timestamp = getFileNameTimestamp(new Date());
  var outputFilename = 'bart_' + timestamp + '-filtered' + '.json';

  // Save filtered data
  var jsonString = JSON.stringify(filteredData, null, 2);
  var blob = new Blob([jsonString], {type: 'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = outputFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  debugInfo('Filtered data saved to: ' + outputFilename);
}

function filterDataEntry(dataEntry, filters) {
  // Clone the data entry to avoid modifying the original
  var filtered = JSON.parse(JSON.stringify(dataEntry));

  if (!filtered.station || !Array.isArray(filtered.station)) {
    return filtered;
  }

  // First, collect next stations if station filter is specified
  var nextStations = new Set();
  if (filters.station) {
    asArray(dataEntry.station).forEach(function(station) {
      if (station.abbr === filters.station && station.etd) {
        asArray(station.etd).forEach(function(destination) {
          if (destination.estimate) {
            asArray(destination.estimate).forEach(function(estimate) {
              // Get route info to find next station
              if (typeof getRouteInfo === 'function') {
                var route = getRouteInfo(estimate.color, station.abbr, destination.abbreviation);
                if (route && route.next) {
                  nextStations.add(route.next);
                }
              }
            });
          }
        });
      }
    });
  }

  // Filter stations
  filtered.station = asArray(filtered.station).filter(function(station) {
    // If station filter is specified, only include the specified station and next stations
    if (filters.station) {
      var isTargetStation = station.abbr === filters.station;
      var isNextStation = nextStations.has(station.abbr);

      if (!isTargetStation && !isNextStation) {
        return false;
      }
    }

    // Filter ETDs (estimated departures) within the station
    if (station.etd) {
      var originalEtds = asArray(station.etd).slice(); // Keep a copy

      station.etd = asArray(station.etd).filter(function(destination) {
        // Filter by destination abbreviation
        if (filters.destination && destination.abbreviation !== filters.destination) {
          return false;
        }

        // Filter estimates by color
        if (filters.color && destination.estimate) {
          destination.estimate = asArray(destination.estimate).filter(function(estimate) {
            return estimate.color === filters.color;
          });

          // Remove destination if no estimates remain after filtering
          return destination.estimate.length > 0;
        }

        return true;
      });

      // Keep only the first estimate in each destination's estimate array
      station.etd.forEach(function(destination) {
        if (destination.estimate && Array.isArray(destination.estimate) && destination.estimate.length > 0) {
          destination.estimate = [destination.estimate[0]];
        }
      });

      // For next stations, keep all ETDs if no other filters are specified
      // Otherwise, remove station if no ETDs remain after filtering
      if (station.etd.length === 0) {
        return false;
      }
    }

    return true;
  });

  return filtered;
}