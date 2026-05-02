const sampleNotifications = [
  { "ID": "ea836726-c25e-4f21-a72f-544a6af8a37f", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42" },
  { "ID": "003cb427-8fc6-47f7-bb00-be228f6b0d2c", "Type": "Result", "Message": "external", "Timestamp": "2026-04-22 17:50:30" },
  { "ID": "e5c4ff20-31bf-4d40-8f02-72fda59e8918", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:18" },
  { "ID": "1cfce5ee-ad37-4894-8946-d707627176a5", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:06" },
  { "ID": "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:49:54" },
  { "ID": "8a7412bd-6065-4d09-8501-a37f11cc848b", "Type": "Placement", "Message": "Advanced Micro Devices Inc. hiring", "Timestamp": "2026-04-22 17:49:42" }
];

const typeWeights = {
  Placement: 100,
  Result: 70,
  Event: 40
};

const maxRecencyPoints = 100;
const decayHours = 48;

function parseTimestamp(value) {
  const normalized = value.replace(/-/g, '/');
  return new Date(normalized);
}

function computeScore(notification) {
  const typeWeight = typeWeights[notification.Type] ?? 20;
  const createdAt = parseTimestamp(notification.Timestamp);
  const now = new Date();
  const ageHours = Math.max(0, (now - createdAt) / (1000 * 60 * 60));
  const recencyScore = Math.max(0, maxRecencyPoints - (ageHours * (maxRecencyPoints / decayHours)));
  return typeWeight + recencyScore;
}

function rankNotifications(notifications, topN) {
  return notifications
    .filter(item => item.Type && item.Message && item.Timestamp)
    .map(item => ({ ...item, score: computeScore(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

function renderResult(notifications, topN) {
  const tableBody = document.querySelector('#resultTable tbody');
  const summary = document.getElementById('resultSummary');
  tableBody.innerHTML = '';

  if (notifications.length === 0) {
    summary.textContent = 'No valid unread notifications found in the input.';
    return;
  }

  summary.textContent = `Showing top ${notifications.length} prioritized notifications.`;

  notifications.forEach((notification, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${notification.Type}</td>
      <td>${notification.Message}</td>
      <td>${notification.Timestamp}</td>
      <td>${notification.score.toFixed(1)}</td>
    `;
    tableBody.appendChild(row);
  });
}

function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
}

function clearError() {
  showError('');
}

function loadDefaultInput() {
  const inputElement = document.getElementById('notificationInput');
  inputElement.value = JSON.stringify(sampleNotifications, null, 2);
}

function handleGenerate() {
  clearError();
  const rawInput = document.getElementById('notificationInput').value.trim();
  const topCount = Number(document.getElementById('topCount').value) || 10;

  if (!rawInput) {
    showError('Please enter notification JSON before generating the inbox.');
    return;
  }

  let notifications;
  try {
    notifications = JSON.parse(rawInput);
    if (!Array.isArray(notifications)) {
      throw new Error('Expected an array of notifications.');
    }
  } catch (error) {
    showError(`Invalid JSON input: ${error.message}`);
    return;
  }

  const prioritized = rankNotifications(notifications, topCount);
  renderResult(prioritized, topCount);
}

window.addEventListener('DOMContentLoaded', () => {
  loadDefaultInput();
  document.getElementById('generateBtn').addEventListener('click', handleGenerate);
  handleGenerate();
});
