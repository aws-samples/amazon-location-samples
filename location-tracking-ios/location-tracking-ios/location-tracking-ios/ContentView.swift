//
//  ContentView.swift
//  location-tracking-ios
//
//  Created by Knoetzke, Justin on 2022-08-15.
//

import SwiftUI
import AmplifyMapLibreUI
import CoreLocation
import Mapbox
import Amplify
import AWSLocationGeoPlugin
import AWSLocationXCF
import AWSCognitoAuthPlugin

struct MapView: View {
    @State var coordinates = [CLLocationCoordinate2D]()
    @StateObject var viewModel = MapViewModel()
    @StateObject private var mapState = AMLMapViewState(
        zoomLevel: 8
    )

    var body: some View {
        ZStack(alignment: .top) {
            
            AMLMapView(mapState: mapState)
                .showUserLocation(true)
                .edgesIgnoringSafeArea(.all)
                .onReceive(mapState.$userLocation, perform: { location in
                // you're handed the location update here as a CLLocationCoordinate2D through `location`
                    if(location != nil) {
                         mapState.center = CLLocationCoordinate2D(latitude: location!.latitude, longitude: location!.longitude)
                         coordinates.append(CLLocationCoordinate2D(latitude: location!.latitude, longitude: location!.longitude))
                         let polyline = MGLPolyline(coordinates: coordinates, count: UInt(coordinates.count))
                         mapState.mapView?.addAnnotation(polyline)
                        
                        do {
                            // Retrieve AWSLocationGeoPlugin
                            let plugin = try Amplify.Geo.getPlugin(for: "awsLocationGeoPlugin")
                            guard let locationPlugin = plugin as? AWSLocationGeoPlugin else {
                                return
                            }

                            // Retrieve reference to AWSLocation
                            let awsLocation = locationPlugin.getEscapeHatch()

                            // Make Request
                            guard let request = AWSLocationBatchUpdateDevicePositionRequest()
                            else {
                                fatalError("Could not instantiate `AWSLocationBatchUpdateDevicePositionRequest()`")
                            }
                            request.trackerName = "jfk-track"
                            var arrayOfDevicePosition = [AWSLocationDevicePositionUpdate]()
                            let awsDevicePosition = toAWSLocationDevicePositionUpdate(deviceId: "SomeID", coordinates: mapState.center)
                            arrayOfDevicePosition.append(awsDevicePosition)
                            request.updates = arrayOfDevicePosition
                            
                            awsLocation.batchUpdateDevicePosition(request) { response, error in
                                
                                if let error = error {
                                    print("Error \(error)")
                                }
                            }
                        } catch {
                            print("Error occurred while fetching the escape hatch \(error)")
                        }
                        
                    }
              }
        )}
    }
    
    func toAWSLocationDevicePositionUpdate(deviceId: String, coordinates: CLLocationCoordinate2D ) -> AWSLocationDevicePositionUpdate {
           guard let positionUpdate = AWSLocationDevicePositionUpdate() else {
               fatalError("Could not instantiate `AWSLocationDevicePositionUpdate()`")
           }
           positionUpdate.deviceId = deviceId
           positionUpdate.position = [NSNumber(value: coordinates.longitude),
                                      NSNumber(value: coordinates.latitude)]
           positionUpdate.sampleTime = Date()

           return positionUpdate
       }
}
