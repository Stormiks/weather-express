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

const { Weather, Sensor, sequelize } = require('./db/models/index.js');

parserSerialPort.on('data', (data) => {
  const [type, message] = String(data).split('@');
  const emit = {
    SensorData: (str) => Number(str),
    SensorDetail: (str) => String(str),
  };

  const parseRawData = Array.from(message.split(',').map((element) => {
    const str = element.split(':');

    return {
      [str[0]]: emit[type](str[1]),
    };
  })).reduce((prevVal, curVal) => Object.assign(prevVal, curVal), {});

  switch (type) {
    case 'SensorDetail':
      console.log('[SENSOR INFO]');
      Sensor.create({
        deviceId: parseRawData.deviceId,
        serialNumber: parseRawData.deviceSerialNumber,
        manufacturerId: parseRawData.manufacturerId,
      });
      break;

    case 'SensorData':
      console.log('[SENSOR DATA]');
      Sensor.findByPk(1).then((sensor) => {
        sensor.createWeather({
          temperature: parseRawData.T,
          humidity: parseRawData.H,
        });
      });
      break;

    default:
      console.error('[ERROR]: Not found emits');
      break;
  }
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/list', (req, res) => {
  const PAGE_LIMIT = 10;

  Weather.findAndCountAll({
    raw: true,
    nest: true,
    limit: PAGE_LIMIT,
    offset: (req.query.page - 1) * PAGE_LIMIT,
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
    process.exit(-1);
  }
});
