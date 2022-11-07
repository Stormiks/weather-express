const router = require('express').Router();

const {
  Weather, Sensor, SensorModel,
} = require('../db/models/index.js');

module.exports = (app) => {
  router.get('/sensors/list', (req, res) => {
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

  router.post('/sensors/add', (req, res) => {
    SensorModel.create({
      modelName: req.body.modelName,
    }).then((model) => {
      res.status(201).send({
        success: true,
        data: model,
      });
    });
  });

  router.get('/sensor-models/list', (req, res) => {
    SensorModel.findAndCountAll({
      raw: true,
      nest: true,
      attributes: ['id', 'modelName'],
    }).then((models) => {
      res.status(200).send(models);
    }).catch((err) => res.status(500).send({ err }));
  });

  router.get('/weather-list', (req, res) => {
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

  app.use('/api/', router);
};
