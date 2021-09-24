// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import AWSCore
import Mapbox

struct MapLibreConfig {
    var identityPoolId: String {
        Bundle.main.object(forInfoDictionaryKey: "IdentityPoolId") as! String
    }
    
    var regionName: String {
        Bundle.main.object(forInfoDictionaryKey: "AWSRegion") as! String
    }
    
    var region: AWSRegionType {
        return (regionName as NSString).aws_regionTypeValue()
    }
    
    var credentialsProvider: AWSCredentialsProvider {
        AWSCognitoCredentialsProvider(regionType: region, identityPoolId: identityPoolId)
    }

}

/// `MapLibreSigV4RequestInterceptor` allows us to intercept and sigV4 sign network requests made by the `MapboxSDK`
///  The interceptor is added as a protocol to the `URLSessionConfiguration` by calling `configureMapLibre`
///
/// - note: This is a workaround for [https://github.com/aws-samples/amazon-location-samples/issues/31](https://github.com/aws-samples/amazon-location-samples/issues/31).
/// - seealso: https://github.com/mapbox/mapbox-gl-native/issues/12026 for an explanation of `NSURLProtocol`
/// - seealso: https://github.com/mapbox/mapbox-gl-native/pull/13886/files for usage in the Mapbox library.
class MapLibreSigV4RequestInterceptor: URLProtocol {
    lazy var session: URLSession = {
        let config = URLSession.shared.configuration
        return .init(configuration: config, delegate: self, delegateQueue: nil)
    }()
    
    var dataTask: URLSessionDataTask?
    private static var maplibreConfig = MapLibreConfig()
    private static var urlPrefix: String {
        "https://maps.geo.\(Self.maplibreConfig.regionName).amazonaws.com"
    }
    
    override class func canInit(with request: URLRequest) -> Bool {
        return canInit(with: request.url)
    }
    
    override class func canInit(with task: URLSessionTask) -> Bool {
        return canInit(with: task.currentRequest?.url)
    }
    
    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }
    
    override func startLoading() {
        guard let unsignedURL = request.url else {
            return
        }
        
        // URL-encode spaces, etc.
        let keyPath = String(unsignedURL.path.dropFirst())
        guard let percentEncodedKeyPath = keyPath.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) else {
            notifyClientOfError(MapLibreSigV4RequestInterceptorError.invalidCharactersInPath)
            return
        }
        
        guard let endpoint = AWSEndpoint(region: Self.maplibreConfig.region, serviceName: "geo", url: unsignedURL) else {
            notifyClientOfError(MapLibreSigV4RequestInterceptorError.awsEndpointNil)
            return
        }
        let requestHeaders: [String: String] = ["host": endpoint.hostName]
        
        // sign the URL
        let task = AWSSignatureV4Signer
            .generateQueryStringForSignatureV4(
                withCredentialProvider: Self.maplibreConfig.credentialsProvider,
                httpMethod: .GET,
                expireDuration: 60,
                endpoint: endpoint,
                // workaround for https://github.com/aws-amplify/aws-sdk-ios/issues/3215
                keyPath: Self.doubleEncode(path: percentEncodedKeyPath),
                requestHeaders: requestHeaders,
                requestParameters: .none,
                signBody: true)
        task.waitUntilFinished()
        
        guard task.error == nil else {
            notifyClientOfError(task.error!)
            return
        }
        
        guard let signedURL = task.result,
              var urlComponents = URLComponents(url: signedURL as URL, resolvingAgainstBaseURL: false) else {
            notifyClientOfError(MapLibreSigV4RequestInterceptorError.signingFailed(msg: "URLComponents initialization failed"))
            return
        }
        
        /// NB: re-use the original path; workaround for https://github.com/aws-amplify/aws-sdk-ios/issues/3215
        urlComponents.path = unsignedURL.path
        
        guard let transformedUrl = urlComponents.url else {
            notifyClientOfError(MapLibreSigV4RequestInterceptorError.signingFailed(msg: "URLComponents.url was nil"))
            return
        }
        
        let signedRequest = URLRequest(url: transformedUrl)
        self.dataTask = self.session.dataTask(with: signedRequest)
        self.dataTask?.resume()
        /// NB: Prevents a retain cycle as `URLSession` strongly references `self` as a delegate
        self.session.finishTasksAndInvalidate()
    }
    
    override func stopLoading() {
        self.dataTask?.cancel()
        self.dataTask = nil
    }
    
    private func notifyClientOfError(_ error: Error) {
        self.client?.urlProtocol(self, didFailWithError: error)
    }
    
    static func doubleEncode(path: String) -> String? {
        return path.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)?
            .addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)
    }
    
    private static func canInit(with url: URL?) -> Bool {
        url?.absoluteString.contains(Self.urlPrefix) == true
    }
}

extension MapLibreSigV4RequestInterceptor: URLSessionDataDelegate {
    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive response: URLResponse, completionHandler: @escaping (URLSession.ResponseDisposition) -> Void) {
        completionHandler(.allow)
        self.client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .allowed)
    }
    
    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        self.client?.urlProtocol(self, didLoad: data)
    }
    
    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let error = error {
            self.client?.urlProtocol(self, didFailWithError: error)
        } else {
            self.client?.urlProtocolDidFinishLoading(self)
        }
    }
}

enum MapLibreSigV4RequestInterceptorError: LocalizedError {
    case invalidCharactersInPath
    case awsEndpointNil
    case signingFailed(msg: String)
}
