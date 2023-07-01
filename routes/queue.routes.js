const { Router } = require("express");
const {
    addQueue,
    getQueues,
    getQueueById,
    updateQueue,
    deleteQueue,
} = require("../controllers/queue.controllers");

const router = Router();

router.post("/", addQueue);
router.get("/", getQueues);
router.get("/:id", getQueueById);
router.put("/:id", updateQueue);
router.delete("/:id", deleteQueue);

module.exports = router;
