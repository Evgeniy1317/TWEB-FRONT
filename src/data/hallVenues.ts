import type { HallVenue } from '../types';
import { publicUrl } from '../lib/publicUrl';

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** Как у блока «Предстоящие турниры» — клуб Altius */
const ALTIUS_MAPS = mapsSearch('Badminton club Altius Chisinau');

const LOGO_VICTOR = publicUrl('media/images/Logo-300x300.png');
const LOGO_ALTIUS = publicUrl('media/images/449785420_10212023391816179_7793559525705666038_n.jpg');
const LOGO_DTM = publicUrl('media/images/6cf87f30-c1b2-4543-99a7-137e10d1a76f.jpg');
const LOGO_USMF = publicUrl('media/images/i%20(1).webp');
const LOGO_VALEA = publicUrl('media/images/i%20(2).webp');

const COVER_DTM = publicUrl('media/images/5377695244310221422.jpg');
const COVER_VICTOR = publicUrl('media/images/483367037_1218244436879199_1759370186017822007_n.jpg');
const COVER_ALTIUS = publicUrl('media/images/486142766_1049927993827861_4689185326898161056_n.jpg');
const COVER_CSU_USMF = publicUrl('media/images/2ef05ccf2e1b7901431c5efe7ecc5497.jpg');
const COVER_VALEA = publicUrl('media/images/dolina_roz_avgust.jpg');
const COVER_USMF_TESTEMITANU = publicUrl('media/images/DSC_2575.jpg.jpeg');

export const HALL_VENUES: HallVenue[] = [
  {
    id: 'dtm-trainings',
    name: 'DTM Trainings',
    mapsUrl: mapsSearch('Strada Dacia 41/1 Chișinău Moldova'),
    logoSrc: LOGO_DTM,
    coverSrc: COVER_DTM,
  },
  {
    id: 'altius',
    name: 'Altius',
    mapsUrl: ALTIUS_MAPS,
    logoSrc: LOGO_ALTIUS,
    coverSrc: COVER_ALTIUS,
  },
  {
    id: 'usmf-testemitanu',
    name: 'USMF',
    mapsUrl: mapsSearch('Strada Testemitanu 24/5 Chișinău Moldova'),
    logoSrc: LOGO_USMF,
    coverSrc: COVER_USMF_TESTEMITANU,
  },
  {
    id: 'valea-trandafirilor',
    name: 'Valea Trandafirilor',
    mapsUrl: mapsSearch('Strada Valea Trandafirilor Chișinău Moldova'),
    logoSrc: LOGO_VALEA,
    coverSrc: COVER_VALEA,
  },
  {
    id: 'csu-usmf',
    name: 'Complexul Sportiv Universitar al USMF',
    mapsUrl: mapsSearch('Strada 31 August 137A Chișinău Moldova Complexul Sportiv Universitar USMF'),
    logoSrc: LOGO_USMF,
    coverSrc: COVER_CSU_USMF,
  },
  {
    id: 'victor-badminton',
    name: 'Victor badminton Club',
    mapsUrl: mapsSearch('Victor badminton club Valea Morilor Chișinău Moldova'),
    logoSrc: LOGO_VICTOR,
    coverSrc: COVER_VICTOR,
  },
];
