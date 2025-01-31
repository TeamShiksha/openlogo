Open Logo

# INTRODUCTION
Open Logo is your partner in logo exploration. Our platform boasts a collection of APIs designed to simplify the process of obtaining company logos. Generate API keys and access logos in various sizes and formats, all while staying in control of your budget. Elevate your brand with Open Logo!

# How to run this project
1. Clone the repository:
   ```
   git clone https://github.com/TeamShiksha/logoexecutive.git
   ```
2. Navigate to the project directory:
   ```
   cd logoexecutive
   ```
3. Install dependencies:
   ```
   pnpm install
   ```
4. Start the project:
   ```
   pnpm start
   ```


How to set environment variables

JWT_SECRET=Your_JWT_SECRET    #Generate jwt token
CLIENT_URL=http://127.0.0.1:3000
CLIENT_PROXY_URL=http://127.0.0.1:5000
PORT=5000                  #Change according to your port
ACCESS_KEY=D75FHPL3LHUKV2SF3QR7Y4   
SECRET_ACCESS_KEY=n9qyBGN7R5k2pnBMYand4Ym8mLibrZkYgrYhPMM3
BUCKET_NAME=AWS_bucket_name               #Name of the bucket which you created
BUCKET_REGION=AWS_region                  #Name of Your Region
DISTRIBUTION_DOMAIN=https://hmzsbpcw4ex33jxeiage.cloudfront.net
CLOUD_FRONT_KEYPAIR_ID=Q8A4T7ZMUYRW3Z
CLOUD_FRONT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----RSA KEY FOR CLOUDFRONT=-----END RSA PRIVATE KEY-----    #STEPS TO GENERATE THIS IS AWS SETUP 
KEY=s3_bucket_folder_name_can_customise_as_per_your_likings  
MONGO_URL=mongodb://admin:password123@mongodb:27017/logoexecutive?authSource=admin
NODE_ENV=dev




# Steps to Upload CloudFormation Template and Set Up AWS Cloud

1. Ensure you have your own AWS account. If not, sign up [here](https://aws.amazon.com/free).

2. Download the `cft_dev_test_logoexecutive.yml` file from the following location:
   https://github.com/TeamShiksha/logoexecutive/tree/dev/server/templates

3. Generate public and private RSA keys for the CloudFormation template using the commands below in Git Bash:
   ```
   openssl genrsa -out private_key.pem 2048
   openssl rsa -pubout -in private_key.pem -out public_key.pem
   ```

4. Use the RSA private key in `private_key.pem` for `CLOUD_FRONT_PRIVATE_KEY` in the environmental variables.

5. Navigate to the [AWS CloudFormation service](https://ap-southeast-2.console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/getting-started).

![Close Icon](./../packages/ui/public/aws1.png)

6. Click on the "Create Stack" button.

![Close Icon](./../packages/ui/public/aws2.png)


7. On the Create Stack page, select "Upload a template file" and choose the `cft_dev_test_logoexecutive.yml` file downloaded earlier. Then, click "Next."
![Close Icon](./../packages/ui/public/aws3.png)

8. Specify the following stack details:
   - Provide a `Stack Name`.
   - Inside `CDNPathInS3`, type `assets`. You may choose other folder names for storing images.
   - Inside `EncodedRSAPublicKey`, paste the public key generated earlier.
   - Click "Next."
9. On the "Review" page:
   - Check the checkbox inside the "Capabilities" section.
   - Click "Submit." The stack will begin creating resources.
10. Wait until the stack creation status becomes "CREATE_COMPLETE."
11. Once complete, navigate to the "Output" section of the stack to retrieve the following environmental variables:
    - `BUCKET_NAME`
    - `BUCKET_REGION`
    - `KEY`
    - `DISTRIBUTION_DOMAIN`
    - `CLOUD_FRONT_KEYPAIR_ID`
    These values will be separated by commas (,).


12. Navigate to the "Resources" section of the stack and click on the `IAMUser` created. This redirects to the IAM console of the user.

13. In the IAM console, under the "Security credentials" section:
    - Scroll to "Keys" and click "Create access key."
    - Select "Other" under "Access key best practices & alternatives" and click "Next."

    - Provide a "Description tag value" and click "Create access key."
14. Retrieve the following environmental variables:
    - `ACCESS_KEY`
    - `SECRET_ACCESS_KEY`


You are now ready to use the Logo Executive platform!


