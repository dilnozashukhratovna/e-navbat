const { Router } = require("express");
const {
    addSpec_working_day,
    getSpec_working_days,
    getSpec_working_dayById,
    updateSpec_working_day,
    deleteSpec_working_day,
} = require("../controllers/spec_working_day.controllers");

const router = Router();

router.post("/", addSpec_working_day);
router.get("/", getSpec_working_days);
router.get("/:id", getSpec_working_dayById);
router.put("/:id", updateSpec_working_day);
router.delete("/:id", deleteSpec_working_day);

module.exports = router;
