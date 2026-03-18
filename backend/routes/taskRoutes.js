const express = require("express");
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { createTaskValidation, updateTaskValidation, taskQueryValidation } = require("../middleware/validators");

// All task routes are protected
router.use(protect);

router.route("/")
  .get(taskQueryValidation, getTasks)
  .post(createTaskValidation, createTask);

router.route("/:id")
  .get(getTask)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTask);

module.exports = router;
