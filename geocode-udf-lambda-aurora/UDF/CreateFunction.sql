-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
-- SPDX-License-Identifier: MIT-0

CREATE OR REPLACE FUNCTION f_geocode_address(p_address_line varchar(85), p_municipality_name varchar(60), p_state_code varchar(2), p_post_code varchar(10), p_country_code varchar(3))
 RETURNS varchar(200)
 LANGUAGE plpgsql
AS $function$
declare 
  result varchar(200);
begin
    SELECT payload into result
    FROM aws_lambda.invoke(aws_commons.create_lambda_function_arn('<GEOCODE_LAMBDA_FUNCTION_NAME>'),
         concat('{"address_line":"',p_address_line,'",
                  "municipality_name":"',p_municipality_name,'",
                  "state_code":"',p_state_code,'",
                  "post_code":"',p_post_code,'",
                  "country_code":"',p_country_code,'"}')::json);
                  
    return result;
end;
$function$