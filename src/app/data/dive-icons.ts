import type { DiveIconName, DiveIconPath } from '../models/dive-icon.model';
import type { CourseCategory, MarineServiceIcon } from '../models/site-data.model';

export const DIVE_ICON_STYLE = {
  viewBox: '0 0 80 80', strokeWidth: 1.8, linecap: 'round', linejoin: 'round'
} as const;

const paths = (...commands: readonly string[]): readonly DiveIconPath[] => commands.map(d => ({ d }));
const rotated = (commands: readonly string[], angle: number, x = 40, y = 40): readonly DiveIconPath[] =>
  commands.map(d => ({ d, transform: `rotate(${angle} ${x} ${y})` }));

// Constructed upright about x=40, then rotated as one coordinate system.
// Hull and cockpit contours stop at the paddle shaft, avoiding overlapping
// outlines without painting an opaque patch over the card photography.
export const KAYAK_GEOMETRY = {
  axis: 40,
  hull: [
    'M21.1 38C21.5 19 29 6 40 6C51 6 58.5 19 58.9 38',
    'M58.9 42C58.5 61 51 74 40 74C29 74 21.5 61 21.1 42'
  ],
  deck: [
    'M26.5 15C29 25 51 25 53.5 15M40 22.5V25',
    'M26.5 65C29 55 51 55 53.5 65M40 57.5V55'
  ],
  cockpit: [
    'M29.1 38C29.7 30 33.7 25 40 25C46.3 25 50.3 30 50.9 38',
    'M50.9 42C50.3 50 46.3 55 40 55C33.7 55 29.7 50 29.1 42'
  ],
  paddle: [
    'M21 38H59M21 42H59',
    'M21 38L18 36C13 32 4 33 4 40C4 47 13 48 18 44L21 42Z',
    'M59 38L62 36C67 32 76 33 76 40C76 47 67 48 62 44L59 42Z'
  ]
} as const;

// The necks continue from the underside of the manifold into the shoulders.
export const CYLINDER_GEOMETRY = {
  axis: 40,
  manifold: ['M12 19H68V25H12Z', 'M6 17H12V27H6ZM68 17H74V27H68Z'],
  valves: ['M22 15H28V19H22ZM52 15H58V19H52Z', 'M37 11H43V19H37ZM35 6H45V11H35Z'],
  left: ['M22 25V33C19 34 17 38 17 42V68A4 4 0 0 0 21 72H29A4 4 0 0 0 33 68V42C33 38 31 34 28 33V25'],
  right: ['M52 25V33C49 34 47 38 47 42V68A4 4 0 0 0 51 72H59A4 4 0 0 0 63 68V42C63 38 61 34 58 33V25'],
  bands: ['M17 45H33M17 63H33M47 45H63M47 63H63']
} as const;

const MASK_FRAME = 'M35 22H57C67 22 74 30 74 40C74 50 68 57 60 57C53 57 51 48 46 48C41 48 39 57 32 57C24 57 18 50 18 40C18 30 25 22 35 22Z';
const MASK_LENS = 'M35 27H57C64 27 69 32 69 40C69 47 65 52 60 52C55 52 52 43 46 43C40 43 37 52 32 52C27 52 23 47 23 40C23 32 28 27 35 27Z';
const SNORKEL_CAP = 'M4 6H13V12H4Z';
const CLOCK_TICK_ANGLES = [0, 30, 60, 90, 180, 210, 240, 270, 300, 330] as const;

