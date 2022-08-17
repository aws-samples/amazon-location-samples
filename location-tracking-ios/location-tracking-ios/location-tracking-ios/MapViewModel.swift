//
//  MapViewModel.swift
//  AWSLocationDemo
//
//  Created by Knoetzke, Justin on 2022-08-08.
//

import SwiftUI
import Amplify
import AWSLocationGeoPlugin
import AWSCognitoAuthPlugin


class MapViewModel: ObservableObject {
    @Published var searchText = ""
   // @ObservedObject var mapState = AMLMapViewState()
    
    init() {
            configureAmplify()
        }
    
    private func configureAmplify() {
            let authPlugin = AWSCognitoAuthPlugin()
            let geoPlugin = AWSLocationGeoPlugin()
            do {
                try Amplify.add(plugin: authPlugin)
                try Amplify.add(plugin: geoPlugin)
                try Amplify.configure()
            } catch {
                print("Error configuring Amplify \(error)")
            }
        }
    
    func findHotel() {
        Amplify.Geo.search(for: searchText) { [weak self] result in
            switch result {
            case .success(let places):
                if places.first != nil { }
            case .failure(let error):
                print("Search failed with: \(error)")
                
            }
        }
    }
}
