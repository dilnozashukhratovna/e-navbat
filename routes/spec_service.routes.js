const { Router } = require("express");
const {
    addSpec_service,
    getSpec_services,
    getSpec_serviceById,
    updateSpec_service,
    deleteSpec_service,
} = require("../controllers/spec_service.controllers");

const router = Router();

router.post("/", addSpec_service);
router.get("/", getSpec_services);
router.get("/:id", getSpec_serviceById);
router.put("/:id", updateSpec_service);
router.delete("/:id", deleteSpec_service);

module.exports = router;
