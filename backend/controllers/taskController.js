const Task = require("../models/Task");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get all tasks for logged-in user (paginated, filtered, searched)
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query - always scope to current user
    const query = { user: req.user._id };
    if (status && status !== "") query.status = status;
    if (search && search.trim() !== "") {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(query),
    ]);

    sendSuccess(res, 200, "Tasks fetched", {
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return sendError(res, 404, "Task not found.");
    sendSuccess(res, 200, "Task fetched", { task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status: status || "todo",
    });
    sendSuccess(res, 201, "Task created successfully", { task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Find and verify ownership in one query
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!task) return sendError(res, 404, "Task not found.");
    sendSuccess(res, 200, "Task updated successfully", { task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return sendError(res, 404, "Task not found.");
    sendSuccess(res, 200, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
