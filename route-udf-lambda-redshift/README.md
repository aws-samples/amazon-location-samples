# Access Amazon Location Service from Amazon Redshift

This sample code extends the AWS Big Data Blog [Access Amazon Location Service from Amazon Redshift](https://aws.amazon.com/blogs/big-data/access-amazon-location-service-from-amazon-redshift/) to calculate routes between location points. It creates and configures a Lambda function to calculate routes between location data destinationd in Amazon Redshift using Amazon Location Service. Please refer to the blog for basic architecture of this solution.

1. Run the CloudFormation template `route-lambda-redshift.yml` to create the solution stack. The template requires Amazon Redshift cluster identifier.
2. Use `CreateFunction.sql` to create the Lambda user-defined function in Amazon Redshift cluster. Replace the placeholders `<ROUTE_LAMBDA_FUNCTION_NAME>` and `<REDSHIFT_LAMBDA_IAM_ROLE>` with actual values provided in the CloudFormation stack output.
3. Use `CreateTable.sql` to create departures_destinations table with the fields required to calculate routes. Load departure-destination data in this table.
4. Run the following SQL query to calculate routes and determine drive distance and drive time between departures and destinations.

## Nested SQL Query
```
SELECT departure_id, destination_id,
       cast(json_extract_path_text(route_result, 'DriveDistance') AS DECIMAL(5,2)) AS drive_distance,
       cast(json_extract_path_text(route_result, 'DriveTime') AS DECIMAL(5,2)) AS drive_time
FROM (SELECT departure_id, destination_id,
             f_calculate_route(departure_longitude, departure_latitude, destination_longitude, destination_latitude) AS route_result
      FROM departures_destinations);
```

## Source Code
### Lambda
`route.py`
    Common module containing calculate_route function
    
`lambda_function.py`
    Event handler for Redshift invocation

### UDF
`CreateFunction.sql`
    Lambda UDF to call CalculateRoutes-Redshift Lambda function

`CreateTable.sql`
    departures-destinations table

### CloudFormation
`route-lambda-redshift.yml`
    CloudFormation template to configure solution resources - Route Calculator, Lambda functions and IAM permissions

[![Launch Stack](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2017/02/10/launchstack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?templateUrl=https://amazon-location-service-lambda-udf.s3.amazonaws.com/route-lambda-redshift.yml)