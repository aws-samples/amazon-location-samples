//
//  ContentView.swift
//  location-tracking-ios
//
//  Created by Knoetzke, Justin on 2022-08-15.
//

import SwiftUI
import AmplifyMapLibreUI
 
struct MapView: View {
    @StateObject var viewModel = MapViewModel()
    @StateObject var mapState = AMLMapViewState() // initialize with whatever inputs you need

    var body: some View {
        ZStack(alignment: .top) {
            AMLMapView(mapState: mapState)
                .showUserLocation(true)
                .edgesIgnoringSafeArea(.all)
                .onReceive(mapState.$userLocation, perform: { location in
                // you're handed the location update here as a CLLocationCoordinate2D through `location`
              }
        )}
    }
}
