const { Router } = require("express");
const { addClient, getClients, getClientById, updateClient, deleteClient } = require("../controllers/client.controllers");

const router = Router();

router.post("/", addClient);
router.get("/", getClients);
router.get("/:id", getClientById);  
router.put("/:id", updateClient);  
router.delete("/:id", deleteClient);  





module.exports = router;
