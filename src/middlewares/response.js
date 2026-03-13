const { StatusCodes } = require('http-status-codes');

const sendSuccess = (res, data, statusCode = StatusCodes.OK) => {
    return res.status(statusCode).json({
        status: 'success',
        data,
    });
};

const sendCreated = (res, data) => {
    return sendSuccess(res, data, StatusCodes.CREATED);
};

const sendNoContent = (res) => {
    return res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = { sendSuccess, sendCreated, sendNoContent };