// source: http://api.bart.gov/api/route.aspx?cmd=routeinfo&key=MW9S-E7SL-26DU-VV8V&route=##
var routes = {
'YELLOW': {
  iconDown: 'yellow-mlbr', iconUp: 'yellow-antc',
  stations: ['MLBR','SFIA','SBRN','SSAN','COLM','DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','12TH','19TH','MCAR','ROCK','ORIN','LAFY','WCRK','PHIL','CONC','NCON','PITT','PCTR','ANTC'], // ##=2
},
'ORANGE': {
  iconDown: 'orange-warm', iconUp: 'orange-rich',
  stations: ['WARM','FRMT','UCTY','SHAY','HAYW','BAYF','SANL','COLS','FTVL','LAKE','12TH','19TH','MCAR','ASHB','DBRK','NBRK','PLZA','DELN','RICH'], // ##=3
},
'GREEN':  {
  iconDown: 'green-warm', iconUp: 'green-daly',
  stations: ['WARM','FRMT','UCTY','SHAY','HAYW','BAYF','SANL','COLS','FTVL','LAKE','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY'], // ##=5
},
'RED':    {
  iconDown: 'red-mlbr', iconUp: 'red-rich',
  stations: ['MLBR','SBRN','SSAN','COLM','DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','12TH','19TH','MCAR','ASHB','DBRK','NBRK','PLZA','DELN','RICH'], // ##=8
},
'BLUE':   {
  iconDown: 'blue-daly', iconUp: 'blue-dubl',
  stations: ['DALY','BALB','GLEN','24TH','16TH','CIVC','POWL','MONT','EMBR','WOAK','LAKE','FTVL','COLS','SANL','BAYF','CAST','WDUB','DUBL'], // ##=12
},
'BEIGE':  {
  iconDown: 'beige-oakl', iconUp: 'beige-cols',
  stations: ['OAKL','COLS'],  // ##=19
},
}