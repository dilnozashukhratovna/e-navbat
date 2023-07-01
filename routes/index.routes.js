const { Router } = require("express");
const router = Router();

const clientRouter = require("./client.routes")
const serviceRouter = require("./service.routes");
const queueRouter = require("./queue.routes");
const spec_serviceRouter = require("./spec_service.routes");
const socialRouter = require("./social.routes");
const spec_socialRouter = require("./spec_social.routes");


router.use("/client", clientRouter)
router.use("/service", serviceRouter);
router.use("/queue", queueRouter);
router.use("/sp_service", spec_serviceRouter);
router.use("/social", socialRouter);
router.use("/sp_social", spec_socialRouter);






module.exports = router;
