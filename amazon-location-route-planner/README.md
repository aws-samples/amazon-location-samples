# Amazon Location Route Planner

This sample app demonstrates Amazon Location Service's routing functionality in a web application. It finds the fastest route using a number of parameters such as different modes of transportation (car, truck, and walking), departure time, avoidances (ferries and tolls), and weight and size limitations for trucks. This sample app is built with Vue.js, MapLibre GL JS, and Tailwind CSS.

## Requirements

- Create an [AWS account](https://portal.aws.amazon.com/billing/signup).
- Install [Node.js](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/getting-started).

## Create resources

Click the button below to create the necessary AWS resources for this sample app to run. It will open the AWS Management Console and initiate the CloudFormation template deployment process.

[![Launch Stack](https://amazon-location-blog-assets.s3.us-west-2.amazonaws.com/cfn-launch-stack-button.svg)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?stackName=amazon-location-route-planner&templateURL=https://amazon-location-blog-assets.s3.us-west-2.amazonaws.com/amazon-location-route-planner/template.yml)

Once the deployment process is complete, go to the `Outputs` section to get the Cognito Identity Pool ID.

## Configure

Open `src/config.js` and use the CloudFormation stack outputs to enter your Cognito Identity Pool ID.

## Run

Install dependencies and run the application.

```
npm install
npm run dev
```

## Clean up

If you would like to remove all of the resources created in this walkthrough, delete the CloudFormation stack called `amazon-location-route-planner`.

## Get help

- Have a bug to report? [Open an issue](https://github.com/aws-samples/amazon-location-samples/issues/new). If possible, include details about your development environment, and an example that shows the issue.

- Have an example request? [Open an issue](https://github.com/aws-samples/amazon-location-samples/issues/new). Tell us what the example should do and why you want it.

## Contribute

See [CONTRIBUTING](../CONTRIBUTING.md) for more information.

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](../LICENSE) file.
