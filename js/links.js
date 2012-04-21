/**
 * Notes:  `start` is always south of `end`
 */

var links = [
{
    id: 1
  , start: 'SFIA'
  , end: 'SBRN'
  , color: ['c43fc8']
  , time: 5
},
{
    id: 2
  , start: 'MLBR'
  , end: 'SBRN'
  , color: ['c43fc8']
  , time: 5
  , endpoint: 'South'
},
{
    id: 3
  , start: 'SBRN'
  , end: 'SSAN'
  , color: ['c43fc8']
  , time: 5
},
{
    id: 4
  , start: 'SSAN'
  , end: 'COLM'
  , color: ['c43fc8']
  , time: 3
},
{
    id: 5
  , start: 'COLM'
  , end: 'DALY'
  , color: ['c43fc8']
  , time: 4
},
{
    id: 6
  , start: 'DALY'
  , end: 'BALB'
  , color: ['c43fc8']
  , time: 4
},
{
    id: 7
  , start: 'BALB'
  , end: 'GLEN'
  , color: ['c43fc8']
  , time: 2
},
{
    id: 8
  , start: 'GLEN'
  , end: '24TH'
  , color: ['c43fc8']
  , time: 3
},
{
    id: 9
  , start: '24TH'
  , end: '16TH'
  , color: ['c43fc8']
  , time: 2
},
{
    id: 10
  , start: '16TH'
  , end: 'CIVC'
  , color: ['c43fc8']
  , time: 2
},
{
    id: 11
  , start: 'CIVC'
  , end: 'POWL'
  , color: ['c43fc8']
  , time: 2
},
{
    id: 12
  , start: 'POWL'
  , end: 'MONT'
  , color: ['c43fc8']
  , time: 2
},
{
    id: 13
  , start: 'MONT'
  , end: 'EMBR'
  , color: ['c43fc8']
  , time: 1
},
{
    id: 14
  , start: 'EMBR'
  , end: 'WOAK'
  , color: ['c43fc8']
  , time: 8
},
{
    id: 15
  , start: 'WOAK'
  , end: '12TH'
  , color: ['f8ff00', 'ff0000']
  , time: 4
},
{
    id: 16
  , start: '12TH'
  , end: '19TH'
  , color: ['f8ff00', 'ff0000']
  , time: 1
},
{
    id: 17
  , start: '19TH'
  , end: 'MCAR'
  , color: ['f8ff00', 'ff0000']
  , time: 3
},
{
    id: 18
  , start: 'MCAR'
  , end: 'ASHB'
  , color: ['ff0000']
  , time: 4
},
{
    id: 19
  , start: 'ASHB'
  , end: 'DBRK'
  , color: ['ff0000']
  , time: 2
},
{
    id: 20
  , start: 'DBRK'
  , end: 'NBRK'
  , color: ['ff0000']
  , time: 3
},
{
    id: 21
  , start: 'NBRK'
  , end: 'PLZA'
  , color: ['ff0000']
  , time: 3
},
{
    id: 22
  , start: 'PLZA'
  , end: 'DELN'
  , color: ['ff0000']
  , time: 3
},
{
    id: 23
  , start: 'DELN'
  , end: 'RICH'
  , color: ['ff0000']
  , time: 4
  , endpoint: 'North'
},
{
    id: 24
  , start: 'FRMT'
  , end: 'UCTY'
  , color: ['00a500']
  , time: 5
  , endpoint: 'South'
},
{
    id: 25
  , start: 'UCTY'
  , end: 'SHAY'
  , color: ['00a500']
  , time: 5
},
{
    id: 26
  , start: 'SHAY'
  , end: 'HAYW'
  , color: ['00a500']
  , time: 4
},
{
    id: 27
  , start: 'HAYW'
  , end: 'BAYF'
  , color: ['00a500']
  , time: 4
},
{
    id: 28
  , start: 'WDUB'
  , end: 'DUBL'
  , color: ['004cff']
  , time: 2
  , endpoint: 'North'
},
{
    id: 44
  , start: 'CAST'
  , end: 'WDUB'
  , color: ['004cff']
  , time: 11
},
{
    id: 29
  , start: 'BAYF'
  , end: 'CAST'
  , color: ['004cff']
  , time: 5
},
{
    id: 30
  , start: 'BAYF'
  , end: 'SANL'
  , color: ['00a500','004cff']
  , time: 4
},
{
    id: 31
  , start: 'SANL'
  , end: 'COLS'
  , color: ['00a500','004cff']
  , time: 4
},
{
    id: 32
  , start: 'COLS'
  , end: 'FTVL'
  , color: ['00a500','004cff']
  , time: 3
},
{
    id: 33
  , start: 'FTVL'
  , end: 'LAKE'
  , color: ['00a500','004cff']
  , time: 5
},
{
    id: 34
  , start: 'LAKE'
  , end: '12TH'
  , color: ['00a500','004cff']
  , time: 3
},
{
    id: 35
  , start: 'MCAR'
  , end: 'ROCK'
  , color: ['f8ff00']
  , time: 3
},
{
    id: 36
  , start: 'ROCK'
  , end: 'ORIN'
  , color: ['f8ff00']
  , time: 5
},
{
    id: 37
  , start: 'ORIN'
  , end: 'LAFY'
  , color: ['f8ff00']
  , time: 5
},
{
    id: 38
  , start: 'LAFY'
  , end: 'WCRK'
  , color: ['f8ff00']
  , time: 4
},
{
    id: 39
  , start: 'WCRK'
  , end: 'PHIL'
  , color: ['f8ff00']
  , time: 3
},
{
    id: 40
  , start: 'PHIL'
  , end: 'CONC'
  , color: ['f8ff00']
  , time: 5
},
{
    id: 41
  , start: 'CONC'
  , end: 'NCON'
  , color: ['f8ff00']
  , time: 4
},
{
    id: 42
  , start: 'NCON'
  , end: 'PITT'
  , color: ['f8ff00']
  , time: 6
  , endpoint: 'North'
},
{
    id: 43
  , start: 'WOAK'
  , end: 'LAKE'
  , color: ['00a500','004cff']
  , time: 4
}
]
