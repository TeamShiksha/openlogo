const { STATUS_CODES } = require("http");
const MilestoneConfigService = require("../services/milestoneConfig");

/**
 * GET /api/admin/milestones
 * List all non-deleted configs, active first
 */
async function listMilestoneConfigsController(req, res, next) {
  try {
    const service = new MilestoneConfigService();
    const configs = await service.getAllConfigs();

    return res.status(200).json({
      statusCode: 200,
      data: configs,
      count: configs.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/milestones/:id
 * Get a single config by id
 */
async function getMilestoneConfigController(req, res, next) {
  try {
    const service = new MilestoneConfigService();
    const config = await service.getConfigById(req.params.id);

    if (!config) {
      return res.status(404).json({
        statusCode: 404,
        message: "MilestoneConfig not found",
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: config,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/milestones
 * Create a new config (inactive by default)
 * Body: { name, thresholds: [{ at, points }] }
 */
async function createMilestoneConfigController(req, res, next) {
  try {
    const { name, thresholds } = req.body;
    const adminId = req.userData?.userId;

    if (!name) {
      return res.status(422).json({
        statusCode: 422,
        message: "name is required",
        error: STATUS_CODES[422],
      });
    }

    if (!thresholds || !Array.isArray(thresholds) || thresholds.length === 0) {
      return res.status(422).json({
        statusCode: 422,
        message: "thresholds must be a non-empty array",
        error: STATUS_CODES[422],
      });
    }

    const hasInvalidThreshold = thresholds.some(
      (t) =>
        typeof t.at !== "number" ||
        t.at < 1 ||
        typeof t.points !== "number" ||
        t.points < 1
    );
    if (hasInvalidThreshold) {
      return res.status(422).json({
        statusCode: 422,
        message:
          'Each threshold must have positive numeric "at" and "points" values',
        error: STATUS_CODES[422],
      });
    }

    const service = new MilestoneConfigService();
    const config = await service.createConfig({ name, thresholds }, adminId);

    return res.status(201).json({
      statusCode: 201,
      message: "MilestoneConfig created successfully",
      data: config,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/milestones/:id/activate
 * Deactivate all others and activate this config
 */
async function activateMilestoneConfigController(req, res, next) {
  try {
    const service = new MilestoneConfigService();
    const config = await service.activateConfig(req.params.id);

    return res.status(200).json({
      statusCode: 200,
      message:
        "MilestoneConfig activated — takes effect on the next worker run",
      data: config,
    });
  } catch (error) {
    if (error.message === "MilestoneConfig not found") {
      return res.status(404).json({
        statusCode: 404,
        message: error.message,
        error: STATUS_CODES[404],
      });
    }

    if (error.message === "Config is already active") {
      return res.status(409).json({
        statusCode: 409,
        message: error.message,
        error: STATUS_CODES[409],
      });
    }

    next(error);
  }
}

/**
 * PATCH /api/admin/milestones/:id
 * Edit an inactive config (active configs are read-only)
 * Body: { name?, thresholds? }
 */
async function updateMilestoneConfigController(req, res, next) {
  try {
    const { name, thresholds } = req.body;

    if (name === undefined && thresholds === undefined) {
      return res.status(422).json({
        statusCode: 422,
        message: "At least one of name or thresholds must be provided",
        error: STATUS_CODES[422],
      });
    }

    if (thresholds !== undefined) {
      if (!Array.isArray(thresholds) || thresholds.length === 0) {
        return res.status(422).json({
          statusCode: 422,
          message: "thresholds must be a non-empty array",
          error: STATUS_CODES[422],
        });
      }

      const hasInvalidThreshold = thresholds.some(
        (t) =>
          typeof t.at !== "number" ||
          t.at < 1 ||
          typeof t.points !== "number" ||
          t.points < 1
      );
      if (hasInvalidThreshold) {
        return res.status(422).json({
          statusCode: 422,
          message:
            'Each threshold must have positive numeric "at" and "points" values',
          error: STATUS_CODES[422],
        });
      }
    }

    const service = new MilestoneConfigService();
    const config = await service.updateConfig(req.params.id, {
      name,
      thresholds,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "MilestoneConfig updated successfully",
      data: config,
    });
  } catch (error) {
    if (error.message === "MilestoneConfig not found") {
      return res.status(404).json({
        statusCode: 404,
        message: error.message,
        error: STATUS_CODES[404],
      });
    }

    if (error.message.startsWith("Cannot edit an active config")) {
      return res.status(409).json({
        statusCode: 409,
        message: error.message,
        error: STATUS_CODES[409],
      });
    }

    next(error);
  }
}

/**
 * DELETE /api/admin/milestones/:id
 * Soft-delete an inactive config
 */
async function deleteMilestoneConfigController(req, res, next) {
  try {
    const service = new MilestoneConfigService();
    const config = await service.deleteConfig(req.params.id);

    return res.status(200).json({
      statusCode: 200,
      message: "MilestoneConfig deleted successfully",
      data: config,
    });
  } catch (error) {
    if (error.message === "MilestoneConfig not found") {
      return res.status(404).json({
        statusCode: 404,
        message: error.message,
        error: STATUS_CODES[404],
      });
    }

    if (error.message.startsWith("Cannot delete an active config")) {
      return res.status(409).json({
        statusCode: 409,
        message: error.message,
        error: STATUS_CODES[409],
      });
    }

    next(error);
  }
}

module.exports = {
  listMilestoneConfigsController,
  getMilestoneConfigController,
  createMilestoneConfigController,
  activateMilestoneConfigController,
  updateMilestoneConfigController,
  deleteMilestoneConfigController,
};
