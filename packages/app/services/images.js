const { ImagesRepository } = require("../repositories");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

class ImageServices {
  constructor() {
    this.imageRepository = new ImagesRepository();
    this.s3 = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
    this.s3BucketKey = process.env.BUCKET_KEY;
  }

  /**
   * Fetches image cloudfronturl based on company name
   * @param {string} company company name
   * @returns {string} - Image Cloudfront URL
   **/

  async fetchImageByCompanyFree(
    company,
    default_extension = "png",
    checkDb = true
  ) {
    let domainName = company.company_name;
    if (checkDb) {
      const image = await this.imageRepository.fetchImage(domainName);
      if (!image) return null;
      domainName = image.company_name;
    }

    const version = new Date(company.updated_at).getTime();
    const imageUrl = `${this.s3BucketKey}/${default_extension}/${domainName}?v=${version}`;
    const cloudFrontUrl =
      await this.imageRepository.fetchCloudFrontURL(imageUrl);
    return cloudFrontUrl;
  }

  /**
   *  Fetches a list of companies matching a given regex pattern.
   * @param {string} regexPattern The regex pattern to match company names.
   * @returns {Promise<Object>} - List of matching companies.
   **/
  async fetchCompanyList(regexPattern) {
    const companyList =
      await this.imageRepository.fetchCompanyList(regexPattern);
    return companyList;
  }

  /**
   * Retrieves a list of companies with their signed image URLs.
   * @param {Array<Object>} companyList - List of companies with their domain names.
   * @returns {Promise<Array<Object>>} - List of objects containing company names and their signed image URLs.
   **/
  async getDataList(companyList) {
    const dataList = [];
    const results = await Promise.allSettled(
      companyList.map(async (company) => {
        const signedUrl = await this.fetchImageByCompanyFree(
          company,
          company?.extension,
          false
        );
        return { company, signedUrl };
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.signedUrl) {
        const { company, signedUrl } = result.value;
        dataList.push({
          companyName: company.company_name.split(".")[0],
          image: signedUrl,
        });
      }
    }

    return dataList;
  }

  async uploadToS3(file, imageName, extension) {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Body: file.buffer,
      Key: `${this.s3BucketKey}/${extension}/${imageName}`,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
    return `${this.s3BucketKey}/${extension}/${imageName}`;
  }

  async createImageData(
    uploadedBy,
    imageSize,
    companyName,
    companyUri,
    Extension
  ) {
    const result = await this.imageRepository.create({
      user_id: uploadedBy,
      company_name: companyName,
      company_uri: companyUri,
      image_size: Number(imageSize),
      extension: Extension,
    });
    return {
      _id: result._id,
      updatedAt: result.updated_at,
    };
  }

  /**
   * Updates an image document by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the image to update.
   * @param {Object} updateObj - The fields and values to update in the image document.
   * @returns {Promise<Object>} The updated image document.
   * @throws {Error} If the update operation fails.
   */
  async updateImageById(id, updateObj) {
    const updatingImage = await this.imageRepository.update(id, {
      user_id: updateObj.uploadedBy,
      image_size: Number(updateObj.imageSize),
      extension: updateObj.Extension,
      updated_at: updateObj.updatedAt,
    });
    return {
      _id: updatingImage._id,
      updatedAt: updatingImage.updatedAt,
    };
  }

  /**
   * Retrieves a paginated list of images for a specific user.
   *
   * @async
   * @param {string} userId - The unique identifier of the user whose images are to be retrieved.
   * @param {number} skip - The number of images to skip (for pagination).
   * @param {number} limit - The maximum number of images to return.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of image documents.
   * @throws {Error} If the retrieval operation fails.
   */
  async getImagesByUserId(userId, skip, limit) {
    return await this.imageRepository.getAllImageByUserId(userId, skip, limit);
  }

  async getImageById(id) {
    return await this.imageRepository.getById(id);
  }

  async getImageByCompanyName(companyName) {
    return await this.imageRepository.fetchImage(companyName);
  }
}

module.exports = ImageServices;