export const DIVE_ICONS = {
  kayak: rotated([...KAYAK_GEOMETRY.hull, ...KAYAK_GEOMETRY.deck, ...KAYAK_GEOMETRY.cockpit, ...KAYAK_GEOMETRY.paddle], 45),
  schedule: [
    ...paths(
      'M64 43.55A29 29 0 1 0 43.55 64',
      'M59.18 42.21A24 24 0 1 0 42.21 59.18',
      'M36 20V33M39 36H49M39 36A3 3 0 1 1 33 36A3 3 0 0 1 39 36',
      'M73 60A13 13 0 1 1 47 60A13 13 0 0 1 73 60M60 54V66M54 60H66'
    ),
    ...CLOCK_TICK_ANGLES.flatMap(angle => rotated(['M36 12V15.5'], angle, 36, 36))
  ],
  mask: paths(
    MASK_FRAME, MASK_LENS, SNORKEL_CAP,
    'M6 12V53C6 65 12 71 24 71H35M11 12V53C11 62 15 66 24 66H35',
    'M35 64H45A3 3 0 0 1 48 67V70A3 3 0 0 1 45 73H35Z'
  ),
  tanks: paths(...CYLINDER_GEOMETRY.manifold, ...CYLINDER_GEOMETRY.valves, ...CYLINDER_GEOMETRY.left, ...CYLINDER_GEOMETRY.right, ...CYLINDER_GEOMETRY.bands),
  coral: paths(
    // Two organic staghorn arms share a continuous trunk. Rounded branch tips
    // and the two reef mounds follow the construction in the visual reference.
    'M39.2 59.5C39.2 54.1 36.1 49.5 31.5 46C27.3 49.6 23.1 53.3 20.4 53.4C16.4 54.1 14.5 49.5 17.3 47.3L25 42.1C21.4 39.4 17.8 36.3 15.7 33.7C13.2 30.9 16 27.2 18.8 28.7C23.3 32.8 27.3 36.6 32.3 39.7L38.3 43L41.7 39.1C33.4 35.2 29.4 29.2 27.5 22.8C23.8 22.4 20.3 20.6 19.4 18.1C17.7 14.5 21.1 11.6 23.8 13L27.3 15L28.3 8.3C29.1 4.2 33.7 5 34.5 8.3C34.4 12.7 33.3 19.8 35.5 23.8C37.9 22.4 38.8 20.6 38.6 18.2C38.5 15.1 42.5 13.6 44.2 16.4C47 21.2 43.4 26.6 40.5 29.9C42.5 31.6 44.5 32.6 47 33.6C51.8 27.2 54 19 53.9 11C53.9 7.3 57.9 5.9 60.1 9.2C61.9 11.6 60.2 16.4 60.2 21L63.6 18.4C66.5 16 69.8 18.5 69.6 20.8C68.2 25 64 27.3 58.6 26.7C57 30 55.2 33.1 53.3 35.7L61.2 35.6C65.1 35.3 66.7 39.3 63.9 41.6C60 44.4 54.7 43.3 49.1 42L42.3 48C44.5 51.5 45.4 54.8 46 58.5',
    'M30.6 73C33.7 65 38.6 59 46 58.5C50.2 57.7 52.4 61.4 55.7 63.5C60.8 64.9 66.3 62.9 69.6 66.5C71.9 68.4 73.2 70.6 74 73H6C7.5 68 11.3 65 16.5 63.5C21.2 63.3 22.9 60.2 26.5 58.1C30.6 55.8 35.2 56.7 39.2 59.5'
  ),
  instructor: paths(
    'M31 23V21C31 12 37 6 45 6C54 6 61 13 61 20',
    'M29 23H50L52 28H29ZM50 20H62C64 20 65 22 65 24L64 32C64 35 61 37 58 37H55L51 29Z',
    'M34 28L36 39C38 44 41 47 46 48V53M56 37H60V41C60 45 57 47 53 48V53',
    'M60 39H65A3 3 0 0 1 68 42A3 3 0 0 1 65 45H60M68 42C73 42 75 48 71 51C69 53 66 54 63 54',
    'M27 72V62C27 56 35 52 45 52H54C64 52 71 58 71 67V72ZM35 55V72M61 55V72M27 63C40 58 58 58 71 64',
    'M12 46V40H18V46C22 47 24 50 24 54V72H6V54C6 50 8 47 12 46ZM10 35H20V40H10ZM6 59H24M11 64V72M19 64V72'
  ),
  lagoon: paths(
    MASK_FRAME, MASK_LENS, SNORKEL_CAP,
    'M6 12V49C6 54 8 58 12 61M11 12V49C11 52 12 54 14 55',
    'M8 66C13.3 62 18.7 62 24 66S34.7 70 40 66S50.7 62 56 66S66.7 70 72 66',
    'M8 74C13.3 70 18.7 70 24 74S34.7 78 40 74S50.7 70 56 74S66.7 78 72 74'
  ),
  'deep-diver': paths(
    'M19 23V31C14 33 11 38 11 44V67A5 5 0 0 0 16 72H30A5 5 0 0 0 35 67V44C35 38 32 33 27 31V23',
    'M17 17H29V23H17ZM20 11H26V17H20ZM11 47H35M11 63H35',
    'M57 11V69M49 61L57 69L65 61M52 25H62M52 37H62M52 49H62'
  ),
  certification: paths(
    'M43 62H14A4 4 0 0 1 10 58V14A4 4 0 0 1 14 10H66A4 4 0 0 1 70 14V40',
    'M20 22H60M20 30H54M20 38H48M20 46H34',
    'M69 57A11 11 0 1 1 47 57A11 11 0 0 1 69 57M53 57L56 60L63 53',
    'M52 66L49 74L58 70L67 74L64 66'
  ),
  boat: paths(
    // Front elevation: hull, cabin and windows mirror exactly about x=40.
    'M10 41L40 34L70 41L63 57C57 63 49 67 40 69C31 67 23 63 17 57ZM40 34V69',
    'M20 38.67V23H60V38.67M28 23V14H52V23M40 6V14',
    'M26 27H35V33H26ZM45 27H54V33H45ZM35 18H45',
    'M8 74C13.3 70 18.7 70 24 74S34.7 78 40 74S50.7 70 56 74S66.7 78 72 74'
  ),
  fishing: paths(
    'M10 65L43 17C48 10 58 8 64 13M14 68L47 20',
    'M8 63L12 59L19 64L15 70ZM20 51L25 55',
    'M64 13V39C64 47 54 47 54 39V36L57 39',
    'M33 61C39 51 55 51 66 61C55 71 39 71 33 61ZM33 61L24 54V68ZM52 54C49 58 49 64 52 68',
    'M59 59A1 1 0 1 1 57 59A1 1 0 0 1 59 59'
  ),
  compass: paths(
    'M69 43A29 29 0 1 1 11 43A29 29 0 0 1 69 43M63 43A23 23 0 1 1 17 43A23 23 0 0 1 63 43',
    'M35 14V10A5 5 0 0 1 45 10V14M40 20V24M40 62V66M17 43H21M59 43H63',
    'M52 25L45 48L28 61L35 38ZM35 38L45 48'
  ),
  rescue: [
    ...paths(
      'M71 40A31 31 0 1 1 9 40A31 31 0 0 1 71 40M60 40A20 20 0 1 1 20 40A20 20 0 0 1 60 40',
      'M36 30H44V36H50V44H44V50H36V44H30V36H36Z'
    ),
    ...[45, 135, 225, 315].flatMap(angle => rotated(['M34 9.59V20.92M46 9.59V20.92'], angle))
  ]
} as const satisfies Readonly<Record<DiveIconName, readonly DiveIconPath[]>>;

export const SERVICE_ICONS = {
  lagoon: 'lagoon', 'deep-sea': 'deep-diver', course: 'certification', sports: 'kayak'
} as const satisfies Readonly<Record<MarineServiceIcon, DiveIconName>>;

export const COURSE_ICONS = {
  'Beginner certifications': 'certification',
  'Continuing education': 'compass',
  'Professional development': 'instructor',
  'Youth & introductory': 'mask'
} as const satisfies Readonly<Record<CourseCategory, DiveIconName>>;

export const SERVICE_HIGHLIGHT_ICONS: Readonly<Record<string, readonly DiveIconName[]>> = {
  'lagoon-diving': ['tanks', 'instructor', 'coral'],
  'deep-sea-diving': ['coral', 'boat', 'tanks'],
  'padi-courses': ['certification', 'compass', 'schedule'],
  'water-sports': ['boat', 'kayak', 'mask', 'fishing']
};
