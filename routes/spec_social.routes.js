const { Router } = require("express");
const {
    addSpec_social,
    getSpec_socials,
    getSpec_socialById,
    updateSpec_social,
    deleteSpec_social,
} = require("../controllers/spec_social.controllers");

const router = Router();

router.post("/", addSpec_social);
router.get("/", getSpec_socials);
router.get("/:id", getSpec_socialById);
router.put("/:id", updateSpec_social);
router.delete("/:id", deleteSpec_social);

module.exports = router;
