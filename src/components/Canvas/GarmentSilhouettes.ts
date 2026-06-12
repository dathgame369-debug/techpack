import type { GarmentType } from '../../types/techpack';

export const GARMENT_LABELS: Record<GarmentType, string> = {
  tshirt: 'T-Shirt',
  dress: 'Dress',
  jacket: 'Jacket',
  jeans: 'Jeans',
  skirt: 'Skirt',
  shirt: 'Dress Shirt',
  hoodie: 'Hoodie',
  coat: 'Coat',
  custom: 'Custom Upload',
};

// Returns an SVG string path data for each garment (viewBox 0 0 300 400)
export const GARMENT_SVG_PATHS: Record<Exclude<GarmentType, 'custom'>, string> = {
  tshirt: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Body -->
      <path d="M90 60 Q100 40 110 36 Q130 28 150 28 Q170 28 190 36 Q200 40 210 60
               L240 80 L240 110 L215 105 L215 320 Q215 330 205 330 L95 330 Q85 330 85 320
               L85 105 L60 110 L60 80 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Collar -->
      <path d="M110 36 Q130 50 150 50 Q170 50 190 36" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Left sleeve seam -->
      <line x1="85" y1="105" x2="60" y2="110" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Right sleeve seam -->
      <line x1="215" y1="105" x2="240" y2="110" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Side seams -->
      <line x1="85" y1="105" x2="85" y2="320" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="215" y1="105" x2="215" y2="320" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Hem -->
      <line x1="85" y1="310" x2="215" y2="310" stroke="#666666" stroke-width="1"/>
    </svg>`,

  dress: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Bodice -->
      <path d="M110 50 Q130 40 150 38 Q170 40 190 50
               L205 65 L205 80 L215 85 L215 110 L205 108
               L215 200 L240 360 L60 360 L85 200 L95 108
               L85 110 L85 85 L95 80 L95 65 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Neckline -->
      <path d="M110 50 Q130 62 150 62 Q170 62 190 50" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Waist seam -->
      <line x1="90" y1="168" x2="210" y2="168" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Side seams skirt -->
      <line x1="90" y1="168" x2="60" y2="360" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="210" y1="168" x2="240" y2="360" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Hem -->
      <line x1="60" y1="350" x2="240" y2="350" stroke="#666666" stroke-width="1"/>
    </svg>`,

  jacket: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Body -->
      <path d="M95 70 L75 55 L50 70 L45 110 L65 108 L65 340 L235 340 L235 108 L255 110 L250 70 L225 55 L205 70
               Q200 80 185 88 Q170 95 150 95 Q130 95 115 88 Q100 80 95 70Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Lapels -->
      <path d="M150 95 L140 180 L130 340" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <path d="M150 95 L160 180 L170 340" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <!-- Collar -->
      <path d="M95 70 Q100 58 115 52 Q130 45 150 43 Q170 45 185 52 Q200 58 205 70
               L185 88 Q170 72 150 70 Q130 72 115 88 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Pockets -->
      <rect x="75" y="230" width="40" height="28" rx="3" fill="#ffffff" stroke="#666666" stroke-width="1"/>
      <rect x="185" y="230" width="40" height="28" rx="3" fill="#ffffff" stroke="#666666" stroke-width="1"/>
      <!-- Buttons -->
      <circle cx="150" cy="185" r="4" fill="#000000" opacity="0.8"/>
      <circle cx="150" cy="215" r="4" fill="#000000" opacity="0.8"/>
      <circle cx="150" cy="245" r="4" fill="#000000" opacity="0.8"/>
      <!-- Side seams -->
      <line x1="65" y1="108" x2="65" y2="340" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="235" y1="108" x2="235" y2="340" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
    </svg>`,

  jeans: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Waistband -->
      <rect x="75" y="30" width="150" height="28" rx="4" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Belt loops -->
      <rect x="90" y="26" width="8" height="16" rx="2" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <rect x="140" y="26" width="8" height="16" rx="2" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <rect x="200" y="26" width="8" height="16" rx="2" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <!-- Pants body -->
      <path d="M75 58 L75 195 Q75 210 90 215 L130 220 L150 370 L170 220 L210 215 Q225 210 225 195 L225 58 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Crotch seam -->
      <path d="M130 220 Q145 235 150 240 Q155 235 170 220" fill="none" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Side seams -->
      <line x1="75" y1="58" x2="75" y2="195" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="225" y1="58" x2="225" y2="195" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Front pocket -->
      <path d="M80 70 Q95 68 105 85" fill="none" stroke="#666666" stroke-width="1" stroke-dasharray="3 2"/>
      <!-- Fly -->
      <line x1="148" y1="58" x2="150" y2="130" stroke="#666666" stroke-width="1" stroke-dasharray="3 2"/>
      <!-- Hem lines -->
      <line x1="90" y1="360" x2="145" y2="360" stroke="#666666" stroke-width="1"/>
      <line x1="155" y1="360" x2="210" y2="360" stroke="#666666" stroke-width="1"/>
    </svg>`,

  skirt: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Waistband -->
      <rect x="90" y="30" width="120" height="24" rx="4" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Skirt body - A-line -->
      <path d="M90 54 L55 350 Q55 360 65 360 L235 360 Q245 360 245 350 L210 54 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Pleat / seam lines -->
      <line x1="150" y1="54" x2="150" y2="360" stroke="#666666" stroke-width="1" stroke-dasharray="5 4"/>
      <line x1="110" y1="54" x2="90" y2="360" stroke="#666666" stroke-width="0.75" stroke-dasharray="4 3" opacity="0.6"/>
      <line x1="190" y1="54" x2="210" y2="360" stroke="#666666" stroke-width="0.75" stroke-dasharray="4 3" opacity="0.6"/>
      <!-- Hem -->
      <line x1="55" y1="348" x2="245" y2="348" stroke="#666666" stroke-width="1"/>
    </svg>`,

  shirt: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Body -->
      <path d="M95 55 Q100 40 110 35 Q130 28 150 28 Q170 28 190 35 Q200 40 205 55
               L230 75 L230 105 L208 100 L208 330 Q208 340 198 340 L102 340 Q92 340 92 330
               L92 100 L70 105 L70 75 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Collar -->
      <path d="M110 35 L125 55 L150 58 L175 55 L190 35 Q170 30 150 28 Q130 28 110 35Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Collar points -->
      <path d="M125 55 Q138 62 150 58 Q162 62 175 55" fill="none" stroke="#000000" stroke-width="1.2"/>
      <!-- Button placket -->
      <rect x="146" y="58" width="8" height="272" fill="#ffffff" stroke="#666666" stroke-width="0.75"/>
      <!-- Buttons -->
      <circle cx="150" cy="90"  r="3.5" fill="#000000" opacity="0.85"/>
      <circle cx="150" cy="130" r="3.5" fill="#000000" opacity="0.85"/>
      <circle cx="150" cy="170" r="3.5" fill="#000000" opacity="0.85"/>
      <circle cx="150" cy="210" r="3.5" fill="#000000" opacity="0.85"/>
      <circle cx="150" cy="250" r="3.5" fill="#000000" opacity="0.85"/>
      <!-- Side seams -->
      <line x1="92" y1="100" x2="92" y2="330" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="208" y1="100" x2="208" y2="330" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Pocket -->
      <rect x="102" y="118" width="36" height="30" rx="3" fill="#ffffff" stroke="#666666" stroke-width="0.75"/>
      <!-- Hem -->
      <line x1="92" y1="328" x2="208" y2="328" stroke="#666666" stroke-width="1"/>
    </svg>`,

  hoodie: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Body -->
      <path d="M90 65 Q85 50 95 42 Q115 28 150 26 Q185 28 205 42 Q215 50 210 65
               L240 85 L240 115 L215 110 L215 335 Q215 345 205 345 L95 345 Q85 345 85 335
               L85 110 L60 115 L60 85 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Hood -->
      <path d="M95 42 Q100 20 115 14 Q132 6 150 5 Q168 6 185 14 Q200 20 205 42
               L190 55 Q175 35 150 33 Q125 35 110 55 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Kangaroo pocket -->
      <path d="M105 250 Q105 240 115 238 L185 238 Q195 240 195 250 L195 295 Q195 305 185 306 L115 306 Q105 305 105 295 Z"
            fill="#ffffff" stroke="#666666" stroke-width="1"/>
      <!-- Center front seam -->
      <line x1="150" y1="62" x2="150" y2="238" stroke="#666666" stroke-width="0.75" stroke-dasharray="5 4"/>
      <!-- Ribbed cuffs indicator -->
      <line x1="60" y1="108" x2="85" y2="108" stroke="#000000" stroke-width="1.5"/>
      <line x1="60" y1="112" x2="85" y2="112" stroke="#000000" stroke-width="0.75" opacity="0.5"/>
      <line x1="215" y1="108" x2="240" y2="108" stroke="#000000" stroke-width="1.5"/>
      <line x1="215" y1="112" x2="240" y2="112" stroke="#000000" stroke-width="0.75" opacity="0.5"/>
      <!-- Ribbed hem -->
      <line x1="85" y1="338" x2="215" y2="338" stroke="#000000" stroke-width="1.5"/>
      <line x1="85" y1="342" x2="215" y2="342" stroke="#000000" stroke-width="0.75" opacity="0.5"/>
    </svg>`,

  coat: `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- Body -->
      <path d="M90 60 L65 45 L40 62 L38 115 L62 112 L62 365 L238 365 L238 112 L262 115 L260 62 L235 45 L210 60
               Q200 80 180 92 Q165 100 150 100 Q135 100 120 92 Q100 80 90 60Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Collar -->
      <path d="M90 60 Q100 45 120 38 Q134 32 150 30 Q166 32 180 38 Q200 45 210 60
               L195 78 Q178 62 150 60 Q122 62 105 78 Z"
            fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <!-- Lapels -->
      <path d="M150 100 L138 190 L128 365" fill="none" stroke="#000000" stroke-width="1"/>
      <path d="M150 100 L162 190 L172 365" fill="none" stroke="#000000" stroke-width="1"/>
      <!-- Pockets -->
      <rect x="68" y="248" width="48" height="35" rx="4" fill="#ffffff" stroke="#666666" stroke-width="1"/>
      <rect x="184" y="248" width="48" height="35" rx="4" fill="#ffffff" stroke="#666666" stroke-width="1"/>
      <!-- Buttons -->
      <circle cx="150" cy="180" r="5" fill="#000000" opacity="0.8"/>
      <circle cx="150" cy="218" r="5" fill="#000000" opacity="0.8"/>
      <circle cx="150" cy="256" r="5" fill="#000000" opacity="0.8"/>
      <!-- Vent -->
      <line x1="150" y1="320" x2="150" y2="365" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <!-- Seams -->
      <line x1="62" y1="112" x2="62" y2="365" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="238" y1="112" x2="238" y2="365" stroke="#666666" stroke-width="1" stroke-dasharray="4 3"/>
    </svg>`,
};

export const GARMENT_COLORS: Record<GarmentType, string> = {
  tshirt: '#c9a84c',
  dress:  '#00c4a7',
  jacket: '#c9a84c',
  jeans:  '#7b61ff',
  skirt:  '#00c4a7',
  shirt:  '#c9a84c',
  hoodie: '#7b61ff',
  coat:   '#c9a84c',
  custom: '#5a6380',
};
