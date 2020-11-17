# The Amazon Location Service Tracking Sample

This sample demonstrates how to use `AWSLocationTracker` to start and stop location tracking.

## Using the Sample

1. The AWS Mobile SDK for iOS is available through [CocoaPods](http://cocoapods.org). If you have not installed CocoaPods, install CocoaPods:

		sudo gem install cocoapods
		pod setup

1. To install the AWS Mobile SDK for iOS, change the current directory to the one with your **Podfile** in it and run the following command:

		pod install

1. Create new AWS backend resources and pull the AWS services configuration into the app by running the following command:

		amplify init  # accept default options to get started
		amplify push  # create the configuration file

1. Add the required Cognito resource to your app's cloud-enabled backend using the following CLI command:

		amplify add auth
		? How do you want users to be able to sign in? `Username`
        ? Do you want to configure advanced settings? `No, I am done.`

1. Create the specified backend by running the following command:

		amplify push

1. Allow users access to Amazon Location Service
    1. Navigate to your Cognito Identity Pool by running the following command:
            
            amplify console auth
            ? Which console `Identity Pool`
    3. Enable access to unauthenticated identities
        1. From *Identity Pool*, choose *Edit Identity Pool*. Note down the name of your *Unauthenticated role*
        2. Open the drop down for `Unauthenticated Identities`, choose `Enable access to unauthenticated identities`, and then choose *Save*.
    4. Add permission to access Amazon Location Service
        1. Navigate to the AWS IAM Console, select *Roles*, and filter on the name of your unauthenticated role. For example, `amplify-<project_name>-<env_name>-<id>-unauthRole`. Select the role you would like to use.
        2. Choose *+Add inline policy*,* JSON*, make sure you replace [REGION] and [ACCOUNT_ID] with the region that Amazon Location Service is located in and your AWS account Id, when entering in the following content:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "UpdateDevicePositions",
            "Effect": "Allow",
            "Action": [
                "geo:BatchUpdateDevicePosition"
            ],
            "Resource": [
                "arn:aws:geo:[REGION]:[ACCOUNT_ID]:tracker/TrackerExample"
            ]
        }
    ]
}
```

1. In order to start tracking, create an Amazon Location Tracking resource to capture and store positions of your users. Create a tracker named `TrackerExample` through [Amazon Location Service console](https://console.aws.amazon.com/location/tracking/home).

1. Open `TrackingSample.xcworkspace`.

1. Click on `awsconfiguration.json` and add the `Location` section, replacing `[REGION]` with the region that your Amazon Location Service is located in:

```json
{
    "UserAgent": "aws-amplify/cli",
    "Version": "0.1.0",
    // ...
    "Location": {
        "Default": {
            "Region": "[REGION]"
        }
    }
}
```
1. Build and run the sample app.