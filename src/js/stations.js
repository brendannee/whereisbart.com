var stations = {
  'ANTC': {
    lat: 37.995368,
    lng: -121.780374,
    name: 'Antioch',
    iconAbbreviation: 'A'
  },
  '12TH': {
    lat: 37.803066,
    lng: -122.271588,
    name: '12th St. Oakland City Center',
    iconAbbreviation: '12'
  },
  '16TH': {
    lat: 37.765214,
    lng: -122.419431,
    name: '16th St. Mission',
    iconAbbreviation: '16'
  },
  '19TH': {
    lat: 37.807593,
    lng: -122.268884,
    name: '19th St. Oakland',
    iconAbbreviation: '19'
  },
  '24TH': {
    lat: 37.752423,
    lng: -122.418294,
    name: '24th St. Mission',
    iconAbbreviation: '24'
  },
  ASHB: {
    lat: 37.853030,
    lng: -122.269957,
    name: 'Ashby',
    iconAbbreviation: 'AS'
  },
  BALB: {
    lat: 37.721946,
    lng: -122.447433,
    name: 'Balboa Park',
    iconAbbreviation: 'BP'
  },
  BAYF: {
    lat: 37.697756,
    lng: -122.127864,
    name: 'Bay Fair',
    iconAbbreviation: 'BF'
  },
  DBRK: {
    lat: 37.869784,
    lng: -122.267983,
    name: 'Downtown Berkeley',
    iconAbbreviation: 'DB'
  },
  CAST: {
    lat: 37.690744,
    lng: -122.077439,
    name: 'Castro Valley',
    iconAbbreviation: 'CV'
  },
  CIVC: {
    lat: 37.779224,
    lng: -122.413831,
    name: 'Civic Center/UN Plaza',
    iconAbbreviation: 'CC'
  },
  COLS: {
    lat: 37.753661,
    lng: -122.196869,
    name: 'Coliseum',
    iconAbbreviation: 'CL'
  },
  COLM: {
    lat: 37.684512,
    lng: -122.467368,
    name: 'Colma',
    iconAbbreviation: 'CM'
  },
  CONC: {
    lat: 37.972070,
    lng: -122.029910,
    name: 'Concord',
    iconAbbreviation: 'CO'
  },
  DALY: {
    lat: 37.706058,
    lng: -122.469084,
    name: 'Daly City',
    iconAbbreviation: 'DC'
  },
  DUBL: {
    lat: 37.701640,
    lng: -121.900349,
    name: 'Dublin/Pleasanton',
    iconAbbreviation: 'DP'
  },
  DELN: {
    lat: 37.925596,
    lng: -122.317207,
    name: 'El Cerrito del Norte',
    iconAbbreviation: 'DN'
  },
  PLZA: {
    lat: 37.903013,
    lng: -122.299258,
    name: 'El Cerrito Plaza',
    iconAbbreviation: 'EC'
  },
  EMBR: {
    lat: 37.793011,
    lng: -122.396815,
    name: 'Embarcadero',
    iconAbbreviation: 'E'
  },
  FRMT: {
    lat: 37.557315,
    lng: -121.976395,
    name: 'Fremont',
    iconAbbreviation: 'F'
  },
  FTVL: {
    lat: 37.774539,
    lng: -122.224317,
    name: 'Fruitvale',
    iconAbbreviation: 'FV'
  },
  GLEN: {
    lat: 37.732893,
    lng: -122.434087,
    name: 'Glen Park',
    iconAbbreviation: 'GP'
  },
  HAYW: {
    lat: 37.670331,
    lng: -122.088017,
    name: 'Hayward',
    iconAbbreviation: 'H'
  },
  LAFY: {
    lat: 37.893338,
    lng: -122.123809,
    name: 'Lafayette',
    iconAbbreviation: 'L'
  },
  LAKE: {
    lat: 37.797568,
    lng: -122.265344,
    name: 'Lake Merritt',
    iconAbbreviation: 'LM'
  },
  MCAR: {
    lat: 37.828391,
    lng: -122.267168,
    name: 'MacArthur',
    iconAbbreviation: 'MA'
  },
  MLBR: {
    lat: 37.600546,
    lng: -122.386408,
    name: 'Millbrae',
    iconAbbreviation: 'M'
  },
  MONT: {
    lat: 37.789298,
    lng: -122.401471,
    name: 'Montgomery',
    iconAbbreviation: 'MO'
  },
  NBRK: {
    lat: 37.873951,
    lng: -122.283862,
    name: 'North Berkeley',
    iconAbbreviation: 'NB'
  },
  NCON: {
    lat: 38.002613,
    lng: -122.025061,
    name: 'North Concord',
    iconAbbreviation: 'NC'
  },
  ORIN: {
    lat: 37.878232,
    lng: -122.183719,
    name: 'Orinda',
    iconAbbreviation: 'O'
  },
  PHIL: {
    lat: 37.927739,
    lng: -122.056818,
    name: 'Pleasant Hill/Contra Costa Centre',
    iconAbbreviation: 'PH'
  },
  POWL: {
    lat: 37.784957,
    lng: -122.406986,
    name: 'Powell St.',
    iconAbbreviation: 'PO'
  },
  ROCK: {
    lat: 37.844079,
    lng: -122.252641,
    name: 'Rockridge',
    iconAbbreviation: 'RO'
  },
  SBRN: {
    lat: 37.637029,
    lng: -122.415934,
    name: 'San Bruno',
    iconAbbreviation: 'SB'
  },
  SANL: {
    lat: 37.722485,
    lng: -122.161360,
    name: 'San Leandro',
    iconAbbreviation: 'SL'
  },
  SFIA: {
    lat: 37.615854,
    lng: -122.392502,
    name: 'SF Airport',
    iconAbbreviation: 'sfo'
  },
  SHAY: {
    lat: 37.634757,
    lng: -122.057569,
    name: 'South Hayward',
    iconAbbreviation: 'SH'
  },
  SSAN: {
    lat: 37.664318,
    lng: -122.444000,
    name: 'South San Francisco',
    iconAbbreviation: 'SS'
  },
  UCTY: {
    lat: 37.591209,
    lng: -122.017851,
    name: 'Union City',
    iconAbbreviation: 'UC'
  },
  WCRK: {
    lat: 37.904581,
    lng: -122.068276,
    name: 'Walnut Creek',
    iconAbbreviation: 'WC'
  },
  WOAK: {
    lat: 37.804660,
    lng: -122.294590,
    name: 'West Oakland',
    iconAbbreviation: 'WO'
  },
  PITT: {
    lat: 38.018742,
    lng: -121.942105,
    name: 'Pittsburg/Bay Point',
    iconAbbreviation: 'P'
  },
  PCTR: {
    lat: 38.016973,
    lng: -121.889496,
    name: 'Pittsburg Center',
    iconAbbreviation: 'PC'
  },
  RICH: {
    lat: 37.937164,
    lng: -122.353406,
    name: 'Richmond',
    iconAbbreviation: 'R'
  },
  WDUB: {
    lat: 37.69976,
    lng: -121.92814,
    name: 'West Dublin/Pleasanton',
    iconAbbreviation: 'WD'
  },
  WARM: {
    lat: 37.501974,
    lng: -121.939250,
    name: 'Warm Springs',
    iconAbbreviation: 'WS'
  },
  OAKL: {
    lat: 37.713238,
    lng: -122.212191,
    name: 'Oakland International Airport',
    iconAbbreviation: 'OA'
  },
}
