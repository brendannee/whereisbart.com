# WhereisBART.com

Whereisbart.com is a live visualization of the estimated positions of all BART ([Bay Area Rapid Transit](https://bart.gov)) trains.
The positions are estimated using realtime arrival predictions from the [BART API](https://www.bart.gov/schedules/developers/api.aspx).
The estimated travel time between all stations was determined and trains are plotted on a map.
The map assumes normal operating conditions - any delays in the BART system will cause the estimated positions on the map to be inaccurate.

The map layer is the [Google Transit layer](https://blinktag.com/google-transit-layer-through-google-maps-api/).

The data is queried every 5 seconds and refreshed as needed.

## Live Site

A live version of this code is at [https://whereisbart.com](https://whereisbart.com)

## Source Code
The source code is available on [github](https://github.com/brendannee/whereisbart.com).

## Credits

Brendan Nee  me@bn.ee
Jedidiah Horne jedidiah.horne@gmail.com
Salva Maiorano salva.bart@maiorano.club

## Updates

- Oct-2018
improve active train location
move trains smoothly to the new position
station info when selected
more space for the map
change train icons
debug mode when clicking the legend station icon

# Known issues
last leg is always missing (bart does not provide this info)
the Antioch / SFO-Milbrae line is messy, since trins go/return to/from SFIA and BLBR
in Antioch trains always leave with destination MLBR, and then it changes when they reach PITT


## License

(The MIT License)

Copyright (c) 2012 Brendan Nee &lt;me@bn.ee&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
