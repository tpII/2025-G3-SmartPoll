// Constante para activar/desactivar datos mock
export const USE_MOCK_DATA = false;

// IDs de candidatos
const CANDIDATE_IDS = {
  JULIAN: "e72f1c8a-3a1e-45cb-91a3-7a3122f0dce5",
  MARTINA: "c18c6e9d-bc74-4b72-9f7e-ef7e2c7a1a91",
  CAMILA: "b21d7a3c-5f48-4e8a-bef0-203b7a6c3d22",
  TOMAS: "a63f82e7-7f3e-470a-8f5a-10d9e8dfc145",
  NULL: "00000000-0000-0000-0000-000000000000",
};

// Datos mock consistentes
// Distribución de votos (ajustado para ~10,500 escaneos exitosos)
const VOTES = {
  [CANDIDATE_IDS.JULIAN]: 3_340, // 31.8%
  [CANDIDATE_IDS.MARTINA]: 2_870, // 27.3%
  [CANDIDATE_IDS.CAMILA]: 2_520, // 24.0%
  [CANDIDATE_IDS.TOMAS]: 1_785, // 17.0%
  [CANDIDATE_IDS.NULL]: 485, // Votos nulos
};

// Total de escaneos exitosos = votos válidos + votos nulos
const SUCCESSFUL_SCANS = 3_340 + 2_870 + 2_520 + 1_785 + 485; // = 11,000

// Escaneos con error
const INVALID_QR_SCANS = 245;
const ALREADY_USED_SCANS = 155;

// Total de intentos de escaneo
const TOTAL_SCANS = SUCCESSFUL_SCANS + INVALID_QR_SCANS + ALREADY_USED_SCANS; // = 11,400

export const mockVoteResults = {
  electionId: 1,
  results: VOTES,
};

// Generar intentos de escaneo QR distribuidos entre 8 AM y 6 PM
function generateQRScanAttempts() {
  const attempts = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Obtener el inicio del día de hoy (medianoche)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const startTime = todayStart.getTime();
  
  // Horario de votación: 8 AM (hora 8) a 6 PM (hora 18)
  const votingStartHour = 8;
  const votingEndHour = 18;
  const votingHours = votingEndHour - votingStartHour; // 10 horas

  // Generar escaneos exitosos
  for (let i = 0; i < SUCCESSFUL_SCANS; i++) {
    // Seleccionar una hora aleatoria entre 8 AM y 6 PM
    const hourIndex = Math.floor(Math.random() * votingHours);
    const selectedHour = votingStartHour + hourIndex;
    
    // Generar un timestamp dentro de esa hora específica
    const hourStartTime = startTime + (selectedHour * oneHour);
    const randomMinutesInHour = Math.random() * oneHour;
    const timestamp = hourStartTime + randomMinutesInHour;

    attempts.push({
      createdAt: Math.floor(timestamp),
      qrScanStatus: "SUCCESS",
    });
  }

  // Generar escaneos con QR inválido (también solo en horario de votación)
  for (let i = 0; i < INVALID_QR_SCANS; i++) {
    const hourIndex = Math.floor(Math.random() * votingHours);
    const selectedHour = votingStartHour + hourIndex;
    const hourStartTime = startTime + (selectedHour * oneHour);
    const randomMinutesInHour = Math.random() * oneHour;
    const timestamp = hourStartTime + randomMinutesInHour;

    attempts.push({
      createdAt: Math.floor(timestamp),
      qrScanStatus: "INVALID_QR",
    });
  }

  // Generar escaneos ya utilizados (también solo en horario de votación)
  for (let i = 0; i < ALREADY_USED_SCANS; i++) {
    const hourIndex = Math.floor(Math.random() * votingHours);
    const selectedHour = votingStartHour + hourIndex;
    const hourStartTime = startTime + (selectedHour * oneHour);
    const randomMinutesInHour = Math.random() * oneHour;
    const timestamp = hourStartTime + randomMinutesInHour;

    attempts.push({
      createdAt: Math.floor(timestamp),
      qrScanStatus: "ALREADY_USED",
    });
  }

  // Ordenar por timestamp
  attempts.sort((a, b) => a.createdAt - b.createdAt);

  return attempts;
}

export const mockQRScanResponse = {
  content: generateQRScanAttempts(),
  totalElements: TOTAL_SCANS,
};

