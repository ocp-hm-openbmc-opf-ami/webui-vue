// Parses the backend Redfish LicenseControl "AlertMessage" field
// ("SERVICE:days;SERVICE:days;") and returns the remaining days for the given
// service, falling back to GLOBAL when the service is absent. Returns null
// when neither entry exists or the selected value is malformed or negative.
export function parseLicenseAlertDays(alertMessage, model) {
  if (!alertMessage || model === undefined || model === null) return null;
  const entries = alertMessage.split(';').map((item) => item.trim());
  const entry =
    entries.find((item) => item.split(':')[0] === model) ||
    entries.find((item) => item.split(':')[0] === 'GLOBAL');
  if (!entry) return null;
  const days = parseInt(entry.split(':')[1], 10);
  if (Number.isNaN(days) || days < 0) return null;
  return days;
}
