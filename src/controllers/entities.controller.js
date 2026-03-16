const { users, staff, services } = require('../services/entities.service');
const { sendSuccess, sendCreated, sendNoContent } = require('../utils/response');

// Factory que genera un controller estándar dado un service
const makeController = (service) => ({
  getAll: async (req, res, next) => {
    try {
      const data = await service.getAllByClinic(req.params.clinicId);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const data = await service.getById(req.params.id, req.params.clinicId);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const data = await service.create(req.params.clinicId, req.body);
      sendCreated(res, data);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const data = await service.update(req.params.id, req.params.clinicId, req.body);
      sendSuccess(res, data);
    } catch (err) { next(err); }
  },

  deactivate: async (req, res, next) => {
    try {
      await service.deactivate(req.params.id, req.params.clinicId);
      sendNoContent(res);
    } catch (err) { next(err); }
  },
});

module.exports = {
  usersController: makeController(users),
  staffController: makeController(staff),
  servicesController: makeController(services),
};