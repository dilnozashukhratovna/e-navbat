const { Router } = require("express");
const {
    addSpecialist,
    getSpecialists,
    getSpecialistById,
    updateSpecialist,
    deleteSpecialist,
} = require("../controllers/specialist.controllers");

const router = Router();

router.post("/", addSpecialist);
router.get("/", getSpecialists);
router.get("/:id", getSpecialistById);
router.put("/:id", updateSpecialist);
router.delete("/:id", deleteSpecialist);

module.exports = router;
