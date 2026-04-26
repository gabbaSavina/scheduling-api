const { Router } = require("express");
const clinicsController = require("../controllers/clinics.controller");
const appointmentsController = require("../controllers/appointments.controller");
const {
  usersController,
  staffController,
  servicesController,
} = require("../controllers/entities.controller");
const {
  clinicRules,
  userRules,
  staffRules,
  serviceRules,
  appointmentRules,
} = require("../middlewares/validators");

const router = Router();

router.get("/clinics", clinicsController.getAll);
router.get("/clinics/:id", clinicRules.getById, clinicsController.getById);
router.post("/clinics", clinicRules.create, clinicsController.create);
router.put("/clinics/:id", clinicRules.update, clinicsController.update);
router.delete(
  "/clinics/:id",
  clinicRules.deactivate,
  clinicsController.deactivate,
);

router.get("/clinics/:clinicId/users", userRules.list, usersController.getAll);
router.get(
  "/clinics/:clinicId/users/:id",
  userRules.getById,
  usersController.getById,
);
router.post(
  "/clinics/:clinicId/users",
  userRules.create,
  usersController.create,
);
router.put(
  "/clinics/:clinicId/users/:id",
  userRules.update,
  usersController.update,
);
router.delete(
  "/clinics/:clinicId/users/:id",
  userRules.deactivate,
  usersController.deactivate,
);

router.get("/clinics/:clinicId/staff", staffRules.list, staffController.getAll);
router.get(
  "/clinics/:clinicId/staff/:id",
  staffRules.getById,
  staffController.getById,
);
router.post(
  "/clinics/:clinicId/staff",
  staffRules.create,
  staffController.create,
);
router.put(
  "/clinics/:clinicId/staff/:id",
  staffRules.update,
  staffController.update,
);
router.delete(
  "/clinics/:clinicId/staff/:id",
  staffRules.deactivate,
  staffController.deactivate,
);

router.get(
  "/clinics/:clinicId/services",
  serviceRules.list,
  servicesController.getAll,
);
router.get(
  "/clinics/:clinicId/services/:id",
  serviceRules.getById,
  servicesController.getById,
);
router.post(
  "/clinics/:clinicId/services",
  serviceRules.create,
  servicesController.create,
);
router.put(
  "/clinics/:clinicId/services/:id",
  serviceRules.update,
  servicesController.update,
);
router.delete(
  "/clinics/:clinicId/services/:id",
  serviceRules.deactivate,
  servicesController.deactivate,
);

router.get(
  "/clinics/:clinicId/appointments",
  appointmentRules.list,
  appointmentsController.getAllByClinic,
);
router.get(
  "/clinics/:clinicId/appointments/:id",
  appointmentRules.getById,
  appointmentsController.getById,
);
router.post(
  "/clinics/:clinicId/appointments",
  appointmentRules.create,
  appointmentsController.create,
);
router.patch(
  "/clinics/:clinicId/appointments/:id/status",
  appointmentRules.updateStatus,
  appointmentsController.updateStatus,
);

module.exports = router;
