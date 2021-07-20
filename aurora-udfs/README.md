# Amazon Aurora UDFs for Amazon Location Service

This is a set of [AWS Lambda and user-defined functions](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/PostgreSQL-Lambda.html) for [Amazon Aurora PostgreSQL](https://aws.amazon.com/rds/aurora/postgresql-features/) that enable querying [Amazon Location Service](https://aws.amazon.com/location/) using SQL. These facilitate cleaning, validating, and enriching data in place.

## Deploying

[![Launch Stack](../images/launch-stack.svg)](https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?templateUrl=https%3A%2F%2Famazon-location-cloudformation-templates.s3.us-west-2.amazonaws.com%2Faurora-udfs%2Ftemplate.yaml&stackName=AuroraUDFs)

This will deploy an AWS CloudFormation stack containing an Amazon Location place index resource, AWS Lambda functions callable from Aurora PostgreSQL that query the place index, all required IAM policies and roles, and an optional AWS Lambda VPC Endpoint (required if your Aurora PostgreSQL cluster is not publicly-accessible). The Lambdas' [Reserved Concurrency](https://docs.aws.amazon.com/lambda/latest/operatorguide/reserved-concurrency.html) will be set to `10` by default, which will limit the amount of rate-limiting applied by Amazon Location, given default transaction limits.

Once deployed, you will need to enable calling Lambda functions from Aurora (step 4 of [Giving Aurora access to Lambda](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/PostgreSQL-Lambda.html#PostgreSQL-Lambda-access)). `<Aurora Lambda Role ARN>` will be provided in the CloudFormation stack's **Outputs**.

```bash
aws rds \
  add-role-to-db-cluster \
  --db-cluster <DB cluster name> \
  --role-arn <Aurora Lambda Role ARN> \
  --feature-name Lambda
```

You will also need to register the UDFs (and the extensions they depend on) within your database. To do so, replace `AuroraUDFs` (if you didn't use the default stack name) with the name of your CloudFormation Stack in each function definition within `sql/`, and load each into your database using your PostgreSQL client of choice.

## [`f_SearchPlaceIndexForText`](sql/f_SearchPlaceIndexForText.sql)

`f_SearchPlaceIndexForText` wraps [`SearchPlaceIndexForText`](https://docs.aws.amazon.com/location-places/latest/APIReference/API_SearchPlaceIndexForText.html). Each element in the response will be mapped to a column, with `Geometry` surfaced as a [PostGIS geometry](https://postgis.net/docs/geometry.html), which can be converted to WKT using [`ST_AsText`](https://postgis.net/docs/ST_AsText.html). For example:

```sql
SELECT
  *,
  ST_AsText(geom) wkt
FROM f_SearchPlaceIndexForText('Vancouver, BC');
```

| label | address_number | street | municipality | postal_code | sub_region | region | country | geom | wkt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Vancouver, British Columbia, CAN | | | Vancouver | | Metro Vancouver | British Columbia | CAN | `0101000000282B4D4A41C75EC03044C02154A14840` | `POINT(-123.11336 49.2603800000001)` |

By default, the return will contain one row. To request additional rows, up to the `MaxResults` limit, run the following SQL statement while providing a `BiasPosition` and limiting to results in Canada.

```sql
SELECT *
FROM f_SearchPlaceIndexForText(
  'Mount Pleasant',
  ST_MakePoint(-123.113, 49.260),
  null,
  '{"CAN"}',
  5);
```

| label | address_number | street | municipality | postal_code | sub_region | region | country | geom |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mt Pleasant, Vancouver, British Columbia, CAN | | | Vancouver | | Metro Vancouver | British Columbia | CAN | `01010000002C73BA2C26C65EC0A05FCD0182A14840` |
| Mount Pleasant, Vancouver, British Columbia, CAN | | | Vancouver | | | British Columbia | CAN | `0101000000B8D05CA791C65EC0407BA01518A24840` |
| Mt Pleasant, Vancouver, British Columbia, CAN | | | Vancouver | | Metro Vancouver | British Columbia | CAN | `0101000000A0CC069964C65EC070BD18CA89A24840` |
| Mount Pleasant, Saskatchewan, CAN | | | | | | Saskatchewan | CAN | `010100000080471B47AC595AC040B4C876BE3B4940` |
| Mount Pleasant, Ontario, CAN | | | | | | Ontario | CAN | `0101000000E4C1DD59BB9F53C0C0B9313D61214640` |

To filter results using a bounding box, then pass a [`Box2D`](https://postgis.net/docs/Box2D.html) or polygon as `filter_bbox`:

```sql
SELECT *
FROM f_SearchPlaceIndexForText(
  'Mount Pleasant',
  null,
  'BOX(-139.06 48.30, -114.03 60.00)'::box2d,
  '{"CAN"}',
  5);
```

| label | address_number | street | municipality | postal_code | sub_region | region | country | geom |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mt Pleasant, Calgary, Alberta, CAN | | | Calgary | | Alberta | Alberta | CAN | `010100000064834C3272845CC058158C4AEA884940` |
| Mt Pleasant, Vancouver, British Columbia, CAN | | | Vancouver | | Metro Vancouver | British Columbia | CAN | `01010000002C73BA2C26C65EC0A05FCD0182A14840` |
| Mt Pleasant, Vancouver, British Columbia, CAN | | | Vancouver | | Metro Vancouver | British Columbia | CAN | `0101000000A0CC069964C65EC070BD18CA89A24840` |
| Mount Pleasant, Calgary, Alberta, CAN | | | Calgary | | | Alberta | CAN | `0101000000088A1F63EE845CC0E8B4E0455F894940` |
| Mount Pleasant, Vancouver, British Columbia, CAN | | | Vancouver | | | British Columbia | CAN | `0101000000B8D05CA791C65EC0407BA01518A24840` |

For more information on PostGIS types and functions, see the [PostGIS Reference](https://postgis.net/docs/reference.html).

## [`f_SearchPlaceIndexForPosition`](sql/f_SearchPlaceIndexForPosition.sql)

`f_SearchPlaceIndexForPosition` wraps [`SearchPlaceIndexForText`](https://docs.aws.amazon.com/location-places/latest/APIReference/API_SearchPlaceIndexForPosition.html). Each element in the response will be mapped to a column, with [PostGIS geometries]('POINT(-122.46729 37.80575)') used as input and output types. This will automatically cast a WKT input to a `geometry` and convert the output `geometry`:

```sql
SELECT
  *,
  ST_AsText(geom) wkt
FROM f_SearchPlaceIndexForPosition('POINT(-122.46729 37.80575)');
```

| label | address_number | street | municipality | postal_code | sub_region | region | country | geom | wkt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | Crissy Field, 603 Mason St, San Francisco, CA, 94129, USA | 603 | | San Francisco | 94129 | City and County of San Francisco | California | USA     | `0101000000DCEF5014E89D5EC04860E5D022E74240` | `POINT(-122.46729 37.80575)`

For more information on PostGIS types and functions, see the [PostGIS Reference](https://postgis.net/docs/reference.html).

## Security

See [CONTRIBUTING](https://github.com/aws-samples/amazon-location-samples/blog/main/CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
