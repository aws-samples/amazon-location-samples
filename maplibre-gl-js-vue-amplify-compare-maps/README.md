# Amazon Location Map Comparison
![](./image/demo.gif)

This sample is used to compare maps provided by Amazon Location.
## Execution environment
* node v16.x
* npm 8.x

## Getting started
1. Install Amplify CLI: `npm install -g @aws-amplify/cli`
1. Install project dependencies: `npm install`
1. Create a new Amplify project environment: `amplify init`
    
    1. Enter a name for the project (dev):`dev` 
    1. Choose your default editor: `Visual Studio Code`
    1. Select the authentication method you want to use: `AWS Profile`
    1. Create IAM User and set credentials (See [here](https://docs.amplify.aws/cli/start/install/#option-2-follow-the-instructions) for more details.)
1. Create Auth and Geo resources: `amplify push`

## Compiles for development
```
amplify serve
```

## Cleaning up
```
amplify delete
```

## Security
See [CONTRIBUTING](https://github.com/aws-samples/amazon-location-samples/blob/main/CONTRIBUTING.md) for more information.

## License
This library is licensed under the MIT-0 License. See the LICENSE file.
