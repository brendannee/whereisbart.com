// BART route path extracted from official GTFS data
// Source: https://www.bart.gov/dev/schedules/google_transit.zip
// Each segment contains waypoints between two stations (max 10 intermediate points)
// Simplified with 1% deviation threshold to reduce data size

var routePath = [
  // 12TH to 19TH
  { start: '12TH', end: '19TH', waypoints: [
    {lat: 37.803110, lng: -122.271865}, // 12TH
    {lat: 37.807541, lng: -122.269103} // 19TH
  ]},
  // 12TH to LAKE
  { start: '12TH', end: 'LAKE', waypoints: [
    {lat: 37.803255, lng: -122.271777}, // 12TH
    {lat: 37.802765, lng: -122.272088},
    {lat: 37.801760, lng: -122.272624},
    {lat: 37.801215, lng: -122.272606},
    {lat: 37.800323, lng: -122.271846},
    {lat: 37.800053, lng: -122.271244},
    {lat: 37.798561, lng: -122.267543},
    {lat: 37.797322, lng: -122.265257} // LAKE
  ]},
  // 12TH to WOAK
  { start: '12TH', end: 'WOAK', waypoints: [
    {lat: 37.803010, lng: -122.271928}, // 12TH
    {lat: 37.801555, lng: -122.272903},
    {lat: 37.799557, lng: -122.274049},
    {lat: 37.798540, lng: -122.275622},
    {lat: 37.798797, lng: -122.278332},
    {lat: 37.800808, lng: -122.282459},
    {lat: 37.801748, lng: -122.284954},
    {lat: 37.802815, lng: -122.289609},
    {lat: 37.803676, lng: -122.292152},
    {lat: 37.804674, lng: -122.294619} // WOAK
  ]},
  // 16TH to 24TH
  { start: '16TH', end: '24TH', waypoints: [
    {lat: 37.765036, lng: -122.419705}, // 16TH
    {lat: 37.752440, lng: -122.418485} // 24TH
  ]},
  // 16TH to CIVC
  { start: '16TH', end: 'CIVC', waypoints: [
    {lat: 37.765451, lng: -122.419743}, // 16TH
    {lat: 37.770925, lng: -122.420304},
    {lat: 37.772571, lng: -122.420342},
    {lat: 37.773645, lng: -122.420066},
    {lat: 37.775099, lng: -122.419110},
    {lat: 37.779434, lng: -122.413814} // CIVC
  ]},
  // 19TH to MCAR
  { start: '19TH', end: 'MCAR', waypoints: [
    {lat: 37.807541, lng: -122.269103}, // 19TH
    {lat: 37.809016, lng: -122.268179},
    {lat: 37.811062, lng: -122.268252},
    {lat: 37.812253, lng: -122.269687},
    {lat: 37.814218, lng: -122.270847},
    {lat: 37.816389, lng: -122.270594},
    {lat: 37.828170, lng: -122.267234} // MCAR
  ]},
  // 24TH to GLEN
  { start: '24TH', end: 'GLEN', waypoints: [
    {lat: 37.752440, lng: -122.418485}, // 24TH
    {lat: 37.750251, lng: -122.418263},
    {lat: 37.748067, lng: -122.418405},
    {lat: 37.746062, lng: -122.419524},
    {lat: 37.742163, lng: -122.422076},
    {lat: 37.740272, lng: -122.423479},
    {lat: 37.738652, lng: -122.425340},
    {lat: 37.733032, lng: -122.433847} // GLEN
  ]},
  // ANTC to PCTR
  { start: 'ANTC', end: 'PCTR', waypoints: [
    {lat: 37.995389, lng: -121.780434}, // ANTC
    {lat: 37.997005, lng: -121.789933},
    {lat: 37.998254, lng: -121.800192},
    {lat: 37.998232, lng: -121.810603},
    {lat: 37.999239, lng: -121.820846},
    {lat: 38.016943, lng: -121.889453} // PCTR
  ]},
  // ASHB to DBRK
  { start: 'ASHB', end: 'DBRK', waypoints: [
    {lat: 37.853012, lng: -122.269806}, // ASHB
    {lat: 37.858800, lng: -122.267622},
    {lat: 37.860413, lng: -122.267209},
    {lat: 37.861509, lng: -122.267131},
    {lat: 37.863153, lng: -122.267256},
    {lat: 37.869712, lng: -122.268083} // DBRK
  ]},
  // ASHB to MCAR
  { start: 'ASHB', end: 'MCAR', waypoints: [
    {lat: 37.853166, lng: -122.269746}, // ASHB
    {lat: 37.851068, lng: -122.270567},
    {lat: 37.848934, lng: -122.271214},
    {lat: 37.846745, lng: -122.271153},
    {lat: 37.839701, lng: -122.269683},
    {lat: 37.837617, lng: -122.268841},
    {lat: 37.835324, lng: -122.266940},
    {lat: 37.833214, lng: -122.266260},
    {lat: 37.828330, lng: -122.267203} // MCAR
  ]},
  // BALB to DALY
  { start: 'BALB', end: 'DALY', waypoints: [
    {lat: 37.722214, lng: -122.447378}, // BALB
    {lat: 37.720048, lng: -122.447842},
    {lat: 37.717867, lng: -122.448168},
    {lat: 37.715340, lng: -122.449437},
    {lat: 37.713653, lng: -122.451204},
    {lat: 37.711701, lng: -122.453636},
    {lat: 37.710476, lng: -122.455909},
    {lat: 37.710090, lng: -122.459306},
    {lat: 37.710120, lng: -122.462071},
    {lat: 37.709813, lng: -122.465463},
    {lat: 37.708206, lng: -122.467294},
    {lat: 37.706368, lng: -122.468808} // DALY
  ]},
  // BALB to GLEN
  { start: 'BALB', end: 'GLEN', waypoints: [
    {lat: 37.722082, lng: -122.447407}, // BALB
    {lat: 37.723163, lng: -122.447159},
    {lat: 37.724741, lng: -122.446576},
    {lat: 37.725723, lng: -122.445958},
    {lat: 37.727037, lng: -122.444714},
    {lat: 37.728112, lng: -122.443147},
    {lat: 37.728695, lng: -122.441976},
    {lat: 37.730188, lng: -122.438281},
    {lat: 37.732945, lng: -122.433976} // GLEN
  ]},
  // BAYF to CAST
  { start: 'BAYF', end: 'CAST', waypoints: [
    {lat: 37.697935, lng: -122.127954}, // BAYF
    {lat: 37.690408, lng: -122.116958},
    {lat: 37.688591, lng: -122.112805},
    {lat: 37.688883, lng: -122.107992},
    {lat: 37.690529, lng: -122.092930},
    {lat: 37.690746, lng: -122.077728} // CAST
  ]},
  // BAYF to HAYW
  { start: 'BAYF', end: 'HAYW', waypoints: [
    {lat: 37.697935, lng: -122.127954}, // BAYF
    {lat: 37.670242, lng: -122.087745} // HAYW
  ]},
  // BAYF to SANL
  { start: 'BAYF', end: 'SANL', waypoints: [
    {lat: 37.697849, lng: -122.127824}, // BAYF
    {lat: 37.719477, lng: -122.159103},
    {lat: 37.722350, lng: -122.161134} // SANL
  ]},
  // BERY to MLPT
  { start: 'BERY', end: 'MLPT', waypoints: [
    {lat: 37.368485, lng: -121.874710}, // BERY
    {lat: 37.398735, lng: -121.884826},
    {lat: 37.409818, lng: -121.890852} // MLPT
  ]},
  // CAST to BAYF
  { start: 'CAST', end: 'BAYF', waypoints: [
    {lat: 37.690749, lng: -122.077434}, // CAST
    {lat: 37.690581, lng: -122.091947},
    {lat: 37.688565, lng: -122.111820},
    {lat: 37.689898, lng: -122.116210},
    {lat: 37.697785, lng: -122.127728} // BAYF
  ]},
  // CAST to WDUB
  { start: 'CAST', end: 'WDUB', waypoints: [
    {lat: 37.690746, lng: -122.077728}, // CAST
    {lat: 37.693577, lng: -122.049975},
    {lat: 37.700387, lng: -122.039488},
    {lat: 37.700872, lng: -122.025685},
    {lat: 37.703065, lng: -122.012306},
    {lat: 37.703236, lng: -121.997832},
    {lat: 37.699479, lng: -121.984961},
    {lat: 37.697318, lng: -121.970710},
    {lat: 37.698430, lng: -121.957022},
    {lat: 37.698338, lng: -121.942506},
    {lat: 37.699741, lng: -121.928227} // WDUB
  ]},
  // CIVC to POWL
  { start: 'CIVC', end: 'POWL', waypoints: [
    {lat: 37.779434, lng: -122.413814}, // CIVC
    {lat: 37.784895, lng: -122.406993} // POWL
  ]},
  // COLM to DALY
  { start: 'COLM', end: 'DALY', waypoints: [
    {lat: 37.685130, lng: -122.466837}, // COLM
    {lat: 37.686349, lng: -122.468207},
    {lat: 37.688352, lng: -122.469340},
    {lat: 37.689942, lng: -122.469831},
    {lat: 37.694335, lng: -122.469905},
    {lat: 37.695947, lng: -122.470303},
    {lat: 37.698068, lng: -122.471000},
    {lat: 37.701912, lng: -122.471093},
    {lat: 37.704057, lng: -122.470698},
    {lat: 37.705899, lng: -122.469193} // DALY
  ]},
  // COLM to SSAN
  { start: 'COLM', end: 'SSAN', waypoints: [
    {lat: 37.685070, lng: -122.466742}, // COLM
    {lat: 37.681772, lng: -122.462111},
    {lat: 37.677825, lng: -122.458371},
    {lat: 37.675865, lng: -122.455968},
    {lat: 37.674480, lng: -122.453824},
    {lat: 37.672267, lng: -122.451810},
    {lat: 37.669796, lng: -122.450302},
    {lat: 37.667899, lng: -122.448915},
    {lat: 37.665929, lng: -122.446524},
    {lat: 37.664216, lng: -122.443823} // SSAN
  ]},
  // COLS to FTVL
  { start: 'COLS', end: 'FTVL', waypoints: [
    {lat: 37.753631, lng: -122.196789}, // COLS
    {lat: 37.767657, lng: -122.213345},
    {lat: 37.769826, lng: -122.215466},
    {lat: 37.771671, lng: -122.218013},
    {lat: 37.773096, lng: -122.220971},
    {lat: 37.775000, lng: -122.224358} // FTVL
  ]},
  // COLS to OAKL
  { start: 'COLS', end: 'OAKL', waypoints: [
    {lat: 37.753581, lng: -122.196728}, // COLS
    {lat: 37.750380, lng: -122.196858},
    {lat: 37.746068, lng: -122.196044},
    {lat: 37.741754, lng: -122.196890},
    {lat: 37.737959, lng: -122.196708},
    {lat: 37.733738, lng: -122.198125},
    {lat: 37.729624, lng: -122.200027},
    {lat: 37.725280, lng: -122.199585},
    {lat: 37.721605, lng: -122.200529},
    {lat: 37.718023, lng: -122.203567},
    {lat: 37.716216, lng: -122.208595},
    {lat: 37.713250, lng: -122.212226} // OAKL
  ]},
  // COLS to SANL
  { start: 'COLS', end: 'SANL', waypoints: [
    {lat: 37.753728, lng: -122.196906}, // COLS
    {lat: 37.725780, lng: -122.163665},
    {lat: 37.722468, lng: -122.161214} // SANL
  ]},
  // CONC to NCON
  { start: 'CONC', end: 'NCON', waypoints: [
    {lat: 37.972184, lng: -122.029790}, // CONC
    {lat: 37.974776, lng: -122.028647},
    {lat: 37.977453, lng: -122.028608},
    {lat: 37.980386, lng: -122.030488},
    {lat: 37.986112, lng: -122.032922},
    {lat: 37.988793, lng: -122.033616},
    {lat: 37.992017, lng: -122.032925},
    {lat: 38.002013, lng: -122.025669} // NCON
  ]},
  // CONC to PHIL
  { start: 'CONC', end: 'PHIL', waypoints: [
    {lat: 37.972210, lng: -122.029779}, // CONC
    {lat: 37.967458, lng: -122.031413},
    {lat: 37.962115, lng: -122.030040},
    {lat: 37.952187, lng: -122.025982},
    {lat: 37.946838, lng: -122.025192},
    {lat: 37.943172, lng: -122.029148},
    {lat: 37.931483, lng: -122.051813},
    {lat: 37.927737, lng: -122.056872} // PHIL
  ]},
  // DBRK to NBRK
  { start: 'DBRK', end: 'NBRK', waypoints: [
    {lat: 37.869712, lng: -122.268083}, // DBRK
    {lat: 37.870807, lng: -122.268193},
    {lat: 37.872437, lng: -122.268466},
    {lat: 37.873334, lng: -122.269230},
    {lat: 37.873744, lng: -122.271186},
    {lat: 37.872793, lng: -122.278712},
    {lat: 37.872798, lng: -122.280094},
    {lat: 37.873367, lng: -122.282033},
    {lat: 37.874138, lng: -122.283870} // NBRK
  ]},
  // DELN to PLZA
  { start: 'DELN', end: 'PLZA', waypoints: [
    {lat: 37.925681, lng: -122.317288}, // DELN
    {lat: 37.903385, lng: -122.299531} // PLZA
  ]},
  // DELN to RICH
  { start: 'DELN', end: 'RICH', waypoints: [
    {lat: 37.925543, lng: -122.317182}, // DELN
    {lat: 37.927876, lng: -122.319010},
    {lat: 37.930275, lng: -122.321804},
    {lat: 37.931182, lng: -122.325047},
    {lat: 37.931412, lng: -122.344454},
    {lat: 37.932211, lng: -122.347716},
    {lat: 37.934448, lng: -122.350763},
    {lat: 37.936737, lng: -122.353023} // RICH
  ]},
  // DUBL to WDUB
  { start: 'DUBL', end: 'WDUB', waypoints: [
    {lat: 37.701664, lng: -121.900625}, // DUBL
    {lat: 37.701827, lng: -121.917904},
    {lat: 37.701434, lng: -121.920621},
    {lat: 37.699806, lng: -121.927944} // WDUB
  ]},
  // EMBR to MONT
  { start: 'EMBR', end: 'MONT', waypoints: [
    {lat: 37.793136, lng: -122.396584}, // EMBR
    {lat: 37.789258, lng: -122.401486} // MONT
  ]},
  // EMBR to WOAK
  { start: 'EMBR', end: 'WOAK', waypoints: [
    {lat: 37.793041, lng: -122.396702}, // EMBR
    {lat: 37.797277, lng: -122.388669},
    {lat: 37.801017, lng: -122.380202},
    {lat: 37.803853, lng: -122.371251},
    {lat: 37.805478, lng: -122.361779},
    {lat: 37.807103, lng: -122.352305},
    {lat: 37.808727, lng: -122.342832},
    {lat: 37.809841, lng: -122.333253},
    {lat: 37.809538, lng: -122.323587},
    {lat: 37.808616, lng: -122.313965},
    {lat: 37.807426, lng: -122.304401},
    {lat: 37.804686, lng: -122.294649} // WOAK
  ]},
  // FRMT to UCTY
  { start: 'FRMT', end: 'UCTY', waypoints: [
    {lat: 37.557462, lng: -121.976609}, // FRMT
    {lat: 37.559998, lng: -121.980238},
    {lat: 37.563222, lng: -121.983987},
    {lat: 37.570285, lng: -121.990528},
    {lat: 37.591197, lng: -122.017920} // UCTY
  ]},
  // FRMT to WARM
  { start: 'FRMT', end: 'WARM', waypoints: [
    {lat: 37.557362, lng: -121.976469}, // FRMT
    {lat: 37.554650, lng: -121.969893},
    {lat: 37.553082, lng: -121.962682},
    {lat: 37.548557, lng: -121.957683},
    {lat: 37.542917, lng: -121.955227},
    {lat: 37.536955, lng: -121.954036},
    {lat: 37.530374, lng: -121.953576},
    {lat: 37.524654, lng: -121.951255},
    {lat: 37.501885, lng: -121.939193} // WARM
  ]},
  // FTVL to LAKE
  { start: 'FTVL', end: 'LAKE', waypoints: [
    {lat: 37.775000, lng: -122.224358}, // FTVL
    {lat: 37.779032, lng: -122.231776},
    {lat: 37.781314, lng: -122.234769},
    {lat: 37.783662, lng: -122.238605},
    {lat: 37.785513, lng: -122.242038},
    {lat: 37.789059, lng: -122.249844},
    {lat: 37.790647, lng: -122.254250},
    {lat: 37.792259, lng: -122.257854},
    {lat: 37.794915, lng: -122.261353},
    {lat: 37.797274, lng: -122.265168} // LAKE
  ]},
  // HAYW to SHAY
  { start: 'HAYW', end: 'SHAY', waypoints: [
    {lat: 37.670242, lng: -122.087745}, // HAYW
    {lat: 37.667721, lng: -122.084093},
    {lat: 37.664737, lng: -122.081077},
    {lat: 37.634927, lng: -122.057643} // SHAY
  ]},
  // LAFY to ORIN
  { start: 'LAFY', end: 'ORIN', waypoints: [
    {lat: 37.893316, lng: -122.124153}, // LAFY
    {lat: 37.891828, lng: -122.130100},
    {lat: 37.890629, lng: -122.136131},
    {lat: 37.891425, lng: -122.142273},
    {lat: 37.891196, lng: -122.148492},
    {lat: 37.892902, lng: -122.160774},
    {lat: 37.892651, lng: -122.166981},
    {lat: 37.890948, lng: -122.172809},
    {lat: 37.887590, lng: -122.177316},
    {lat: 37.883202, lng: -122.180174},
    {lat: 37.878470, lng: -122.183690} // ORIN
  ]},
  // LAFY to WCRK
  { start: 'LAFY', end: 'WCRK', waypoints: [
    {lat: 37.893474, lng: -122.123524}, // LAFY
    {lat: 37.897694, lng: -122.097039},
    {lat: 37.898015, lng: -122.085957},
    {lat: 37.897557, lng: -122.080455},
    {lat: 37.897924, lng: -122.075001},
    {lat: 37.900563, lng: -122.070661},
    {lat: 37.904468, lng: -122.068136} // WCRK
  ]},
  // LAKE to WOAK
  { start: 'LAKE', end: 'WOAK', waypoints: [
    {lat: 37.797274, lng: -122.265168}, // LAKE
    {lat: 37.798516, lng: -122.267452},
    {lat: 37.799549, lng: -122.269894},
    {lat: 37.799973, lng: -122.272583},
    {lat: 37.798571, lng: -122.275492},
    {lat: 37.798752, lng: -122.278209},
    {lat: 37.801030, lng: -122.282941},
    {lat: 37.802031, lng: -122.286151},
    {lat: 37.802628, lng: -122.288816},
    {lat: 37.803383, lng: -122.291412},
    {lat: 37.804626, lng: -122.294498} // WOAK
  ]},
  // MCAR to ROCK
  { start: 'MCAR', end: 'ROCK', waypoints: [
    {lat: 37.828423, lng: -122.267185}, // MCAR
    {lat: 37.838184, lng: -122.265250},
    {lat: 37.839637, lng: -122.264290},
    {lat: 37.841038, lng: -122.262186},
    {lat: 37.844227, lng: -122.252611} // ROCK
  ]},
  // MLBR to SFIA
  { start: 'MLBR', end: 'SFIA', waypoints: [
    {lat: 37.600271, lng: -122.386733}, // MLBR
    {lat: 37.612179, lng: -122.398959},
    {lat: 37.614188, lng: -122.399865},
    {lat: 37.615559, lng: -122.397956},
    {lat: 37.615606, lng: -122.395196},
    {lat: 37.615972, lng: -122.392493} // SFIA
  ]},
  // MLPT to WARM
  { start: 'MLPT', end: 'WARM', waypoints: [
    {lat: 37.409818, lng: -121.890852}, // MLPT
    {lat: 37.502023, lng: -121.939264} // WARM
  ]},
  // MONT to POWL
  { start: 'MONT', end: 'POWL', waypoints: [
    {lat: 37.789258, lng: -122.401486}, // MONT
    {lat: 37.784990, lng: -122.406874} // POWL
  ]},
  // NBRK to PLZA
  { start: 'NBRK', end: 'PLZA', waypoints: [
    {lat: 37.874138, lng: -122.283870}, // NBRK
    {lat: 37.875536, lng: -122.286842},
    {lat: 37.877937, lng: -122.288440},
    {lat: 37.883629, lng: -122.290998},
    {lat: 37.886252, lng: -122.292018},
    {lat: 37.897959, lng: -122.295792},
    {lat: 37.900456, lng: -122.297214},
    {lat: 37.903248, lng: -122.299424} // PLZA
  ]},
  // NCON to PITT
  { start: 'NCON', end: 'PITT', waypoints: [
    {lat: 38.002474, lng: -122.025291}, // NCON
    {lat: 38.008010, lng: -122.020775},
    {lat: 38.011100, lng: -122.013845},
    {lat: 38.013710, lng: -121.997523},
    {lat: 38.020842, lng: -121.982772},
    {lat: 38.023598, lng: -121.975242},
    {lat: 38.023178, lng: -121.967016},
    {lat: 38.021645, lng: -121.958913},
    {lat: 38.019687, lng: -121.950971},
    {lat: 38.018919, lng: -121.942084} // PITT
  ]},
  // ORIN to ROCK
  { start: 'ORIN', end: 'ROCK', waypoints: [
    {lat: 37.878470, lng: -122.183690}, // ORIN
    {lat: 37.874376, lng: -122.188209},
    {lat: 37.844239, lng: -122.252581} // ROCK
  ]},
  // PCTR to PITT
  { start: 'PCTR', end: 'PITT', waypoints: [
    {lat: 38.016943, lng: -121.889453}, // PCTR
    {lat: 38.019343, lng: -121.898685},
    {lat: 38.019954, lng: -121.903474},
    {lat: 38.020102, lng: -121.918052},
    {lat: 38.019804, lng: -121.922888},
    {lat: 38.019075, lng: -121.927658},
    {lat: 38.018919, lng: -121.942231} // PITT
  ]},
  // PHIL to WCRK
  { start: 'PHIL', end: 'WCRK', waypoints: [
    {lat: 37.927737, lng: -122.056872}, // PHIL
    {lat: 37.926140, lng: -122.058774},
    {lat: 37.924236, lng: -122.060133},
    {lat: 37.920020, lng: -122.061694},
    {lat: 37.917975, lng: -122.062706},
    {lat: 37.915322, lng: -122.063560},
    {lat: 37.913135, lng: -122.063825},
    {lat: 37.910989, lng: -122.064391},
    {lat: 37.908962, lng: -122.065456},
    {lat: 37.904492, lng: -122.068122} // WCRK
  ]},
  // SBRN to MLBR
  { start: 'SBRN', end: 'MLBR', waypoints: [
    {lat: 37.636856, lng: -122.415824}, // SBRN
    {lat: 37.626465, lng: -122.409537},
    {lat: 37.622616, lng: -122.406884},
    {lat: 37.612739, lng: -122.399400},
    {lat: 37.600271, lng: -122.386733} // MLBR
  ]},
  // SBRN to SFIA
  { start: 'SBRN', end: 'SFIA', waypoints: [
    {lat: 37.636987, lng: -122.415897}, // SBRN
    {lat: 37.624622, lng: -122.408399},
    {lat: 37.617100, lng: -122.402696},
    {lat: 37.615698, lng: -122.399822},
    {lat: 37.615617, lng: -122.396373},
    {lat: 37.615998, lng: -122.392414} // SFIA
  ]},
  // SBRN to SSAN
  { start: 'SBRN', end: 'SSAN', waypoints: [
    {lat: 37.637075, lng: -122.415947}, // SBRN
    {lat: 37.642546, lng: -122.419172},
    {lat: 37.645367, lng: -122.421297},
    {lat: 37.650712, lng: -122.426145},
    {lat: 37.652891, lng: -122.429238},
    {lat: 37.654764, lng: -122.432648},
    {lat: 37.656859, lng: -122.435836},
    {lat: 37.662147, lng: -122.440756},
    {lat: 37.664276, lng: -122.443918} // SSAN
  ]},
  // SFIA to SFIA
  { start: 'SFIA', end: 'SFIA', waypoints: [
    {lat: 37.615972, lng: -122.392493} // SFIA
  ]},
  // SHAY to UCTY
  { start: 'SHAY', end: 'UCTY', waypoints: [
    {lat: 37.634927, lng: -122.057643}, // SHAY
    {lat: 37.630732, lng: -122.054356},
    {lat: 37.626243, lng: -122.051780},
    {lat: 37.621651, lng: -122.049484},
    {lat: 37.617723, lng: -122.045756},
    {lat: 37.610393, lng: -122.037415},
    {lat: 37.591197, lng: -122.017920} // UCTY
  ]},
];

