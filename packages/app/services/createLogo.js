const CreateLogoRepository = require("../repositories/createLogo");

class CreateLogoService {
  constructor() {
    this.createLogoRepository = new CreateLogoRepository();
  }

  async addCreateLogoData(uploadedBy, companyUri, imageId) {
    const result = await this.createLogoRepository.create({
      user_id: uploadedBy,
      companyUrl: companyUri,
      images: imageId,
    });
    return {
      _id: result._id,
    };
  }
}

module.exports = CreateLogoService;
