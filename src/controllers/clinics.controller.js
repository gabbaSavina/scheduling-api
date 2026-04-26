const clinicsService = require("../services/clinics.service");
const {
  sendSuccess,
  sendCreated,
  sendNoContent,
} = require("../middlewares/response");

const getAll = async (req, res, next) => {
  try {
    const clinics = await clinicsService.getAll();
    sendSuccess(res, clinics);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const clinic = await clinicsService.getById(req.params.id);
    sendSuccess(res, clinic);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const clinic = await clinicsService.create(req.body);
    sendCreated(res, clinic);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const clinic = await clinicsService.update(req.params.id, req.body);
    sendSuccess(res, clinic);
  } catch (err) {
    next(err);
  }
};

const deactivate = async (req, res, next) => {
  try {
    await clinicsService.deactivate(req.params.id);
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, deactivate };
