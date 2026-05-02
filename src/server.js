import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const app = express();
const rootDir = process.cwd();

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.get('/', (req, res) => res.redirect('/signIn'));

app.get('/signIn', (req, res) => res.render('signIn', { title: 'Iniciar sesión' }));
app.get('/signUp', (req, res) => res.render('signUp', { title: 'Registro' }));
app.get('/profile', (req, res) => res.render('profile', { title: 'Mi cuenta' }));
app.get('/dashboard-user', (req, res) =>
  res.render('dashboard-user', { title: 'Dashboard' }));
app.get('/dashboard-admin', (req, res) =>
  res.render('dashboard-admin', { title: 'Administración' }));
app.get('/403', (req, res) => res.render('403', { title: 'Acceso denegado' }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.status(404).render('404', { title: 'No encontrado' });
});

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  res.status(404).json({ message: 'Recurso no encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api')) {
    return res.status(err.status || 500).json({
      message: err.message || 'Error interno del servidor'
    });
  }
  res.status(err.status || 500).render('404', { title: 'Error' });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, { autoIndex: true })
  .then(async () => {
    console.log('Mongo connected');
    await seedRoles();
    await seedUsers();
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error al conectar con Mongo:', err);
    process.exit(1);
  });
