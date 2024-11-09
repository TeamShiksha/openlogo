const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Images = require("../models/Images");
const { cloudFrontSignedURL } = require("../utils/cloudFront");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

class ImagesService {
  async uploadToS3(file, imageName, extension) {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Body: file.buffer,
      Key: `${process.env.KEY}/${extension}/${imageName}`,
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      return `${process.env.KEY}/${extension}/${imageName}`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async fetchImageByCompanyFree(
    company,
    default_extension = "png",
    checkDb = true
  ) {
    try {
      let domainName = company;

      if (checkDb) {
        const image = await Images.findOne({
          domainame: company,
          extension: default_extension,
        });
        if (!image) return null;
        domainName = image.domainame;
      }

      const imageUrl = `${default_extension}/${domainName}.${default_extension}`;
      const cloudFrontUrl = cloudFrontSignedURL(`/${imageUrl}`).data;
      return cloudFrontUrl;
    } catch (err) {
      throw err;
    }
  }

  async getImagesByUserId(userId) {
    try {
      const images = await Images.find({ uploadedBy: userId });
      if (!images.length) return null;

      return images.map((image) => ({
        domainame: image.domainame,
        _id: image._id,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      }));
    } catch (error) {
      throw error;
    }
  }

  async createImageData(domainame, uploadedBy, extension) {
    try {
      const newImage = {
        domainame,
        uploadedBy,
        extension,
      };
      const result = new Images(newImage);
      await result.save();
      return {
        _id: result._id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    } catch (error) {
      console.error(`Failed to create image data: ${error}`);
      throw error;
    }
  }

  async updateImageById(id, updateObj) {
    try {
      const updatingImage = await Images.findByIdAndUpdate(id, updateObj, {
        new: true,
      });
      return {
        _id: updatingImage._id,
        createdAt: updatingImage.createdAt,
        updatedAt: updatingImage.updatedAt,
      };
    } catch (error) {
      console.error(`Failed to update image data: ${error}`);
      throw error;
    }
  }

  // New method to fetch image list by company name prefix
  async fetchImageListByCompanyName(companyList) {
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

module.exports = new ImagesService();
