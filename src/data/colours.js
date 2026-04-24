export const SCALES = {
  blue:   [['100','#F0F7FF'],['200','#D0E8F7'],['250','#B0D6F2'],['300','#78BEEC'],['350','#48A8E4'],['400','#1E8AD4'],['500','#155E9C'],['550','#104E82'],['600','#0C3E68'],['700','#072948']],
  grey:   [['100','#F5F5F5'],['150','#EBEBEB'],['200','#DEDEDE'],['300','#BABABA'],['400','#989898'],['500','#3C4A58'],['600','#2E3840'],['700','#222C34'],['800','#171E24'],['900','#0C1318']],
  bw:     [['white','#FFFFFF'],['black','#000000']],
  green:  [['100','#96ECC4'],['200','#36C882'],['300','#009E64'],['400','#007448'],['500','#004E30'],['600','#00321E']],
  red:    [['100','#FFBDBA'],['200','#F04040'],['300','#C82020'],['400','#8A0A0A'],['500','#5A0808'],['600','#3A0404']],
  orange: [['100','#FFCCA0'],['200','#F07020'],['300','#C84800'],['400','#963000'],['500','#6E2200'],['600','#481500']],
  yellow: [['100','#FFF8D0'],['200','#FFCA40'],['300','#CC9400'],['400','#8A6200'],['500','#584000'],['600','#3A2A00']],
  usa:    [['100','#70C898'],['200','#1A7048'],['300','#0A4828']],
  eu:     [['100','#8AACC8'],['200','#1A3E6A'],['300','#0A2444']],
};

export const EXTENDED = [
  ['azure_100','#3D98E8'],['azure_200','#1C5EAA'],
  ['cobalt_100','#243C88'],['cobalt_200','#0E1E58'],
  ['lavender_100','#B090D8'],['lavender_200','#7840B8'],
  ['coral_100','#DC6858'],['coral_200','#AA3030'],
  ['tangerine_100','#E07838'],['tangerine_200','#A84800'],
  ['granite_100','#B8A89A'],['granite_200','#827060'],
  ['periwinkle_100','#9898C0'],['periwinkle_200','#6868A0'],
  ['orchid_100','#C038A8'],['orchid_200','#880870'],
  ['wayfarer_100','#E840A8'],['wayfarer_200','#A81068'],
  ['driftwood_100','#C8AC88'],['driftwood_200','#9A7A50'],
  ['teal_100','#38C8C0'],['teal_200','#007878'],
  ['evergreen_100','#40A858'],['evergreen_200','#1A5C28'],
];

export const SYSTEM = {
  surfaces: [
    ['surface.primary','#072948','Main navigation canvas (→ blue_700)'],
    ['surface.secondary','#155E9C','Secondary container, panels on map (→ blue_500)'],
    ['surface.secondary_jet','#171E24','Dark overlay for night-mode panels (→ grey_800)'],
    ['soft.panelSurface','#F5F5F5','Light panel surface, instruction strip (→ grey_100)'],
  ],
  brand: [
    ['brand.primary','#C82020','TomTom red — CTAs, logo, active states (→ red_300)'],
    ['brand.primary.pressed','#8A0A0A','Pressed/held state (→ red_400)'],
    ['brand.primary.disabled','#FFBDBA','Disabled — do not derive via opacity (→ red_100)'],
    ['brand.onPrimary','#FFFFFF','Foreground on brand.primary backgrounds'],
  ],
  guidance: [
    ['guidance.routeLine','#1E8AD4','Default route polyline on the map (→ blue_400)'],
    ['guidance.routeAlt','#B0D6F2','Alternative route, recessed (→ blue_250)'],
    ['guidance.autoRoute','#009E64','Auto-selected best route (→ green_300)'],
    ['guidance.maneuverBg','#104E82','Turn instruction arrow background (→ blue_550)'],
    ['guidance.safeSpeed','#009E64','Speed within legal limit (→ green_300)'],
    ['guidance.overSpeed','#C82020','Speed exceeding limit (→ red_300)'],
  ],
  alerts: [
    ['alert','#C82020','Critical — collision risk, severe hazard (→ red_300)'],
    ['warning','#F07020','Warning — action advised (→ orange_200)'],
    ['cautioning','#FFCA40','Caution — informational hazard (→ yellow_200)'],
    ['positive','#009E64','Clear — confirmation state (→ green_300)'],
    ['foundation','#C82020','Brand-aligned fallback alert (→ red_300)'],
  ],
  actions: [
    ['action.primary','#C82020','Primary action button (→ red_300)'],
    ['action.secondary','#1E8AD4','Secondary action button (→ blue_400)'],
    ['action.cancel','#C82020','Destructive / cancel (→ red_300)'],
    ['action.navigate','#009E64','"Start navigation" positive CTA (→ green_300)'],
    ['action.button','#1E8AD4','Default interactive button (→ blue_400)'],
  ],
  ui: [
    ['interface.default','#DEDEDE','Unchecked toggle, track (→ grey_200)'],
    ['interface.active','#C82020','Active/on state (→ red_300)'],
    ['interface.focus','#1E8AD4','Keyboard focus ring (→ blue_400)'],
    ['interface.disabled','#EBEBEB','Disabled control fill (→ grey_150)'],
  ],
  signage: [
    ['signage.uk','#0A2444','UK motorway sign background (→ euBlue_300)'],
    ['signage.eu','#1A3E6A','EU motorway sign background (→ euBlue_200)'],
    ['signage.us.interstate','#0A4828','US Interstate shield (→ usaGreen_300)'],
    ['signage.us.highway','#FFFFFF','US state highway background'],
    ['signage.warning','#FFCA40','Hazard / warning sign (→ yellow_200)'],
  ],
  poi: [
    ['poi.food.fill','#E07838','Food & beverage marker (→ tangerine_100)'],
    ['poi.parking.fill','#1E8AD4','Parking marker (→ blue_400)'],
    ['poi.petrol.fill','#C82020','Fuel station marker (→ red_300)'],
    ['poi.ev.fill','#009E64','EV charging marker (→ green_300)'],
    ['poi.hotel.fill','#7840B8','Accommodation marker (→ lavender_200)'],
    ['poi.hospital.fill','#C82020','Medical / emergency marker (→ red_300)'],
  ],
};
