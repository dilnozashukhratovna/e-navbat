const { Router } = require("express");
const router = Router();

const clientRouter = require("./client.routes")
const serviceRouter = require("./service.routes");
const queueRouter = require("./queue.routes");
const spec_serviceRouter = require("./spec_service.routes");
const socialRouter = require("./social.routes");
const spec_socialRouter = require("./spec_social.routes");
const adminRouter = require("./admin.routes");
const spec_working_dayRouter = require("./spec_working_day.routes");
const specialistRouter = require("./specialist.routes");
const otpRouter = require("./otp.routes")



router.use("/client", clientRouter)
router.use("/service", serviceRouter);
router.use("/queue", queueRouter);
router.use("/sp_service", spec_serviceRouter);
router.use("/social", socialRouter);
router.use("/sp_social", spec_socialRouter);
router.use("/admin", adminRouter);
router.use("/sp_working_day", spec_working_dayRouter);
router.use("/specialist", specialistRouter);
router.use("/otp", otpRouter);








module.exports = router;
