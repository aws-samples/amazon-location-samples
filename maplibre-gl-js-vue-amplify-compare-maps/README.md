# Amazon Location Service Map Comparison
![](./image/README.png)

* This is a web based sample built with Vue that uses AWS Amplify Geo to display two maps side by side.
* Amazon Location Service offers several map styles from several providers, and this sample will help you compare them. Because the two maps are synchronized and can be compared under the same circumstances.
* The AWS resources (Amazon Cognito & Amazon Location Service Maps) are created via Amplify CLI. The sample already comes with predefined configurations that you only have to deploy using the Amplify CLI.

## Execution environment
* node v16.x
* npm 8.x
* Amplify CLI 9.1.0

## Getting started
1. Clone the repository: `git clone https://github.com/aws-samples/amazon-location-samples.git`
1. Go this folder: `cd amazon-location-samples/maplibre-gl-js-vue-amplify-compare-maps`
1. Install Amplify CLI: `npm install -g @aws-amplify/cli`
1. Install project dependencies: `npm install`
1. Create a new Amplify project environment: `amplify init`
    
    1. Enter a name for the project (dev):`dev` 
    1. Choose your default editor: `Visual Studio Code`
    1. Select the authentication method you want to use: `AWS Profile`
    1. Create IAM User and set credentials (See [here](https://docs.amplify.aws/cli/start/install/#option-2-follow-the-instructions) for more details.)
1. Create Auth and Geo resources: `amplify push`

## Compiles and hot-reloads for development
```
npm run dev
```

## Compiles and minifies for production
```
npm run build
```

## Cleaning up
```
amplify delete
```

## Security
See [CONTRIBUTING](https://github.com/aws-samples/amazon-location-samples/blob/main/CONTRIBUTING.md) for more information.

## License
This library is licensed under the MIT-0 License. See the LICENSE file.