const { Router } = require("express");
const {
    addSocial,
    getSocials,
    getSocialById,
    updateSocial,
    deleteSocial,
} = require("../controllers/social.controllers");

const router = Router();

router.post("/", addSocial);
router.get("/", getSocials);
router.get("/:id", getSocialById);
router.put("/:id", updateSocial);
router.delete("/:id", deleteSocial);

module.exports = router;
