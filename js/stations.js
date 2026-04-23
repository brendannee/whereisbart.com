var stations = {
  'ANTC': {
    lat: 37.995368,
    lng: -121.780374,
    name: 'Antioch',
    iconAbbreviation: 'A',
    platform1Dir: 'End',
    platform2Dir: 'W'
  },
  '12TH': {
    lat: 37.803768,
    lng: -122.271450,
    name: '12th St. Oakland City Center',
    iconAbbreviation: '12',
    platform1Dir: 'N',
    platform2Dir: 'S',
    platform3Dir: 'N'
  },
  '16TH': {
    lat: 37.765214,
    lng: -122.419431,
    name: '16th St. Mission',
    iconAbbreviation: '16',
    platform1Dir: 'S',
    platform2Dir: 'N'
  },
  '19TH': {
    lat: 37.808846,
    lng: -122.268513,
    name: '19th St. Oakland',
    iconAbbreviation: '19',
    platform1Dir: 'N',
    platform2Dir: 'S',
    platform3Dir: 'N'
  },
  '24TH': {
    lat: 37.752423,
    lng: -122.418294,
    name: '24th St. Mission',
    iconAbbreviation: '24',
    platform1Dir: 'S',
    platform2Dir: 'N'
  },
  ASHB: {
    lat: 37.853030,
    lng: -122.269957,
    name: 'Ashby',
    iconAbbreviation: 'AS',
    platform1Dir: 'N',
    platform2Dir: 'S'
  },
  BALB: {
    lat: 37.721946,
    lng: -122.447433,
    name: 'Balboa Park',
    iconAbbreviation: 'BP',
    platform1Dir: 'SW',
    platform2Dir: 'NE'
  },
  BAYF: {
    lat: 37.696924,
    lng: -122.126514,
    name: 'Bay Fair',
    iconAbbreviation: 'BF',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  BERY: {
    lat: 37.368583,
    lng: -121.874734,
    name: 'Berryessa / North San José Station',
    iconAbbreviation: 'B',
    platform1Dir: 'N',
    platform2Dir: 'N'
  },
  DBRK: {
    lat: 37.869784,
    lng: -122.267983,
    name: 'Downtown Berkeley',
    iconAbbreviation: 'DB',
    platform1Dir: 'N',
    platform2Dir: 'S',
  },
  CAST: {
    lat: 37.690746,
    lng: -122.075602,
    name: 'Castro Valley',
    iconAbbreviation: 'CV',
    platform1Dir: 'E',
    platform2Dir: 'W'
  },
  CIVC: {
    lat: 37.779732,
    lng: -122.414123,
    name: 'Civic Center/UN Plaza',
    iconAbbreviation: 'CC',
    platform1Dir: 'SW',
    platform2Dir: 'NE'
  },
  COLS: {
    lat: 37.753661,
    lng: -122.196869,
    name: 'Coliseum',
    iconAbbreviation: 'CL',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  COLM: {
    lat: 37.684638,
    lng: -122.466233,
    name: 'Colma',
    iconAbbreviation: 'CM',
    platform1Dir: 'SE',
    platform2Dir: 'N'
  },
  CONC: {
    lat: 37.973737,
    lng: -122.029095,
    name: 'Concord',
    iconAbbreviation: 'CO',
    platform1Dir: 'N',
    platform2Dir: 'S'
  },
  DALY: {
    lat: 37.706058,
    lng: -122.469084,
    name: 'Daly City',
    iconAbbreviation: 'DC',
    platform1Dir: 'NE',
    platform2Dir: 'NE',
    platform3Dir: 'S'
  },
  DUBL: {
    lat: 37.701687,
    lng: -121.899179,
    name: 'Dublin/Pleasanton',
    iconAbbreviation: 'DP',
    platform1Dir: 'End',
    platform2Dir: 'W'
  },
  DELN: {
    lat: 37.925086,
    lng: -122.316794,
    name: 'El Cerrito del Norte',
    iconAbbreviation: 'DN',
    platform1Dir: 'NW',
    platform2Dir: 'SE',
  },
  PLZA: {
    lat: 37.902632,
    lng: -122.298904,
    name: 'El Cerrito Plaza',
    iconAbbreviation: 'EC',
    platform1Dir: 'NW',
    platform2Dir: 'SE',
  },
  EMBR: {
    lat: 37.793011,
    lng: -122.396815,
    name: 'Embarcadero',
    iconAbbreviation: 'E',
    platform1Dir: 'SW',
    platform2Dir: 'NE'
  },
  FRMT: {
    lat: 37.557315,
    lng: -121.976395,
    name: 'Fremont',
    iconAbbreviation: 'F',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  FTVL: {
    lat: 37.774539,
    lng: -122.224317,
    name: 'Fruitvale',
    iconAbbreviation: 'FV',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  GLEN: {
    lat: 37.732893,
    lng: -122.434087,
    name: 'Glen Park',
    iconAbbreviation: 'GP',
    platform1Dir: 'SW',
    platform2Dir: 'NE'
  },
  HAYW: {
    lat: 37.669723,
    lng: -122.087018,
    name: 'Hayward',
    iconAbbreviation: 'H',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  LAFY: {
    lat: 37.893176,
    lng: -122.124630,
    name: 'Lafayette',
    iconAbbreviation: 'L',
    platform1Dir: 'E',
    platform2Dir: 'W'
  },
  LAKE: {
    lat: 37.797027,
    lng: -122.265180,
    name: 'Lake Merritt',
    iconAbbreviation: 'LM',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  MCAR: {
    lat: 37.829065,
    lng: -122.267040,
    name: 'MacArthur',
    iconAbbreviation: 'MA',
    platform1Dir: 'N',
    platform2Dir: 'S',
    platform3Dir: 'NE',
    platform4Dir: 'S'
  },
  MLBR: {
    lat: 37.600546,
    lng: -122.386408,
    name: 'Millbrae',
    iconAbbreviation: 'M',
    platform1Dir: 'End',
    platform2Dir: 'End',
    platform3Dir: 'NW'
  },
  MLPT: {
    lat: 37.4099929,
    lng: -121.890849,
    name: 'Milpitas',
    iconAbbreviation: 'MP',
    platform1Dir: 'S',
    platform2Dir: 'N'
  },
  MONT: {
    lat: 37.789298,
    lng: -122.401471,
    name: 'Montgomery',
    iconAbbreviation: 'MO',
    platform1Dir: 'SW',
    platform2Dir: 'NE'
  },
  NBRK: {
    lat: 37.873951,
    lng: -122.283862,
    name: 'North Berkeley',
    iconAbbreviation: 'NB',
    platform1Dir: 'NW',
    platform2Dir: 'SE',
  },
  NCON: {
    lat: 38.003193,
    lng: -122.024653,
    name: 'North Concord',
    iconAbbreviation: 'NC',
    platform1Dir: 'NE',
    platform2Dir: 'SW'
  },
  ORIN: {
    lat: 37.878232,
    lng: -122.183719,
    name: 'Orinda',
    iconAbbreviation: 'O',
    platform1Dir: 'NE',
    platform2Dir: 'SW'
  },
  PHIL: {
    lat: 37.928468,
    lng: -122.056012,
    name: 'Pleasant Hill/Contra Costa Centre',
    iconAbbreviation: 'PH',
    platform1Dir: 'NE',
    platform2Dir: 'SW'
  },
  POWL: {
    lat: 37.784471,
    lng: -122.407974,
    name: 'Powell St.',
    iconAbbreviation: 'PO',
    platform1Dir: 'SW',
    platform2Dir: 'NE'
  },
  ROCK: {
    lat: 37.844702,
    lng: -122.251371,
    name: 'Rockridge',
    iconAbbreviation: 'RO',
    platform1Dir: 'NE',
    platform2Dir: 'SW'
  },
  SBRN: {
    lat: 37.637761,
    lng: -122.416287,
    name: 'San Bruno',
    iconAbbreviation: 'SB',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  SANL: {
    lat: 37.721947,
    lng: -122.160844,
    name: 'San Leandro',
    iconAbbreviation: 'SL',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  SFIA: {
    lat: 37.615854,
    lng: -122.392502,
    name: 'SF Airport',
    iconAbbreviation: 'SFO',
    platform1Dir: 'W',
    platform2Dir: 'W'
  },
  SHAY: {
    lat: 37.634375,
    lng: -122.057189,
    name: 'South Hayward',
    iconAbbreviation: 'SH',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  SSAN: {
    lat: 37.664318,
    lng: -122.444000,
    name: 'South San Francisco',
    iconAbbreviation: 'SS',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  UCTY: {
    lat: 37.590630,
    lng: -122.017388,
    name: 'Union City',
    iconAbbreviation: 'UC',
    platform1Dir: 'SE',
    platform2Dir: 'NW'
  },
  WCRK: {
    lat: 37.905522,
    lng: -122.067527,
    name: 'Walnut Creek',
    iconAbbreviation: 'WC',
    platform1Dir: 'NE',
    platform2Dir: 'SW'
  },
  WOAK: {
    lat: 37.804872,
    lng: -122.295140,
    name: 'West Oakland',
    iconAbbreviation: 'WO',
    platform1Dir: 'W',
    platform2Dir: 'E'
  },
  PITT: {
    lat: 38.018914,
    lng: -121.945154,
    name: 'Pittsburg/Bay Point',
    iconAbbreviation: 'P',
    platform1Dir: 'E',
    platform2Dir: 'W'
  },
  PCTR: {
    lat: 38.016973,
    lng: -121.889496,
    name: 'Pittsburg Center',
    iconAbbreviation: 'PC',
    platform1Dir: 'E',
    platform2Dir: 'W'
  },
  RICH: {
    lat: 37.937164,
    lng: -122.353406,
    name: 'Richmond',
    iconAbbreviation: 'R',
    platform1Dir: 'End',
    platform2Dir: 'SE'
  },
  WDUB: {
    lat: 37.69976,
    lng: -121.92814,
    name: 'West Dublin/Pleasanton',
    iconAbbreviation: 'WD',
    platform1Dir: 'E',
    platform2Dir: 'W'
  },
  WARM: {
    lat: 37.501974,
    lng: -121.939250,
    name: 'Warm Springs',
    iconAbbreviation: 'WS',
    platform1Dir: 'S',
    platform2Dir: 'N'
  },
  OAKL: {
    lat: 37.713238,
    lng: -122.212191,
    name: 'Oakland International Airport',
    iconAbbreviation: 'OA',
    platform1Dir: 'W',
    platform2Dir: 'E'
  },
}

// Direction display mapping: abbreviation -> { arrow, label }
var platformDirections = {
  'N':   { label: '↑ North' },
  'S':   { label: '↓ South' },
  'E':   { label: '→ East' },
  'W':   { label: '← West' },
  'NE':  { label: '↗ Northeast' },
  'NW':  { label: '↖ Northwest' },
  'SE':  { label: '↘ Southeast' },
  'SW':  { label: '↙ Southwest' },
  'End': { label: 'ʘ End of Line' }
};
