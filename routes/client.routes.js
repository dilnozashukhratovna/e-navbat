const { Router } = require("express");
const {
    addClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
} = require("../controllers/client.controllers");

const router = Router();

const clientPolice = require("../middleware/clientPolice");


router.post("/", addClient);
router.get("/", clientPolice, getClients);
router.get("/:id", getClientById);
router.put("/:id", clientPolice, updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
