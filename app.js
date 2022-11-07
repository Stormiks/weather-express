const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = 8112;
const argsPythonProcess = [path.join(__dirname, '_sensors', 'sensor_launch.py')];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', PORT);
app.set('view engine', 'ejs');

const {
  Weather, Sensor, SensorModel, sequelize,
} = require('./db/models/index.js');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/sensors', (req, res) => {
  res.render('sensors');
});

app.get('/api/sensors/list', (req, res) => {
  const PAGE_LIMIT = 10;

  Sensor.findAndCountAll({
    raw: true,
    nest: true,
    limit: PAGE_LIMIT,
    offset: (req.query.page - 1) * PAGE_LIMIT,
  }).then((data) => {
    res.json(data);
  }).catch((err) => res.send({ err }));
});

app.post('/api/sensors/add', (req, res) => {
  SensorModel.create({
    modelName: req.body.modelName,
  }).then((model) => {
    res.status(201).send({
      success: true,
      data: model,
    });
  });
});

app.get('/api/sensor-models/list', (req, res) => {
  SensorModel.findAndCountAll({
    raw: true,
    nest: true,
    attributes: ['id', 'modelName'],
  }).then((models) => {
    res.status(200).send(models);
  }).catch((err) => res.status(500).send({ err }));
});

app.get('/api/weather-list', (req, res) => {
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

app.listen(app.get('port'), 'localhost', async () => {
  try {
    sequelize.sync();
    console.info(`Server start http://localhost:${app.get('port')}`);

    const pythonProcess = spawn('python', argsPythonProcess);
    pythonProcess.stdout.setEncoding('utf8');
    pythonProcess.stderr.setEncoding('utf8');

    pythonProcess.stdout.on('data', (data) => {
      const [type, message] = String(data).split('@');
      const emit = {
        SensorData: (str) => Number(str),
        SensorDetail: (str) => String(str).trim(),
      };

      const parseRawData = Array.from(message.split(',')
        .map((element) => {
          const str = element.split(':');
          const emitName = String(str[0]).trim();

          if (emitName === 'deviceSerialNumber') {
            return {
              [emitName]: emit.SensorDetail(str[1]),
            };
          }

          return {
            [emitName]: emit[type](str[1]),
          };
        }))
        .reduce((prevVal, curVal) => Object.assign(prevVal, curVal), {});

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
          Sensor.findAll({
            limit: 1,
            where: {
              serialNumber: parseRawData.deviceSerialNumber,
            },
            order: [['createdAt', 'DESC']],
          }).then((sensor) => {
            sensor[0].createWeather({
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

    pythonProcess.stderr.on('data', (err) => {
      console.error(err);
    });

    pythonProcess.on('exit', () => {
      console.warn('The python script has exited');
      process.exit(-1);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(-1);
  }
});
