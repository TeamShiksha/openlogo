const BaseRepository = require("./base");
const Image = require("../models/images");

const { cloudFrontSignedURL } = require("../utils/cloudFront");

/**
 * The ImageRepository extends BaseRepository to manage ContactUs model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Images model to the base repository for database interactions.
 *  Custom methods specific to Images can also be added as needed.
 */

class ImagesRepository extends BaseRepository {
  constructor() {
    super(Image);
  }

  /**
   * Fetches an image for a given company with a specified file extension.
   * @param {string} company - Name of the company.
   * @returns {Promise<Object|null>} - Image object if found, otherwise null.
   */
  async fetchImage(company) {
    const image = await Image.findOne({
      company_name: {
        $regex: `^${company}(\\.|$)`,
        $options: "i",
      },
    });
    return image;
  }

  /**
   * Fetches a list of companies matching a specified regex pattern.
   * @param {RegExp} regexPattern - Regular expression to match company names.
   * @returns {Promise<Array<Object>>} - Array of company objects matching the pattern returns an empty array if no matches are found.
   */
  async fetchCompanyList(regexPattern) {
    const companyList = await Image.find({
      company_name: { $regex: regexPattern },
    });
    return companyList;
  }

  /**
   * Generates a signed CloudFront URL for the given image URL.
   * @param {string} imageUrl - Path or identifier for the image.
   * @returns {Promise<string>} - Signed CloudFront URL.
   */
  async fetchCloudFrontURL(imageUrl) {
    const cloudFrontUrl = await cloudFrontSignedURL(`/${imageUrl}`).data;
    return cloudFrontUrl;
  }

  async getAllImageByUserId(userId, skip, limit) {
    const total = await this.model.countDocuments({ user_id: userId });
    const images = await this.model
      .find({ user_id: userId })
      .skip(skip)
      .limit(limit);

    return {
      data: images.map((image) => image.data()),
      total,
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = ImagesRepository;
