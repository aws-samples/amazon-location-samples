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
                    }
              }
        )}
    }
}
