// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import AWSCore
import Mapbox
import SwiftUI


func configureMapLibre() {
    // Fix for https://github.com/aws-samples/amazon-location-samples/issues/31
    var protocolClasses = [AnyClass]()
    protocolClasses.append(MapLibreSigV4RequestInterceptor.self)

    let configuration = URLSessionConfiguration.default
    configuration.protocolClasses = protocolClasses
    
    MGLNetworkConfiguration.sharedManager.sessionConfiguration = configuration
}

struct MapView: UIViewRepresentable {
    @Binding var attribution: String

    private let mapView: MGLMapView

    init(attribution: Binding<String>) {
        let regionName = Bundle.main.object(forInfoDictionaryKey: "AWSRegion") as! String
        let mapName = Bundle.main.object(forInfoDictionaryKey: "MapName") as! String
        configureMapLibre()
        
        mapView = MGLMapView(
            frame: .zero,
            styleURL: URL(string: "https://maps.geo.\(regionName).amazonaws.com/maps/v0/maps/\(mapName)/style-descriptor"))

        _attribution = attribution
    }

    // MARK: - UIViewRepresentable protocol

    func makeCoordinator() -> Coordinator {
        Coordinator($attribution)
    }

    func makeUIView(context: UIViewRepresentableContext<MapView>) -> MGLMapView {
        mapView.delegate = context.coordinator

        mapView.logoView.isHidden = true
        mapView.attributionButton.isHidden = true
        return mapView
    }

    func updateUIView(_ uiView: MGLMapView, context: UIViewRepresentableContext<MapView>) {
    }

    // MARK: - MGLMapViewDelegate

    class Coordinator: NSObject, MGLMapViewDelegate {
        var attribution: Binding<String>

        init(_ attribution: Binding<String>) {
            self.attribution = attribution
        }

        func mapView(_ mapView: MGLMapView, didFinishLoading style: MGLStyle) {
            let source = style.sources.first as? MGLVectorTileSource
            let attribution = source?.attributionInfos.first
            self.attribution.wrappedValue = attribution?.title.string ?? ""
        }
    }

    // MARK: - MGLMapView proxy

    func centerCoordinate(_ centerCoordinate: CLLocationCoordinate2D) -> MapView {
        mapView.centerCoordinate = centerCoordinate
        return self
    }

    func zoomLevel(_ zoomLevel: Double) -> MapView {
        mapView.zoomLevel = zoomLevel
        return self
    }
}
