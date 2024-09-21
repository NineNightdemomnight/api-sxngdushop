const express = require('express')
const byFluxus = require('./api/byfluxus.js')
const byRelzScript = require('./api/byrelzscript.js')

/*import express from 'express';
import byFluxus from './api/byfluxus.js';
import byRelzScript from './api/byrelzscript.js';*/

const app = express();
const PORT = process.env.PORT || 4000;

// เส้นทางหลัก
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳');
});

// เส้นทางเกี่ยวกับ
app.get('/about', (req, res) => {
  res.send('This is my about route..... ');
});

// ใช้งาน API
app.use('/api/byfluxus', byFluxus);
app.use('/api/byrelzscript', byRelzScript);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT}`);
});

// Export the Express API
export default app;
