const ImageRepository = require("../repositories/Images");

class ImageServices {
  constructor() {
    this.imageRepository = new ImageRepository();
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
    let domainName = company;
    if (checkDb) {
      const image = await this.imageRepository.fetchImage(company);
      if (!image) return null;
      domainName = image.domainame;
    }

    const imageUrl = `${default_extension}/${domainName}.${default_extension}`;
    const cloudFrontUrl = await this.imageRepository.fetchCloudFrontURL(imageUrl);
    return cloudFrontUrl;
  }

  /**
   *  Fetches a list of companies matching a given regex pattern.
   * @param {string} regexPattern The regex pattern to match company names.
   * @returns {Promise<Object>} - List of matching companies.
   **/
  async fetchCompanyList(regexPattern) {
    const companyList = await this.imageRepository.fetchCompanyList(regexPattern);
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
        company.domainame,
        undefined,
        false
      );
      if (!signedUrl) continue;
      dataList.push({
        companyName: company.domainame,
        image: signedUrl,
      });
    }
    return dataList;
  }
}

module.exports = ImageServices;
