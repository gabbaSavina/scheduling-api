const appointmentsService = require('../services/appointments.service');
const { sendSuccess, sendCreated } = require('../middlewares/response');

const getAllByClinic = async (req, res, next) => {
    try {
        const appointments = await appointmentsService.getAllByClinic(
        req.params.clinicId,
        req.query
        );
    sendSuccess(res, appointments);
    } catch (err) {
    next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const appointment = await appointmentsService.getById(
        req.params.id,
        req.params.clinicId
        );
        sendSuccess(res, appointment);
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const appointment = await appointmentsService.create(
        req.params.clinicId,
        req.body
        );
        sendCreated(res, appointment);
    } catch (err) {
        next(err);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const appointment = await appointmentsService.updateStatus(
        req.params.id,
        req.params.clinicId,
        req.body
    );
    sendSuccess(res, appointment);
    } catch (err) {
    next(err);
    }
};

module.exports = { getAllByClinic, getById, create, updateStatus };