//
//  MapViewModel.swift
//  AWSLocationDemo
//
//  Created by Knoetzke, Justin on 2022-08-08.
//

import SwiftUI
import AmplifyMapLibreUI
import AmplifyMapLibreAdapter
import Amplify
import CoreLocation

class MapViewModel: ObservableObject {
    @Published var searchText = ""
    @ObservedObject var mapState = AMLMapViewState()
    
    
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
