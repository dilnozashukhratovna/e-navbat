const { Router } = require("express");
const router = Router();

const clientRouter = require("./client.routes")
const serviceRouter = require("./service.routes");


router.use("/client", clientRouter)
router.use("/service", serviceRouter);


module.exports = router;
