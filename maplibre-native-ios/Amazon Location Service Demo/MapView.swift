// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import AWSCore
import Mapbox
import SwiftUI
import OSLog
import MapViewOSLogExtensions

struct MapView: UIViewRepresentable {
    @Binding var attribution: String

    private let mapView: MGLMapView
    private let signingDelegate: MGLOfflineStorageDelegate
    var oslog = OSLog(subsystem: OSLog.subsystemMapview, category: OSLog.categoryMapview)

    init(attribution: Binding<String>) {
        OSLog.mapView(.event, "🎬 MapView init()")
        let regionName = Bundle.main.object(forInfoDictionaryKey: "AWSRegion") as! String
        let identityPoolId = Bundle.main.object(forInfoDictionaryKey: "IdentityPoolId") as! String
        let mapName = Bundle.main.object(forInfoDictionaryKey: "MapName") as! String

        let region = (regionName as NSString).aws_regionTypeValue()

        OSLog.mapView(.event, "✍️ AWSSignatureV4Delegate")
        // MGLOfflineStorage doesn't take ownership, so this needs to be a member here
        signingDelegate = AWSSignatureV4Delegate(region: region, identityPoolId: identityPoolId)

        OSLog.mapView(.event, "✍️ signingDelegate")
        // register a delegate that will handle SigV4 signing
        MGLOfflineStorage.shared.delegate = signingDelegate

        mapView = MGLMapView(
            frame: .zero,
            styleURL: URL(string: "https://maps.geo.\(regionName).amazonaws.com/maps/v0/maps/\(mapName)/style-descriptor"))

        _attribution = attribution
        OSLog.mapView(.event, "🗺 regionName: \(regionName), mapName: \(mapName), attribution: \(attribution)")
        OSLog.mapView(.event, "🖼 frame: \(mapView.frame)")
    }

    // MARK: - UIViewRepresentable protocol

    func makeCoordinator() -> Coordinator {
        Coordinator($attribution)
    }

    func makeUIView(context: UIViewRepresentableContext<MapView>) -> MGLMapView {
        OSLog.mapView(.event)
        mapView.delegate = context.coordinator

        mapView.logoView.isHidden = true
        mapView.attributionButton.isHidden = true
        return mapView
    }

    func updateUIView(_ uiView: MGLMapView, context: UIViewRepresentableContext<MapView>) {
        OSLog.mapView(.event)
    }

    // MARK: - MGLMapViewDelegate

    class Coordinator: NSObject, MGLMapViewDelegate {
        var oslog = OSLog(subsystem: OSLog.subsystemMapview, category: OSLog.categoryMapview)
        var attribution: Binding<String>

        init(_ attribution: Binding<String>) {
            OSLog.mapView(.event, OSLog.mapEvents.initDelegate.description)
            OSLog.mapView(.event, OSLog.mapEvents.WillStartRenderingMap.description)
            OSLog.mapView(.begin, OSLog.mapEvents.WillStartRenderingMap.rawValue)
            OSLog.mapView(.begin, OSLog.mapEvents.DidFinishLoadingStyle.rawValue)
            OSLog.mapView(.begin, OSLog.mapEvents.DidFinishRenderingMap.rawValue)
            OSLog.mapView(.begin, OSLog.mapEvents.DidFinishLoadingMap.rawValue)
            OSLog.mapView(.begin, OSLog.mapEvents.DidBecomeIdle.rawValue)
            self.attribution = attribution
        }

        func mapView(_ mapView: MGLMapView, didFinishLoading style: MGLStyle) {
            OSLog.mapView(.event, OSLog.mapEvents.DidFinishLoadingStyle.rawValue)
            OSLog.mapView(.end, OSLog.mapEvents.DidFinishLoadingStyle.rawValue)
            let source = style.sources.first as? MGLVectorTileSource
            let attribution = source?.attributionInfos.first
            self.attribution.wrappedValue = attribution?.title.string ?? ""
        }
        
        // MARK: func mapView Delegates
        func mapViewWillStartLoadingMap(_ mapView: MGLMapView) {
            os_signpost(.event, log: oslog, name: "mapViewWillStartLoadingMap")
            OSLog.mapView(.event, OSLog.mapEvents.WillStartLoadingMap.rawValue)
        }

        func mapViewWillStartRenderingMap(_ mapView: MGLMapView) {
            OSLog.mapView(.end, OSLog.mapEvents.WillStartRenderingMap.rawValue)
            OSLog.mapView(.event, OSLog.mapEvents.WillStartRenderingMap_to_DidBecomeIdle.rawValue)
            OSLog.mapView(.begin, OSLog.mapEvents.WillStartRenderingMap_to_DidBecomeIdle.rawValue)
        }

        func mapViewWillStartRenderingFrame(_ mapView: MGLMapView) {
        }
        
        func mapViewDidFinishRenderingMap(_ mapView: MGLMapView, fullyRendered: Bool) {
            OSLog.mapView(.event, OSLog.mapEvents.DidFinishRenderingMap.rawValue)
            OSLog.mapView(.end, OSLog.mapEvents.DidFinishRenderingMap.rawValue)
        }

        func mapViewDidFinishLoadingMap(_ mapView: MGLMapView) {
            OSLog.mapView(.event, OSLog.mapEvents.DidFinishLoadingMap.rawValue)
            OSLog.mapView(.end, OSLog.mapEvents.DidFinishLoadingMap.rawValue)
        }

        func mapViewDidBecomeIdle(_ mapView: MGLMapView) {
            
            OSLog.mapView(.event, OSLog.mapEvents.DidBecomeIdle.rawValue)
            OSLog.mapView(.end, OSLog.mapEvents.DidBecomeIdle.rawValue)
            OSLog.mapView(.end, OSLog.mapEvents.WillStartRenderingMap_to_DidBecomeIdle.rawValue)
        }
        
        func mapViewRegionIsChanging(_ mapView: MGLMapView) {
            OSLog.mapView(.event, OSLog.mapEvents.RegionIsChanging.rawValue)
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
