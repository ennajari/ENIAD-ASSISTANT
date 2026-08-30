/**
 * Prometheus metrics exporter module for ENIAD-ASSISTANT
 */
const healthStatus = { healthy: true, uptime: process.uptime() };

function getMetrics() {
  return `# HELP app_health_status Application health status (1=healthy, 0=unhealthy)
# TYPE app_health_status gauge
app_health_status 1
# HELP app_uptime_seconds Application uptime in seconds
# TYPE app_uptime_seconds counter
app_uptime_seconds ${process.uptime()}
`;
}

module.exports = { getMetrics, healthStatus };
