import nodemailer from 'nodemailer';
import tls from 'node:tls';

export const MAILBOX = 'hello@scubalak.com';

// Let the runtime connect to the named TLS endpoint directly. Nodemailer's
// pre-resolved IP path is rejected by the Workers socket proxy in this setup.
export function createGoDaddySocket(options, callback, connect = tls.connect) {
  let socket;
  let settled = false;
  const failed = error => { if (!settled) { settled = true; callback(error); } };
  try {
    socket = connect({ host: 'smtpout.secureserver.net', port: 465, servername: 'smtpout.secureserver.net', minVersion: 'TLSv1.2', rejectUnauthorized: true });
    socket.once('error', failed);
    socket.setTimeout(options.connectionTimeout, () => {
      const error = Object.assign(new Error('SMTP connection timeout'), { code: 'ETIMEDOUT', command: 'CONN' });
      socket.destroy(error);
    });
    socket.once('secureConnect', () => {
      if (settled) return;
      settled = true;
      socket.removeListener('error', failed);
      socket.setTimeout(0);
      callback(null, { connection: socket, secured: true });
    });
  } catch (error) { socket?.destroy(); failed(error); }
}

export function smtpOptions(password) {
  return {
    host: 'smtpout.secureserver.net', port: 465, secure: true,
    name: 'www.scubalak.com',
    auth: { user: MAILBOX, pass: password },
    tls: { servername: 'smtpout.secureserver.net', minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 6000, greetingTimeout: 6000, socketTimeout: 8000,
    getSocket: createGoDaddySocket,
    logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true
  };
}

export async function sendEnquiry(message, env) {
  const transport = nodemailer.createTransport(smtpOptions(env.SMTP_PASSWORD));
  let timer;
  try {
    return await Promise.race([
      transport.sendMail(message),
      new Promise((_, reject) => {
        timer = setTimeout(() => { transport.close(); reject(new Error('SMTP_TIMEOUT')); }, 14000);
      })
    ]);
  } finally {
    clearTimeout(timer);
    transport.close();
  }
}
