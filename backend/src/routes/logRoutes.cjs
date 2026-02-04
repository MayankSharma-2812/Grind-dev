const { Router } = require("express");
const auth = require("../middleware/auth.cjs");
const { createLog, getLogs, deleteLog, getStats, updateLog } = require("../controllers/logController.cjs");

const router = Router();

router.post("/", auth, createLog);
router.get("/", auth, getLogs);
router.get("/stats", auth, getStats);
router.delete("/:id", auth, deleteLog);
router.put("/:id", auth, updateLog);

module.exports = router;
