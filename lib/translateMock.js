const PHRASE_MAP = {
  'wie geht es dir': 'How are you?',
  'wie geht es dir?': 'How are you?',
  'wie gehts': 'How are you?',
  'wie gehts?': 'How are you?',
  hallo: 'Hello',
  'guten tag': 'Good day',
  'guten morgen': 'Good morning',
  danke: 'Thank you',
  hola: 'Hello',
  'hola, ¿cómo estás?': 'Hello, how are you?',
  'hola, como estas?': 'Hello, how are you?',
  'como estas': 'How are you?',
  'como estas?': 'How are you?',
  'cómo estás': 'How are you?',
  'cómo estás?': 'How are you?',
  bonjour: 'Hello',
  'comment ça va': 'How are you?',
  'comment ca va': 'How are you?',
  'kese hu': 'How are you?',
  'kese ho': 'How are you?',
  'kaise ho': 'How are you?',
  'kaise hu': 'How are you?',
  salam: 'Hello',
  namaste: 'Hello',
  ciao: 'Hello',
  gracias: 'Thank you',
  merci: 'Thank you',
  'hi there': 'Hi there',
  hi: 'Hi',
  'nasılsın': 'How are you?',
  nasilsin: 'How are you?',
  'nasilsın': 'How are you?',
  merhaba: 'Hello',
  'teşekkürler': 'Thank you',
  tesekkurler: 'Thank you',
  'iyi günler': 'Good day',
  'iyi gunler': 'Good day',
};

function normalizeKey(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

/** Exact phrase fallback only — never guess from single words like French "du". */
export function mockTranslateText(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return null;

  const key = trimmed.toLowerCase();
  const asciiKey = normalizeKey(trimmed);

  return PHRASE_MAP[key] || PHRASE_MAP[asciiKey] || null;
}
