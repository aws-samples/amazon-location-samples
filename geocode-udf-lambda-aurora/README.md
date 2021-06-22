# Access Amazon Location Service from Amazon Aurora

This sample code is part of AWS Blog "Access Amazon Location Service from Amazon Aurora". It creates and configures a Lambda function to geocode address data stored in Amazon Aurora using Amazon Location Service. Please refer to the blog for solution details.

1. Run the CloudFormation template `geocode-lambda-aurora.yml` to create the solution stack. The template requires Amazon Aurora cluster identifier.
2. Use `CreateFunction.sql` to create the Lambda user-defined function in Amazon Aurora cluster. Replace the placeholders `<GEOCODE_LAMBDA_FUNCTION_NAME>` with actual value provided in the CloudFormation stack output.
3. Run the sample SQL queries provided in the blog to geocode address data.

## Source Code
### Lambda
`geocode.py`
    Common module containing geocode_address function
    
`lambda_function.py`
    Event handler for RDS invocation

### UDF
`CreateFunction.sql`
    Lambda UDF to call GeocodeAddress-Aurora Lambda function

### CloudFormation
`geocode-lambda-aurora.yml`
    CloudFormation template to configure solution resources - Place index, Lambda functions and IAM permissions