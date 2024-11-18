const cloudfrontSigner = require("@aws-sdk/cloudfront-signer");
const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront"); // CommonJS import

const getSignedUrl = cloudfrontSigner.getSignedUrl;

function cloudFrontSignedURL(path) {
  const distributionDomain = process.env.DISTRIBUTION_DOMAIN;
  if (path !== "") {
    return {
      data: getSignedUrl({
        url: `${distributionDomain}${path}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 5),
        privateKey: process.env.CLOUD_FRONT_PRIVATE_KEY.replace(/\\n/gm, "\n"),
        keyPairId: process.env.CLOUD_FRONT_KEYPAIR_ID,
      }),
      success: true,
    };
  }
  return {
    message: "image path is not defined",
    success: false,
  };
}

// Function to invalidate CloudFront cache
const config = {
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
};
const client = new CloudFrontClient(config); // Initialize CloudFront Client

async function cloudFrontInvalidate(paths) {
  const distributionId = process.env.DISTRIBUTION_ID; // Ensure DISTRIBUTION_ID is set in your environment
  try {
    // Create Invalidation Command Input
    const input = {
      DistributionId: distributionId,
      InvalidationBatch: {
        Paths: {
          Quantity: paths.length,
          Items: paths, // Array of paths to invalidate, e.g., ["/images/logo.png"]
        },
        CallerReference: Date.now().toString(), // Unique ID for the invalidation request
      },
    };

    // Create and Send Invalidation Command
    const command = new CreateInvalidationCommand(input);
    const response = await client.send(command);

    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = { cloudFrontSignedURL, cloudFrontInvalidate };
