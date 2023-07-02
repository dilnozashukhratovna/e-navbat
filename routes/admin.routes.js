const { Router } = require("express");
const {
    addAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
} = require("../controllers/admin.controllers");

const router = Router();

router.post("/", addAdmin);
router.get("/", getAdmins);
router.get("/:id", getAdminById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
