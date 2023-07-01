const { Router } = require("express");
const {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
} = require("../controllers/service.controllers");

const router = Router();

router.post("/", addService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
