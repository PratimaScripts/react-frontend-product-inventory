# React Product Inventory App

This is a React.js frontend application for managing product inventory. It interacts with a Node.js Express API hosted on AWS Elastic Beanstalk, which in turn communicates with a DynamoDB database.

## Features

- View a list of products
- Add new products
- Update existing products
- Delete products

## Technologies Used

- React.js
- Axios for HTTP requests
- Bootstrap for styling

## How to Use

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.
4. Access the application in your web browser at `http://localhost:3000`.

## Deployment

To deploy this application, follow these steps:

1. Build the React app using `npm run build`.
2. Upload the build files to an S3 bucket.
3. Configure a CloudFront distribution to serve the files from the S3 bucket.
4. Update the API base URL in the React app to point to your Node.js Express API hosted on Elastic Beanstalk.
5. Access the deployed application using the CloudFront distribution URL.
