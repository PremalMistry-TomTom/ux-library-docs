export const FONT_SIZES = [
  ['8','8'],['12','12'],['16','16'],['20','20'],['24','24'],
  ['28','28'],['32','32'],['40','40'],['56','56'],['80','80'],
];

export const FONT_CMP_ROWS = [
  ['NIP — distance',            'tt_cmp_font_nip_distance',     'tt_sys_font_display_l'],
  ['NIP — address / road name', 'tt_cmp_font_nip_body',         'tt_sys_font_body_l'],
  ['Then instruction',          'tt_cmp_font_then_instruction', 'tt_sys_font_title_s'],
  ['Filters subtitle',          'tt_cmp_font_filter_subtitle',  'tt_sys_font_subtitle_r'],
  ['Charging speed label',      'tt_cmp_font_charging_label',   'tt_sys_font_label_s'],
];

export const TYPE_SCALE = [
  { token: 'tt_sys_font_display_xxl', size: '80dp', weight: 'Bold', sampleStyle: { fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }, sample: '72' },
  { token: 'tt_sys_font_display_xl',  size: '56dp', weight: 'Bold', sampleStyle: { fontSize: '1.9rem', fontWeight: 700, lineHeight: 1 }, sample: '72 km/h' },
  { token: 'tt_sys_font_display_l',   size: '40dp', weight: 'Bold', sampleStyle: { fontSize: '1.5rem', fontWeight: 700 }, sample: '1.5 mi' },
  { token: 'tt_sys_font_title_m',     size: '24dp', weight: 'Bold', sampleStyle: { fontSize: '1.2rem', fontWeight: 700 }, sample: 'Then turn right' },
  { token: 'tt_sys_font_title_s',     size: '18dp', weight: 'Bold', sampleStyle: { fontSize: '1rem',   fontWeight: 700 }, sample: 'Oak Street North' },
  { token: 'tt_sys_font_subtitle_r',  size: '16dp', weight: 'Regular', sampleStyle: { fontSize: '0.9rem', fontWeight: 400 }, sample: 'Filters · Speed camera' },
  { token: 'tt_sys_font_body_l',      size: '16dp', weight: 'Regular', sampleStyle: { fontSize: '0.9rem', fontWeight: 400 }, sample: 'John C. Lodge Fwy / Farmington Hills' },
  { token: 'tt_sys_font_label_s',     size: '12dp', weight: 'Regular', sampleStyle: { fontSize: '0.72rem', fontWeight: 400 }, sample: 'Charging speed label' },
];
