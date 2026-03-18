const { body, query, param, validationResult } = require("express-validator");
const { sendError } = require("../utils/response");

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 422, "Validation failed", errors.array());
  }
  next();
};

// Auth validators
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 50 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  validate,
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// Task validators
const createTaskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }),
  body("description").optional().trim().isLength({ max: 500 }),
  body("status").optional().isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),
  validate,
];

const updateTaskValidation = [
  body("title").optional().trim().notEmpty().isLength({ max: 100 }),
  body("description").optional().trim().isLength({ max: 500 }),
  body("status").optional().isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),
  validate,
];

const taskQueryValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["todo", "in-progress", "done", ""]),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  createTaskValidation,
  updateTaskValidation,
  taskQueryValidation,
};
