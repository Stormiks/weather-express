const router = require('express').Router();

const {
  Weather, Sensor, SensorModel,
} = require('../db/models/index.js');

const PAGE_LIMIT = 10;

module.exports = (app) => {
  router.get('/sensor/list', (req, res) => {
    Sensor.findAndCountAll({
      where: {
        model: req.query.model,
      },
      raw: true,
      nest: true,
      limit: PAGE_LIMIT,
      offset: (req.query.page - 1) * PAGE_LIMIT,
    }).then((data) => {
      res.json(data);
    }).catch((err) => res.send({ err }));
  });

  router.post('/sensor/model/add', (req, res) => {
    SensorModel.create({
      modelName: req.body.modelName,
    }).then((model) => {
      res.status(201).send({
        success: true,
        data: model,
      });
    });
  });

  router.get('/sensor/model/list', (req, res) => {
    SensorModel.findAndCountAll({
      raw: true,
      nest: true,
      attributes: ['id', 'modelName'],
    }).then((models) => {
      res.status(200).send(models);
    }).catch((err) => res.status(500).send({ err }));
  });

  router.get('/weather/list', (req, res) => {
    Weather.findAndCountAll({
      raw: true,
      nest: true,
      limit: PAGE_LIMIT,
      offset: (req.query.page - 1) * PAGE_LIMIT,
    }).then((data) => {
      res.json(data);
    }).catch((err) => res.send({ err }));
  });

  router.get('/weather/latest', (req, res) => {
    Weather.findAll({
      limit: PAGE_LIMIT,
      attributes: {
        exclude: ['deletedAt', 'updatedAt'],
      },
      order: [['createdAt', 'DESC']],
    }).then((data) => {
      res.json(data);
    }).catch((err) => res.send({ err }));
  });

  app.use('/api/', router);
};
