/**
 * The BaseRepository serves as a generic repository that provides basic CRUD (Create, Read, Update, Delete) operations for interacting with database.
 * It encapsulates the common database operations for a specific model.
 * It allows to reuse these functionalities across different parts of the application.
 */

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async getById(id) {
    return await this.model.findById(id).select("-__v");
  }

  async getAll(page = 1, limit = 10, tab = "active") {
    const skip = (page - 1) * limit;
    let filter = {};
    if (tab === "active") {
      filter.status = "PENDING";
    } else if (tab === "archived") {
      filter.status = { $in: ["REJECTED", "RESOLVED", "COMPLETED"] };
    }
    const total = await this.model.countDocuments(filter);
    const data = await this.model.find(filter).skip(skip).limit(limit);
    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data);
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async mark_deleted(id) {
    return await this.model.findByIdAndUpdate(id, { isDeleted: true });
  }
}

module.exports = BaseRepository;
