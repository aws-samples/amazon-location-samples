CREATE EXTENSION IF NOT EXISTS aws_lambda CASCADE;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE OR REPLACE FUNCTION f_SearchPlaceIndexForPosition(
  "position" geometry(Point, 4326),
  max_results int DEFAULT 1
)
 RETURNS TABLE (
   label text,
   address_number text,
   street text,
   municipality text,
   postal_code text,
   sub_region text,
   region text,
   country text,
   geom geometry(Point, 4326)
 )
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
begin
    RETURN QUERY
    WITH results AS (
      SELECT json_array_elements(payload) rsp
      FROM aws_lambda.invoke(
        aws_commons.create_lambda_function_arn('AuroraUDFs-SearchPlaceIndexForPosition'),
        json_build_object(
          'position', array_to_json(ARRAY[ST_X("position"), ST_Y("position")]),
          'maxResults', max_results
        )
      )
    )
    SELECT
      rsp->'Place'->>'Label' AS label,
      rsp->'Place'->>'AddressNumber' AS address_number,
      rsp->'Place'->>'Street' AS street,
      rsp->'Place'->>'Municipality' AS municipality,
      rsp->'Place'->>'PostalCode' AS postal_code,
      rsp->'Place'->>'SubRegion' AS sub_region,
      rsp->'Place'->>'Region' AS region,
      rsp->'Place'->>'Country' AS country,
      ST_GeomFromGeoJSON(
        json_build_object(
          'type', 'Point',
            'coordinates', rsp->'Place'->'Geometry'->'Point'
        )
      ) geom
    FROM results;
end;
$function$;
