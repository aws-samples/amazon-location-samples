# MapLibre Native for iOS

## Adding authentication to your App using Amplify CLI

1. Initialize a new Amplify project by running the following command from the root directory of your app:

    ```bash
    amplify init
    ```

1. Create a Cognito Identity Pool. It will be used to authenticate your app users and authorize their access to Amazon Location Service. To start provisioning authentication resources in the backend, go to your project directory and run the following command:

    ```bash
    amplify add auth
    ```

1. When prompted, provide the following information:

    ```console
    ? Do you want to use the default authentication and security configuration? 
      `Default configuration`
    ? How do you want users to be able to sign in? 
      `Username`
    ? Do you want to configure advanced settings? 
      `No, I am done.`
    ```

1. Run the following command to push your changes to the cloud. When completed, the `awsconfiguration.json` file will be updated to reference your newly provisioned backend auth resources.

    ```bash
    amplify push
    ```

##
2. `amplify init`

3. `amplify add auth`

```
 ? Do you want to use the default authentication and security configuration? 
   `Default configuration`
 ? How do you want users to be able to sign in? 
   `Username`
 ? Do you want to configure advanced settings? 
   `No, I am done.`
```

4. `amplify push`


## Using Amazon Location Service Map APIs

1. Open the Amazon Location Service console (https://console.aws.amazon.com/location/maps/home#/create) to create a place index.
1. Enter **ExampleMap** in **Name**.
1. Press **Create map**


1. Note the Amazon Resource Name (ARN) of your map. This will start with *arn:aws:geo* 

## Allow Guest users access to the map

Now that you have created a map resource, you must create an inline policy to give users of your application access to the resource:

1. Navigate to the root of your project and run the following command:

    ```bash
    amplify console auth
    ```

1. Select **Identity Pool** from **Which console?** when prompted.
1. You will be navigated to the Amazon Cognito console. Click on **Edit identity pool** in the top right corner of the page.
1. Open the drop down for **Unauthenticated identities**, choose **Enable access to unauthenticated identities**, and then press **Save Changes**.
1. Click on **Edit identity pool** once more. Make a note of the name of the Unauthenticated role. For example, `amplify-<project_name>-<env_name>-<id>-unauthRole`.
1. Open the [AWS Identity and Access Management (IAM) console](https://console.aws.amazon.com/iam/home#/roles) to manage roles.
1. In the **Search** field, enter the name of your unauthRole noted above and click on it.
1. Click **+Add inline policy**, then click on the **JSON** tab.
1. Fill in the **[ARN]** placeholder with the ARN of your tracker which you noted above and replace the contents of the policy with the below.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "MapsReadOnly",
                "Effect": "Allow",
                "Action": [
                    "geo:GetMapStyleDescriptor",
                    "geo:GetMapGlyphs",
                    "geo:GetMapSprites",
                    "geo:GetMapTile"
                ],
                "Resource": "[ARN]"
            }
        ]
    }
    ```
1. Click on the **Review policy** button.
1. In the **Name** field, enter **LocationMap**.
1. Click on the **Create policy** button.  

You have now successfully added authentication to your iOS app.

## Building the application

1. Download and install the dependencies:
    ```
    pod install
    ```

2. Open the Xcode workspace 
    ```
    xed .
    ```

3. Select the `awsconfiguration.json` generated from Amplify CLI, it should be at the top level of your project where you ran `amplify init`
```
"CredentialsProvider": {
    "CognitoIdentity": {
        "Default": {
            "PoolId": "[IdentityPoolId]",
            "Region": "[AWSRegion]"
        }
    }
},
```

4. Select `Info.plist` and update the values to your resources
- AWSRegion - the region from above
- IdentityPoolId - the poolId from above
- MapName - `ExampleMap`
- MGLMapboxMetricsEnabled - NO (Boolean)
- MGLMapboxMetricsEnabledSettingShownInApp - NO (Boolean)

5. Build (CMD+B) and Run (CMR+R) your app. You should see a map view
