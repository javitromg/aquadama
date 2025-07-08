const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const empleadosRoutes = require('./routes/empleados');
const adminsRoutes = require('./routes/admins');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/empleados', empleadosRoutes);
app.use('/api/admins', adminsRoutes);

app.get('/', (_, res) => res.send('Aquadama backend operativo'));

app.listen(PORT, () => {
  console.log(`✅ Servidor backend en marcha en el puerto ${PORT}`);
});