/**
 * Get route path between two stations
 */
function getRoutePath(fromStation, toStation) {
  for (var i = 0; i < routePath.length; i++) {
    var segment = routePath[i];
    if (segment.start === fromStation && segment.end === toStation) {
      return segment.waypoints;
    }
  }
  for (var i = 0; i < routePath.length; i++) {
    var segment = routePath[i];
    if (segment.start === toStation && segment.end === fromStation) {
      return segment.waypoints.slice().reverse();
    }
  }
  return null;
}

/**
 * Calculate position along a route with waypoints
 * Returns an object with lat, lng, and bearing (direction of travel)
 */
function getPositionAlongRoute(waypoints, percent) {
  if (!waypoints || waypoints.length < 2) {
    if (waypoints && waypoints.length === 1) {
      return {lat: waypoints[0].lat, lng: waypoints[0].lng, bearing: 0};
    }
    return null;
  }
  var totalDistance = 0;
  var distances = [0];
  for (var i = 1; i < waypoints.length; i++) {
    var dist = getDistance(waypoints[i-1], waypoints[i]);
    totalDistance += dist;
    distances.push(totalDistance);
  }
  var targetDistance = totalDistance * (1 - percent);
  for (var i = 1; i < distances.length; i++) {
    if (targetDistance <= distances[i]) {
      var segmentStart = distances[i-1];
      var segmentEnd = distances[i];
      var segmentPercent = (targetDistance - segmentStart) / (segmentEnd - segmentStart);
      var lat = waypoints[i-1].lat + (waypoints[i].lat - waypoints[i-1].lat) * segmentPercent;
      var lng = waypoints[i-1].lng + (waypoints[i].lng - waypoints[i-1].lng) * segmentPercent;
      var bearing = getBearing(waypoints[i-1], waypoints[i]);
      return {lat: lat, lng: lng, bearing: bearing};
    }
  }
  var lastBearing = waypoints.length > 1 ? getBearing(waypoints[waypoints.length - 2], waypoints[waypoints.length - 1]) : 0;
  return {lat: waypoints[waypoints.length - 1].lat, lng: waypoints[waypoints.length - 1].lng, bearing: lastBearing};
}

