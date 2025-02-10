## Openlogo
Openlogo is your partner in logo exploration. Our platform boasts a collection of APIs designed to simplify the process of obtaining company logos.

## Made with

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/mongodb-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=green)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

### Clone and run the project locally
   ```
   git clone https://github.com/TeamShiksha/openlogo.git
   cd openlogo
   pnpm install
   pnpm start
   ```

### Environment variables

Most of the environment variables can be used by copying them from the `.env.example` file. However, if you are trying to run the business APIs locally, you will need some additional environment variables associated with AWS.

### Get the AWS environment variables

- Create a stack using `cloudformation_dev_test.yml` file given inside `server/aws` directory.
- You can generate the private and public RSA key by following the instructions given [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html).
- After the stack creation is successful you can find most environmental variables under the `Output` section which are mentioned below:
   - `BUCKET_NAME`
   - `BUCKET_REGION`
   - `KEY`
   - `DISTRIBUTION_DOMAIN`
   - `CLOUD_FRONT_KEYPAIR_ID`
   - `ACCESS_KEY`
   - `SECRET_ACCESS_KEY`

    **NOTE**: These values will be comma seperated.

-----------------------------------------------------------------------------------------------------------------

<p align="center" style="text"><strong>If you liked something about this repository, do give it a 🌟.</strong></p>
