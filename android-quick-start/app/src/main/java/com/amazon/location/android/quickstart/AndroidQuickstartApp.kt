package com.amazon.location.android.quickstart

import android.app.Application
import android.util.Log
import com.amplifyframework.AmplifyException
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.geo.location.AWSLocationGeoPlugin

class AndroidQuickstartApp : Application() {
    override fun onCreate() {
        super.onCreate()

        try {
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.addPlugin(AWSLocationGeoPlugin())
            Amplify.configure(applicationContext)
            Log.i("AndroidQuickStart", "Initialized Amplify")
        } catch (error: AmplifyException) {
            Log.e("AndroidQuickStart", "Could not initialize Amplify", error)
        }
    }
}
