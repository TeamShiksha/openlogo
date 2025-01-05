const ImageRepository = require("../repositories/Images");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

class ImageServices {
  constructor() {
    this.imageRepository = new ImageRepository();
    this.s3 = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Fetches image cloudfronturl based on company name
   * @param {string} company company name
   * @returns {string} - Image Cloudfront URL
   **/

  async fetchImageByCompanyFree(
    company,
    default_extension = "png",
    checkDb = true,
  ) {
    let domainName = company;
    if (checkDb) {
      const image = await this.imageRepository.fetchImage(company);
      if (!image) return null;
      domainName = image.company_name;
    }

    const imageUrl = `${default_extension}/${domainName}`;
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
    for (const company of companyList) {
      const signedUrl = await this.fetchImageByCompanyFree(
        company.company_name,
        undefined,
        false,
      );
      if (!signedUrl) continue;
      dataList.push({
        companyName: company.company_name.split(".")[0],
        image: signedUrl,
      });
    }
    return dataList;
  }

  async uploadToS3(file, imageName, extension) {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Body: file.buffer,
      Key: `${process.env.KEY}/${extension}/${imageName}`,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));
    return `${process.env.KEY}/${extension}/${imageName}`;
  }

  async createImageData(uploadedBy, imageSize, companyName, companyUri = " ") {
    const result = await this.imageRepository.create({
      user_id: uploadedBy,
      company_name: companyName,
      company_uri: companyUri,
      image_size: Number(imageSize),
    });
    return {
      _id: result._id,
      updatedAt: result.updated_at,
    };
  }

  async updateImageById(id, updateObj) {
    const updatingImage = await this.imageRepository.update(id, updateObj);
    return {
      _id: updatingImage._id,
      updatedAt: updatingImage.updatedAt,
    };
  }

  async getImagesByUserId(userId) {
    return await this.imageRepository.getAllImageByUserId(userId);
  }

  async getImageById(id) {
    return await this.imageRepository.getById(id);
  }
}

module.exports = ImageServices;
