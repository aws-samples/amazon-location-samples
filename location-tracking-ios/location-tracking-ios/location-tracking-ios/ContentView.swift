//
//  ContentView.swift
//  location-tracking-ios
//
//  Created by Knoetzke, Justin on 2022-08-15.
//

import SwiftUI
import AmplifyMapLibreUI
import CoreLocation

 
struct MapView: View {
    @StateObject var viewModel = MapViewModel()
    @StateObject private var mapState = AMLMapViewState(
        zoomLevel: 8,
        center: CLLocationCoordinate2D(latitude: 39.7392, longitude: -104.9903)
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
                    }
                    
              }
        )}
    }
}
