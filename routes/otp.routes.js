const { Router } = require("express");
const {
    newOtp,
    getOtp,
    updateOtp,
    deleteOtp,
    getOtpById,
    verifyOtp,
} = require("../controllers/otp.controllers");

const router = Router();

router.post("/newotp", newOtp);
// router.get("/", getOtp);
// router.put("/:id", updateOtp);
router.delete("/:id", deleteOtp);
router.get("/:id", getOtpById);
router.post("/verify", verifyOtp);

module.exports = router;
