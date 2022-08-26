const path = require('path');
const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const serialport = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
});
const parserSerialPort = serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const PORT = 8112;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'ejs');

const { Weather, sequelize } = require('./db/models/index');

parserSerialPort.on('data', (data) => {
  let dataTmp = String(data).split(',').map((element) => {
    const str = element.split('=');

    return {
      [str[0]]: Number(str[1]),
    };
  });

  dataTmp = { ...dataTmp[0], ...dataTmp[1] };

  Weather.create({
    temperature: dataTmp.T,
    humidity: dataTmp.H,
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/list', (req, res) => {
  console.log();
  Weather.findAndCountAll({
    raw: true,
    nest: true,
    limit: 10,
    offset: 10 * req.query.page,
  }).then((data) => {
    res.json(data);
  }).catch((err) => res.send({ err }));
});

app.listen(PORT, 'localhost', async () => {
  try {
    sequelize.sync();
    console.log(`Server start http://localhost:${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
