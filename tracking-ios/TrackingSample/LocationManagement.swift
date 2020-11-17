// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import CoreLocation
import AWSLocation
import AWSMobileClient

class LocationManagement: NSObject,
                          ObservableObject,
                          CLLocationManagerDelegate,
                          AWSLocationTrackerDelegate {
    func requestLocation() {
        locationManager.requestLocation()
    }
    
    let locationManager = CLLocationManager()
    let locationTracker = AWSLocationTracker(trackerName: "TrackerExample",
                                             region: AWSRegionType.[REGION],
                                             credentialsProvider: AWSMobileClient.default())
    override init() {
        super.init()
        requestUserLocation()
    }
    
    func requestUserLocation() {
        // Set delegate before requesting for authorization
        locationManager.delegate = self
        // You can request for `WhenInUse` or `Always` depending on your use case
        locationManager.requestWhenInUseAuthorization()
    }
    
    func onTrackingEvent(event: TrackingListener) {
        switch event {
        case .onDataPublished(let trackingPublishedEvent):
            print("onDataPublished: \(trackingPublishedEvent)")
        case .onDataPublicationError(let error):
            switch error.errorType {
            case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                print("onDataPublicationError \(error)")
            case .serviceError(let serviceError):
                print("onDataPublicationError serviceError: \(serviceError)")
            }
        case .onStop:
            print("tracker stopped")
        }
    }
    
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse:
            print("Received authorization of user location, requesting for location")
            locationManager.requestLocation()
            print("Received authorization of user location, requesting for location")
            locationManager.requestLocation()
            let result = locationTracker.startTracking(
                delegate: self,
                options: TrackerOptions(
                    customDeviceId: "12345",
                    retrieveLocationFrequency: TimeInterval(5),
                    emitLocationFrequency: TimeInterval(20)),
                listener: onTrackingEvent)
            switch result {
            case .success:
                print("Tracking started successfully")
            case .failure(let trackingError):
                switch trackingError.errorType {
                case .invalidTrackerName, .trackerAlreadyStarted, .unauthorized:
                    print("onFailedToStart \(trackingError)")
                case .serviceError(let serviceError):
                    print("onFailedToStart serviceError: \(serviceError)")
                }
            }
        default:
            print("Failed to authorize")
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("Got locations: \(locations)")
        locationTracker.interceptLocationsRetrieved(locations)
    }
    
    // Error handling is required as part of developing using CLLocation
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if let clErr = error as? CLError {
            switch clErr {
            case CLError.locationUnknown:
                print("location unknown")
            case CLError.denied:
                print("denied")
            default:
                print("other Core Location error")
            }
        } else {
            print("other error:", error.localizedDescription)
        }
    }
}
