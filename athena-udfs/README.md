# Amazon Location Athena UDFs

This is a set of _Federated Scalar Batch Functions_ for [Amazon Location Service](https://aws.amazon.com/location/) [Amazon Athena](https://aws.amazon.com/athena/) using the [Athena Query Federation SDK](https://github.com/awslabs/aws-athena-query-federation). These user-defined functions (UDFs) allow you to geocode and reverse geocode data accessible to Athena from the comfort of SQL.

## Deploying

These UDFs can be deployed into your account using the AWS Serverless Application Repository in the following regions:

- [US East (N. Virginia) (`us-east-1`)](https://console.aws.amazon.com/serverlessrepo/home?region=us-east-1#/published-applications/arn:aws:serverlessrepo:us-east-1:003883091127:applications~AmazonLocationUDFs)
- [US East (Ohio) (`us-east-2`)](https://us-east-2.console.aws.amazon.com/serverlessrepo/home?region=us-east-2#/published-applications/arn:aws:serverlessrepo:us-east-2:003883091127:applications~AmazonLocationUDFs)
- [US West (Oregon) (`us-west-2`)](https://us-west-2.console.aws.amazon.com/serverlessrepo/home?region=us-west-2#/published-applications/arn:aws:serverlessrepo:us-west-2:003883091127:applications~AmazonLocationUDFs)
- [Asia Pacific (Singapore) (`ap-southeast-1`)](https://ap-southeast-1.console.aws.amazon.com/serverlessrepo/home?region=ap-southeast-1#/published-applications/arn:aws:serverlessrepo:ap-southeast-1:003883091127:applications~AmazonLocationUDFs)
- [Asia Pacific (Sydney) (`ap-southeast-2`)](https://ap-southeast-2.console.aws.amazon.com/serverlessrepo/home?region=ap-southeast-2#/published-applications/arn:aws:serverlessrepo:ap-southeast-2:003883091127:applications~AmazonLocationUDFs)
- [Asia Pacific (Tokyo) (`ap-northeast-1`)](https://ap-northeast-1.console.aws.amazon.com/serverlessrepo/home?region=ap-northeast-1#/published-applications/arn:aws:serverlessrepo:ap-northeast-1:003883091127:applications~AmazonLocationUDFs)
- [Europe (Frankfurt) (`eu-central-1`)](https://eu-central-1.console.aws.amazon.com/serverlessrepo/home?region=eu-central-1#/published-applications/arn:aws:serverlessrepo:eu-central-1:003883091127:applications~AmazonLocationUDFs)
- [Europe (Ireland) (`eu-west-1`)](https://eu-west-1.console.aws.amazon.com/serverlessrepo/home?region=eu-west-1#/published-applications/arn:aws:serverlessrepo:eu-west-1:003883091127:applications~AmazonLocationUDFs)
- [Europe (Stockholm) (`eu-north-1`)](https://eu-north-1.console.aws.amazon.com/serverlessrepo/home?region=eu-north-1#/published-applications/arn:aws:serverlessrepo:eu-north-1:003883091127:applications~AmazonLocationUDFs)

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
