/**
 * Health check controller for ENIAD-ASSISTANT
 */
function getHealthStatus() {
  return {
    service: 'ENIAD-ASSISTANT',
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}

function checkLiveness() {
  return true;
}

function checkReadiness() {
  return true;
}

module.exports = {
  getHealthStatus,
  checkLiveness,
  checkReadiness
};