/**
 * Simple distance calculation
 */
function getDistance(p1, p2) {
  var latDiff = p2.lat - p1.lat;
  var lngDiff = p2.lng - p1.lng;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

/**
 * Calculate bearing (direction) from p1 to p2 in degrees
 */
function getBearing(p1, p2) {
  var dLng = p2.lng - p1.lng;
  var dLat = p2.lat - p1.lat;
  return Math.atan2(dLng, dLat) * 180 / Math.PI;
}

/**
 * Calculate perpendicular distance from point to line segment
 */
function perpendicularDistance(point, lineStart, lineEnd) {
  var dx = lineEnd.lng - lineStart.lng;
  var dy = lineEnd.lat - lineStart.lat;

  // Normalize
  var mag = Math.sqrt(dx * dx + dy * dy);
  if (mag > 0) {
    dx /= mag;
    dy /= mag;
  }

  var pvx = point.lng - lineStart.lng;
  var pvy = point.lat - lineStart.lat;

  // Get dot product (project pv onto normalized direction)
  var pvdot = dx * pvx + dy * pvy;

  // Scale line direction vector
  var dsx = pvdot * dx;
  var dsy = pvdot * dy;

  // Subtract this from pv
  var ax = pvx - dsx;
  var ay = pvy - dsy;

  return Math.sqrt(ax * ax + ay * ay);
}

/**
 * Simplify waypoints by removing points with less than threshold deviation
 * @param {Array} waypoints - Array of {lat, lng} points
 * @param {Number} threshold - Deviation threshold as percentage (e.g., 0.05 for 5%)
 * @returns {Array} Simplified waypoints array
 */
function simplifyWaypoints(waypoints, threshold) {
  if (!waypoints || waypoints.length <= 2) {
    return waypoints;
  }

  var result = [waypoints[0]]; // Always keep first point

  for (var i = 1; i < waypoints.length - 1; i++) {
    var prev = result[result.length - 1];
    var curr = waypoints[i];
    var next = waypoints[i + 1];

    // Calculate the distance from current point to the line between prev and next
    var deviation = perpendicularDistance(curr, prev, next);

    // Calculate the distance between prev and next for percentage comparison
    var baseDistance = getDistance(prev, next);

    // If deviation is more than threshold percentage, keep the point
    if (baseDistance > 0 && (deviation / baseDistance) >= threshold) {
      result.push(curr);
    }
  }

  result.push(waypoints[waypoints.length - 1]); // Always keep last point
  return result;
}

/**
 * Apply simplification to all route segments
 * @param {Number} threshold - Deviation threshold (default 0.05 for 5%)
 */
function simplifyAllRoutes(threshold) {
  threshold = threshold || 0.05;
  var originalCount = 0;
  var simplifiedCount = 0;

  for (var i = 0; i < routePath.length; i++) {
    var segment = routePath[i];
    originalCount += segment.waypoints.length;
    segment.waypoints = simplifyWaypoints(segment.waypoints, threshold);
    simplifiedCount += segment.waypoints.length;
  }

  console.log('Route simplification complete:');
  console.log('Original waypoints: ' + originalCount);
  console.log('Simplified waypoints: ' + simplifiedCount);
  console.log('Reduction: ' + ((originalCount - simplifiedCount) / originalCount * 100).toFixed(1) + '%');
}
