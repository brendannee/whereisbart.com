function asArray(v) {
  if (!(v instanceof Array)) {
    v = [v];
  }
  return v;
}

function secondsToMins(secs) {
  var m = ~~(secs / 60);
  var s = ~~(secs % 60);
  return m + ':' + (
    s < 10
    ? '0'
    : '') + s;
}

function toInt(text) {
  return isNaN(text)
    ? 0
    : parseInt(text, 10);
}

function minsToTime(minutes) {
  var now = new Date();
  var futureTime = new Date(now.getTime() + minutes * 60000);
  var hours = futureTime.getHours();
  var mins = futureTime.getMinutes();
  return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
}

// Clamp a value between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Get timestamp in format YYYYMMDD_HHMMSS
function getFileNameTimestamp(now) {
  var timestamp = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
  return timestamp;
}