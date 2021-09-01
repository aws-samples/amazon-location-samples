# Access Amazon Location Service from Amazon Aurora

This sample code is part of AWS Database Blog [Access Amazon Location Service from Amazon Aurora](https://aws.amazon.com/blogs/database/access-amazon-location-service-from-amazon-aurora/). It creates and configures a Lambda function to geocode address data stored in Amazon Aurora using Amazon Location Service. Please refer to the blog for solution details.

1. Run the CloudFormation template `geocode-lambda-aurora.yml` to create the solution stack. The template requires Amazon Aurora cluster identifier.
2. Use `CreateFunction.sql` to create the Lambda user-defined function in Amazon Aurora cluster. Replace the placeholders `<GEOCODE_LAMBDA_FUNCTION_NAME>` with actual value provided in the CloudFormation stack output.
3. Use `CreateTable.sql` to create customer_address table with the fields required to geocode address data. Load customer address data in this table.
4. Run the sample SQL queries provided in the blog to geocode address data.

## Source Code
### Lambda
`geocode.py`
    Common module containing geocode_address function
    
`lambda_function.py`
    Event handler for RDS invocation

### UDF
`CreateFunction.sql`
    Lambda UDF to call GeocodeAddress-Aurora Lambda function

`CreateTable.sql`
    Customer Address table

### CloudFormation
`geocode-lambda-aurora.yml`
    CloudFormation template to configure solution resources - Place index, Lambda functions and IAM permissions

[![Launch Stack](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2017/02/10/launchstack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?templateUrl=https://amazon-location-service-lambda-udf.s3.amazonaws.com/geocode-lambda-aurora.yml)