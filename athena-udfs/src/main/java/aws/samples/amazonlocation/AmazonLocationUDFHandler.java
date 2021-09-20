// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
package aws.samples.amazonlocation;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.athena.connector.lambda.exceptions.FederationThrottleException;
import com.amazonaws.athena.connector.lambda.handlers.UserDefinedFunctionHandler;
import com.amazonaws.services.location.AmazonLocation;
import com.amazonaws.services.location.AmazonLocationClient;
import com.amazonaws.services.location.model.Place;
import com.amazonaws.services.location.model.PlaceGeometry;
import com.amazonaws.services.location.model.SearchPlaceIndexForPositionRequest;
import com.amazonaws.services.location.model.SearchPlaceIndexForTextRequest;
import com.amazonaws.services.location.model.ThrottlingException;

public class AmazonLocationUDFHandler extends UserDefinedFunctionHandler {
    private static final String PLACE_INDEX_NAME = System.getenv("PLACE_INDEX_NAME");
    private final AmazonLocation client = AmazonLocationClient.builder()
            .withClientConfiguration(new ClientConfiguration()
                    // push retries onto Athena by disabling them here
                    .withMaxErrorRetry(0)
                    // identify these calls as coming via Athena
                    .withUserAgentSuffix("Amazon Athena"))
            .build();

    public AmazonLocationUDFHandler() {
        super("AmazonLocation");
    }

    /**
     * Call Amazon Location Service's SearchPlaceIndexForPosition API.
     *
     * Note: UDF names must be lowercase.
     *
     * @param x X/longitude coordinate.
     * @param y Y/latitude coordinate.
     * @return First result.
     */
    public Map<String, Object> search_place_index_for_position(Double x, Double y) {
        try {
            return client.searchPlaceIndexForPosition(buildPositionRequest().withPosition(x, y)).getResults().stream()
                    .map(r -> r.getPlace()).map(place -> toMap(place)).findFirst().orElse(null);
        } catch (ThrottlingException e) {
            throw new FederationThrottleException("Throttled by upstream service", e);
        }
    }

    /**
     * Call Amazon Location Service's SearchPlaceIndexForText API.
     *
     * Note: UDF names must be lowercase.
     *
     * @param text Query text.
     * @return First result.
     */
    public Map<String, Object> search_place_index_for_text(String text) {
        try {
            return client.searchPlaceIndexForText(buildTextRequest().withText(text)).getResults().stream()
                    .map(r -> r.getPlace()).map(place -> toMap(place)).findFirst().orElse(null);
        } catch (ThrottlingException e) {
            throw new FederationThrottleException("Throttled by upstream service", e);
        }
    }

    /**
     * Call Amazon Location Service's SearchPlaceIndexForText API with a bias
     * position.
     *
     * Note: UDF names must be lowercase.
     *
     * @param text          Query text.
     * @param biasPositionX Bias position x-coordinate.
     * @param biasPositionY Bias position y-coordinate.
     * @return First result.
     */
    public Map<String, Object> search_place_index_for_text(String text, Double biasPositionX, Double biasPositionY) {
        try {
            return client
                    .searchPlaceIndexForText(
                            buildTextRequest().withText(text).withBiasPosition(biasPositionX, biasPositionY))
                    .getResults().stream().map(r -> r.getPlace()).map(place -> toMap(place)).findFirst().orElse(null);
        } catch (ThrottlingException e) {
            throw new FederationThrottleException("Throttled by upstream service", e);
        }
    }

    /**
     * Call Amazon Location Service's SearchPlaceIndexForText API with a bias
     * position and a country filter.
     *
     * Note: UDF names must be lowercase.
     *
     * @param text          Query text.
     * @param biasPositionX Bias position x-coordinate.
     * @param biasPositionY Bias position y-coordinate.
     * @param countryFilter List of 3-digit ISO country codes.
     * @return First result.
     */
    public Map<String, Object> search_place_index_for_text(String text, Double biasPositionX, Double biasPositionY,
            List<String> countryFilter) {
        try {
            return client
                    .searchPlaceIndexForText(buildTextRequest().withText(text)
                            .withBiasPosition(biasPositionX, biasPositionY).withFilterCountries(countryFilter))
                    .getResults().stream().map(r -> r.getPlace()).map(place -> toMap(place)).findFirst().orElse(null);
        } catch (ThrottlingException e) {
            throw new FederationThrottleException("Throttled by upstream service", e);
        }
    }

