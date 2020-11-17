# Amplify Location Tracking Sample (Android)

[Amazon Location Service](https://aws.amazon.com/location) makes it easy for developers to add
location data to applications without sacrificing data security and user privacy. With Amazon
Location Service, you can easily add capabilities such as maps, points of interest, geocoding,
routing, geofences, and tracking to applications.

This sample application provides you with the following information:

* How to setup and configure your Android application with the Amazon Location Services SDK.
* How to add authentication to your application.
* How to use the location tracking functionality of Amazon Location Service.

For more info on the Amazon Location Service, see the [*Amazon Location Service Developer
Guide*](https://docs.aws.amazon.com/location/latest/developerguide/).

## Setting up your app to use Amazon Location Service

### Prerequisites

When using the Amazon Location Service with your Amplify Android application, your application
must target API level 16 or later.

### Installing dependencies

The following procedure defines how to install the necessary Amazon Location Service SDK
dependencies in your Amplify Android application.

**To install dependencies**:

1. In Android Studio, expand **Gradle Scripts** in the project viewer and open **build.gradle
   (Module: Tracking_Sample.app)**.

2. In the **dependencies** block, add the following lines:

    ```groovy
    implementation 'com.amazonaws:aws-android-sdk-mobile-client:2.19.+'
    implementation 'com.amazonaws:aws-android-sdk-location:2.19.+'
    ```

3. Click ***Sync Now*** in the notification bar above the file editor to update your project’s
   configuration.

You have now successfully added the Amazon Location Service SDK dependencies to your Amplify
Android app.

### Adding authentication to your App using the Amplify CLI

The Amplify Framework uses [Amazon Cognito](https://aws.amazon.com/cognito/) as its primary
authentication provider. Amazon Cognito is a robust user directory service that handles user
registration, authentication, account recovery, and other operations. Use the following procedure
to add authentication to your app using Amazon Cognito and Amplify CLI.

**To add authentication to your Amplify Android app**:

1. Open a terminal window in Android Studio by clicking ***Terminal***.

2. Install the Amplify CLI by running the following command:

    ```console
    npm install -g @aws-amplify/cli
    ```

3. Initialize Amplify by running the following command:

    ```console
    amplify init
    ```

4. Create a Cognito Identity Pool. It will be used to authenticate your app users and authorize
   their access to Amazon Location Service. To start provisioning authentication resources in the
   backend, go to your project directory and run the following command:

    ```console
    amplify add auth
    ```

5. When prompted, provide the following information:

    ```console
    ? Do you want to use the default authentication and security configuration? 
      `Default configuration` ? 
    How do you want users to be able to sign in? 
      `Username` ? 
    Do you want to configure advanced settings? 
      `No, I am done.`
    ```

6. Run the following command to push your changes to the cloud. When completed, the
   `awsconfiguration.json` file will be updated to reference your newly provisioned backend auth
   resources.

    ```console
    amplify push
    ```

7. Now that you have successfully created authentication for your Amplify Android app using
   Amazon Cognito, you must create an inline policy.This will give authenticated users of your
   application access to Amazon Location Service. Navigate to the root of your project and run
   the following command:

    ```console
    amplify console auth
    ```

8. Select **Identity Pool** from **Which console?** when prompted.

9. Click on **Edit identity pool**.

10. Open the drop down for **Unauthenticated identities**, choose **Enable access to
    unauthenticated identities**, and then choose **Save**.

11. Click on **Edit identity pool** once more. Make a note of the name of the Unauthenticated
    role. For example, `amplify-<project_name>-<env_name>-<id>-unauthRole`.

12. Click on **Service** and select **IAM**.

13. Select **Roles**, and filter on the name of your new role.

14. Click on the unauthRole you noted above.

15. Choose **Add inline policy**, then click on the **JSON** tab, and enter in the following
    content:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "geo:BatchUpdateDevicePosition"
                ],
                "Resource": "*"
            }
        ]
    }
    ```

16. Click on the **Review policy** button.

17. In the **Name** field, enter *LocationTracker*.

18. Click on the **Create policy** button.

You have now successfully added authentication to your Amplify Android app.

### Initializing the SDK

The following procedure details how to initialize `AWSMobileClient` and `AmazonLocationClient`.

1. Add the following code to initialize `AWSMobileClient` in your Activity's `onCreate` method:

    ```java
    AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
            @Override
            public void onResult(UserStateDetails userStateDetails) {
                Log.i("QuickStart", "onResult: " + userStateDetails.getUserState());
            }

            @Override
            public void onError(Exception e) {
                Log.e("QuickStart", "Initialization error: ", e);
            }
        }
    );
    ```

2. Open the file `res/raw/awsconfiguration.json` in your Project Explorer.

3. Add the `Location` section below replacing `[REGION]` with your AWS Region (e.g. `us-east-1`):

    ```javascript
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

## Tracking a User Location

### Creating a tracker resource

In order to start tracking, you create an Amazon Location Tracking resource to capture and store
positions of your users. You can create this resource through the [Amazon Location Service
console](https://console.aws.amazon.com/location/home):

### Sending user location data to your Amazon Location Service tracker resource

The below steps describe how you can get a user location and pass it to the tracker resource you
have created with Amazon Location Service:

1. Request location permissions from the user by following the instructions [on the Android
   developer site](https://developer.android.com/training/location/permissions).

2. Create a new Tracker instance:

    ```java
    AWSLocationTracker tracker;

    AWSMobileClient.getInstance().initialize(getApplicationContext(), new Callback<UserStateDetails>() {
      @Override
        public void onResult(UserStateDetails userStateDetails) {
            tracker = new AWSLocationTracker("tracker", AWSMobileClient.getInstance());
        }

        @Override
        public void onError(Exception e) {
            // Handle AWSMobileClient initialization error
        }
    });
    ```

3. Create Listener and Options objects to supply to `startTracking()` from an Android Activity
   class:

    ```java
    TrackingListener listener = new TrackingListener() {
        @Override
        public void onStop() {
            // Handle tracked stopped event
        }

        @Override
        public void onDataPublished(TrackingPublishedEvent trackingPublishedEvent) {
            // Handle a successful publishing event for a batch of locations.
        }

        @Override
        public void onDataPublicationError(TrackingError trackingError) {
            // Handle a failure to publish location data.
        }
    };

    TrackingOptions options = TrackingOptions
                .builder()
                .customDeviceId("customId")
                .emitLocationFrequency(5000L)
                .retrieveLocationFrequency(1000L)
                .build();
    ```

4. The tracker can now be started, stopped, and its status queried:

    ```java
    // Starts the tracker
    tracker.startTracking(this, options, listener);
    ```

    ```java
    // Returns true if the tracker is started
    boolean isStarted = tracker.isTracking();
    ```

    ```java
    // Stops the tracker
    tracker.stopTracking(this);
    ```
