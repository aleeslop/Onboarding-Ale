import express, { Request, Response } from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const paginaPublica = path.resolve(__dirname, process.env.STATIC_ROOT ?? '../..');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  ...(process.env.DB_PASSWORD ? { password: process.env.DB_PASSWORD } : {}),
});

// Middleware para permitir CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});

app.use(express.json());
app.use(express.static(paginaPublica));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(paginaPublica, 'index.html'));
});

app.get('/alumnos', async (req: Request, res: Response) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, matricula, grado FROM alumnos ORDER BY id'
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar alumnos:', error);
    res.status(500).json({ error: 'No se pudieron consultar los alumnos' });
  }
});

app.post('/alumnos', async (req: Request, res: Response) => {
  const { nombre, matricula, grado } = req.body as {
    nombre?: string;
    matricula?: string;
    grado?: string;
  };

  if (!nombre || !matricula || !grado) {
    res.status(400).json({ error: 'nombre, matricula y grado son obligatorios' });
    return;
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO alumnos (nombre, matricula, grado) VALUES ($1, $2, $3) RETURNING id, nombre, matricula, grado',
      [nombre, matricula, grado]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al insertar alumno:', error);
    res.status(500).json({ error: 'No se pudo registrar el alumno' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
