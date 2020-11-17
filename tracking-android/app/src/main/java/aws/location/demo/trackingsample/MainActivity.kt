package aws.location.demo.trackingsample

import android.Manifest
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import androidx.core.app.ActivityCompat
import com.amazonaws.mobile.client.AWSMobileClient
import com.amazonaws.mobile.client.Callback
import com.amazonaws.mobile.client.UserStateDetails
import com.amazonaws.mobileconnectors.geo.tracker.*
import com.google.android.material.snackbar.Snackbar
import java.util.concurrent.TimeUnit

class MainActivity : AppCompatActivity(), ActivityCompat.OnRequestPermissionsResultCallback {
    private val TAG = "TrackingSample"
    private val LOCATION_PERMISSION_CODE = 0
    private val loggingTrackingListener = LoggingTrackingListener()

    private lateinit var trackingOptions: TrackingOptions
    private lateinit var layout: View
    private lateinit var tracker: AWSLocationTracker

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Wire up UI events
        layout = findViewById(R.id.main_layout)
        val btnStart = findViewById<Button>(R.id.btnStart)
        val btnStop = findViewById<Button>(R.id.btnStop)
        btnStart.setOnClickListener(this::onStartStopClicked)
        btnStop.setOnClickListener(this::onStartStopClicked)

        // Initialize AWS Mobile SDK
        init()
    }

    /**
     * Initializes AWS Mobile Client and sets up an instance of
     * the AWSLocationTracker class.
     */
    private fun init() {
        trackingOptions = TrackingOptions.builder()
            .retrieveLocationFrequency(TimeUnit.SECONDS.toMillis(30))
            .emitLocationFrequency(TimeUnit.MINUTES.toMillis(5))
            .customDeviceId(getString(R.string.tracker_name))
            .build()

        // Credential initialization
        AWSMobileClient.getInstance().initialize(applicationContext, object : Callback<UserStateDetails?> {
            override fun onResult(userStateDetails: UserStateDetails?) {
                // Create an instance of the AWSLocationTracker using the AWSMobileClient as the
                // credential provider. Be sure to create your tracker via the Amazon Location Service
                // console and update the tracker_name resource value in app/src/main/res/values/strings.xml
                tracker = AWSLocationTracker(getString(R.string.tracker_name), AWSMobileClient.getInstance())
                Log.i(TAG, "Tracker initialized")
            }

            override fun onError(e: Exception?) {
                // Be sure to follow the instructions in the README.md file for this sample app
                // to configure authentication.
                Log.e(TAG, "Error initializing the AWS mobile client.")
            }
        })
    }

    fun onStartStopClicked(buttonClicked: View) {
        if (buttonClicked.id.equals(R.id.btnStart)) {
            // When the start button is clicked, call the function that will check
            // permissions and start the tracker.
            requestLocationPermission()
        } else {
            // Stop tracking device location.
            tracker.stopTracking(applicationContext)
        }
    }

    /**
     * Callback function that is invoked as a result of the user
     * granting or denying the necessary permissions.
     */
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        if (requestCode == LOCATION_PERMISSION_CODE) {
            if (grantResults.size == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                tracker.startTracking(applicationContext, trackingOptions, loggingTrackingListener)
            } else {
                Snackbar.make(layout, "Location permission denied", Snackbar.LENGTH_LONG).show()
            }
        }
    }

    /**
     * Request the necessary permissions (if not already granted) to consume
     * device location data.
     */
    private fun requestLocationPermission() {
        // Permission has not been granted and must be requested.
        if (applicationContext?.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Log.i(TAG, "Permissions not available.")
            if (shouldShowRequestPermissionRationale(Manifest.permission.ACCESS_FINE_LOCATION)) {
                // Provide an additional rationale to the user if the permission was not granted
                // and the user would benefit from additional context for the use of the permission.
                // Display a SnackBar with a button to request the missing permission.
                val snackbar = Snackbar.make(layout, R.string.request_location_permission, Snackbar.LENGTH_LONG)
                snackbar.setAction(R.string.request_location_permission) {
                    requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), LOCATION_PERMISSION_CODE)
                }
                snackbar.show()
            } else {
                // Request the permission. The result will be received in onRequestPermissionsResult().
                requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), LOCATION_PERMISSION_CODE)
            }
        } else {
            Log.i(TAG, "Starting location tracker.")
            try {
                tracker.startTracking(applicationContext, trackingOptions, loggingTrackingListener)
            } catch(ex: RuntimeException) {
                Snackbar.make(layout, StringBuilder(ex.message), Snackbar.LENGTH_LONG).also {
                    it.show()
                }
            }

        }
    }

    /**
     * Simple implementation of the TrackingListener interface that
     * just logs the events received.
     */
    class LoggingTrackingListener : TrackingListener {
        val TAG = "LoggingLocationListener"
        override fun onStop() {
            Log.i(TAG, "onStop")
        }

        override fun onDataPublished(event: TrackingPublishedEvent?) {
            Log.i(TAG, "onDataPublished Request = ${event?.request}")
            Log.i(TAG, "onDataPublished Response = ${event?.result}")

        }

        override fun onDataPublicationError(error: TrackingError?) {
            Log.e(TAG, "onDataPublicationError ${error?.message}", error )
        }
    }
}