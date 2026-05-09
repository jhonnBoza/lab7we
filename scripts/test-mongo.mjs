/**
 * Prueba rápida de MONGODB_URI (Atlas o local).
 * En algunos entornos Windows el resolvedor por defecto falla con querySrv ECONNREFUSED;
 * se intenta de nuevo con DNS públicos solo si ocurre ese error.
 */
import dns from 'node:dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Falta MONGODB_URI en .env');
  process.exit(1);
}

async function connect() {
  await mongoose.connect(uri);
}

try {
  await connect();
} catch (err) {
  if (err.code === 'ECONNREFUSED' && err.syscall === 'querySrv') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    await connect();
  } else {
    throw err;
  }
}

console.log('Conexion OK. Base:', mongoose.connection.name);
await mongoose.disconnect();
console.log('Prueba terminada.');
