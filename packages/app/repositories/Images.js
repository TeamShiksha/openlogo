const BaseRepository = require("./base");
const Image = require("../models/Images");

// not yet there in monorepo
// const { cloudFrontSignedURL } = require("../utils/cloudFront");

/**
 * The ImageRepository extends BaseRepository to manage ContactUs model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Images model to the base repository for database interactions.
 *  Custom methods specific to Images can also be added as needed.
 */

class ImagesRepository extends BaseRepository {
  constructor() {
    super(Image);
  }

  async fetchImage(company, default_extension = "png") {
      const image = await Image.findOne({
        company_name: company,
        extension: default_extension,
      });

      return image;
  }
  
  async fetchCompanyList(regexPattern) {
    const companyList = await Image.find({
      company_name: { $regex: regexPattern },
    });
    return companyList;
  }

  async fetchCloudFrontURL(imageUrl) {
    const cloudFrontUrl = cloudFrontSignedURL(`/${imageUrl}`).data;
    return cloudFrontUrl;
  }
}

module.exports = ImagesRepository;
