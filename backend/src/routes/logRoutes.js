import { Router } from "express"
import auth from "../middleware/auth.js"
import { createLog, getLogs, deleteLog, getStats } from "../controllers/logController.js"

const router = Router()

router.post("/", auth, createLog)
router.get("/", auth, getLogs)
router.get("/stats", auth, getStats)
router.delete("/:id", auth, deleteLog)

export default router