    /**
     * Call Amazon Location Service's SearchPlaceIndexForText API with a bounding
     * box filter.
     *
     * Note: UDF names must be lowercase.
     *
     * @param text        Query text.
     * @param filterBBoxW Minimum x-coordinate for bounding box filter.
     * @param filterBBoxS Minimum y-coordinate for bounding box filter.
     * @param filterBBoxE Maximum x-coordinate for bounding box filter.
     * @param filterBBoxN Maximum y-coordinate for bounding box filter.
     * @return First result.
     */
    public Map<String, Object> search_place_index_for_text(String text, Double filterBBoxW, Double filterBBoxS,
            Double filterBBoxE, Double filterBBoxN) {
        try {
            return client
                    .searchPlaceIndexForText(buildTextRequest().withText(text).withFilterBBox(filterBBoxW, filterBBoxS,
                            filterBBoxE, filterBBoxN))
                    .getResults().stream().map(r -> r.getPlace()).map(place -> toMap(place)).findFirst().orElse(null);
        } catch (ThrottlingException e) {
            throw new FederationThrottleException("Throttled by upstream service", e);
        }
    }

    /**
     * Call Amazon Location Service's SearchPlaceIndexForText API with a bounding
     * box filter.
     *
     * Note: UDF names must be lowercase.
     *
     * @param text          Query text.
     * @param filterBBoxW   Minimum x-coordinate for bounding box filter.
     * @param filterBBoxS   Minimum y-coordinate for bounding box filter.
     * @param filterBBoxE   Maximum x-coordinate for bounding box filter.
     * @param filterBBoxN   Maximum y-coordinate for bounding box filter.
     * @param countryFilter List of 3-digit ISO country codes.
     * @return First result.
     */
    public Map<String, Object> search_place_index_for_text(String text, Double filterBBoxW, Double filterBBoxS,
            Double filterBBoxE, Double filterBBoxN, List<String> countryFilter) {
        try {
            return client
                    .searchPlaceIndexForText(buildTextRequest().withText(text)
                            .withFilterBBox(filterBBoxW, filterBBoxS, filterBBoxE, filterBBoxN)
                            .withFilterCountries(countryFilter))
                    .getResults().stream().map(r -> r.getPlace()).map(place -> toMap(place)).findFirst().orElse(null);
        } catch (ThrottlingException e) {
            throw new FederationThrottleException("Throttled by upstream service", e);
        }
    }

    /**
     * Create a pre-configured SearchPlaceIndexForPositionRequest.
     *
     * @return Request initialized with the index name and number of max results
     *         populated.
     */
    private SearchPlaceIndexForPositionRequest buildPositionRequest() {
        return new SearchPlaceIndexForPositionRequest().withIndexName(PLACE_INDEX_NAME).withMaxResults(1);
    }

    /**
     * Create a pre-configured SearchPlaceIndexForTextRequest.
     *
     * @return Request initialized with the index name and number of max results
     *         populated.
     */
    private SearchPlaceIndexForTextRequest buildTextRequest() {
        return new SearchPlaceIndexForTextRequest().withIndexName(PLACE_INDEX_NAME).withMaxResults(1);
    }

    /**
     * Convert a geometry to well-known-text (WKT).
     *
     * @param geometry PlaceGeometry to convert.
     * @return WKT-formatted geometry.
     */
    private String toWKT(PlaceGeometry geometry) {
        return String.format("POINT(%s)",
                geometry.getPoint().stream().map(c -> c.toString()).collect(Collectors.joining(" ")));
    }

    /**
     * Convert a Place to a Map<String, Object>, suitable for returning to Athena.
     *
     * @param place Place to convert.
     * @return Map of place properties.
     */
    private Map<String, Object> toMap(Place place) {
        return Map.of("label", Optional.ofNullable(place.getLabel()).orElse(""), "address_number",
                Optional.ofNullable(place.getAddressNumber()).orElse(""), "street",
                Optional.ofNullable(place.getStreet()).orElse(""), "municipality",
                Optional.ofNullable(place.getMunicipality()).orElse(""), "postal_code",
                Optional.ofNullable(place.getPostalCode()).orElse(""), "sub_region",
                Optional.ofNullable(place.getSubRegion()).orElse(""), "region",
                Optional.ofNullable(place.getRegion()).orElse(""), "country",
                Optional.ofNullable(place.getCountry()).orElse(""), "geom", toWKT(place.getGeometry()));
    }
}
