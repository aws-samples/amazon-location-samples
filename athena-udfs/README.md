# Amazon Location Athena UDFs

This is a set of _Federated Scalar Batch Functions_ for [Amazon Location Service](https://aws.amazon.com/location/) [Amazon Athena](https://aws.amazon.com/athena/) using the [Athena Query Federation SDK](https://github.com/awslabs/aws-athena-query-federation). These user-defined functions (UDFs) allow you to geocode and reverse geocode data accessible to Athena from the comfort of SQL.

## Deploying

These UDFs can be [deployed into your account using the AWS Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-west-2:104110588769:applications~AmazonLocationUDFs) (this is a temporary link, available in `us-west-2` only).

At present, this application requires an existing Amazon Location [Place Index](https://docs.aws.amazon.com/location-places/latest/APIReference/API_CreatePlaceIndex.html) resource, configured with `IntendedUse: "Storage"` to comply with [AWS Service Terms](https://aws.amazon.com/service-terms/) for Amazon Location. The name of this resource is provided to UDF implementation via the `PLACE_INDEX_NAME` environment variable.

## Querying

### `search_place_index_for_text`

The following SQL statement demonstrates how to convert textual addresses into coordinates using [`SearchPlaceIndexForText`](https://docs.aws.amazon.com/location-places/latest/APIReference/API_SearchPlaceIndexForText.html). In addition to returning a position, it will decompose the resulting address into components.

```sql
USING
-- use alternate function signatures shown below to provide additional parameters
EXTERNAL FUNCTION search_place_index_for_text(input VARCHAR)
  RETURNS ROW(
    label VARCHAR,
    address_number VARCHAR,
    street VARCHAR,
    municipality VARCHAR,
    postal_code VARCHAR,
    sub_region VARCHAR,
    region VARCHAR,
    country VARCHAR,
    geom VARCHAR)
  LAMBDA 'amazon_location' -- change this if necessary to reflect LambdaFunctionName
WITH addresses AS (
  -- substitute data from an Athena table here
  SELECT * FROM (VALUES '410 Terry Ave N, Seattle, WA') AS addresses(address)
), rsp AS (
  SELECT search_place_index_for_text(address) result
  FROM addresses
)
SELECT
  result.label,
  result.address_number,
  result.street,
  result.municipality,
  result.postal_code,
  result.sub_region,
  result.region,
  result.country,
  ST_GeometryFromText(result.geom) geom
FROM rsp
```

Alternate function definitions can be used to provide additional [`SearchPlaceIndexForText`](https://docs.aws.amazon.com/location-places/latest/APIReference/API_SearchPlaceIndexForText.html) parameters:

```sql
EXTERNAL FUNCTION search_place_index_for_text(input VARCHAR, bias_position_x DOUBLE, bias_position_y DOUBLE)
EXTERNAL FUNCTION search_place_index_for_text(input VARCHAR, bias_position_x DOUBLE, bias_position_y DOUBLE, countries ARRAY(VARCHAR))
EXTERNAL FUNCTION search_place_index_for_text(input VARCHAR, filter_min_x DOUBLE, filter_min_y DOUBLE, filter_max_x DOUBLE, filter_max_y DOUBLE)
EXTERNAL FUNCTION search_place_index_for_text(input VARCHAR, filter_min_x DOUBLE, filter_min_y DOUBLE, filter_max_x DOUBLE, filter_max_y DOUBLE, countries ARRAY(VARCHAR))
```

### `search_place_index_for_position`

The following SQL statement demonstrates how to convert coordinates into addresses using [`SearchPlaceIndexForPosition`](https://docs.aws.amazon.com/location-places/latest/APIReference/API_SearchPlaceIndexForText.html).

```sql
USING
EXTERNAL FUNCTION search_place_index_for_position(x DOUBLE, y DOUBLE)
  RETURNS ROW(
    label VARCHAR,
    address_number VARCHAR,
    street VARCHAR,
    municipality VARCHAR,
    postal_code VARCHAR,
    sub_region VARCHAR,
    region VARCHAR,
    country VARCHAR,
    geom VARCHAR)
  LAMBDA 'amazon_location' -- change this if necessary to reflect LambdaFunctionName
WITH positions AS (
  -- substitute data from an Athena table here
  SELECT * FROM (VALUES ROW(-122.46729, 37.80575)) AS positions(x, y)
), rsp AS (
  SELECT search_place_index_for_position(x, y) result
  FROM positions
)
SELECT
  result.label,
  result.address_number,
  result.street,
  result.municipality,
  result.postal_code,
  result.sub_region,
  result.region,
  result.country,
  ST_GeometryFromText(result.geom) geom
FROM rsp
```

## Development / Publishing

To publish your own adaptions to the Serverless Application Repository as a private application, run the following:

```bash
# create a bucket if necessary and ensure that it has an appropriate bucket policy, similar to the one below
aws s3 mb s3://<bucket> --region <region>
AWS_REGION=<region> S3_BUCKET=<bucket> make publish
```

`<bucket>` must be readable by the Serverless Application Repository. This can be achieved by applying the following policy to the bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "serverlessrepo.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<bucket>/*"
    }
  ]
}
```

Once this runs successfully, you'll be able to view the (private) Serverless Application Repository entry for this application and deploy it.

## Security

See [CONTRIBUTING](../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License.
