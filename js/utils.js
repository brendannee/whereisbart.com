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
