const fs = require('fs');

function log(level, message, meta = {}) {
  const logObj = {
    timestamp: new Date().toISOString(),
    level,
    service: 'ENIAD-ASSISTANT',
    message,
    ...meta
  };
  console.log(JSON.stringify(logObj));
}

module.exports = {
  info: (msg, meta) => log('INFO', msg, meta),
  error: (msg, meta) => log('ERROR', msg, meta),
  warn: (msg, meta) => log('WARN', msg, meta)
};
