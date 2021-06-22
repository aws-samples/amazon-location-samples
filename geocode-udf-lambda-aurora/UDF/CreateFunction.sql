-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
-- SPDX-License-Identifier: MIT-0

CREATE OR REPLACE FUNCTION public.f_geocode_address(address_line varchar(85), municipality_name varchar(60), state_code varchar(2), post_code varchar(10), country_code varchar(3))
 RETURNS varchar(200)
 LANGUAGE plpgsql
AS $function$
declare 
  result varchar(200);
begin
    SELECT payload into result
    FROM tpc_ds.customer_address,
         aws_lambda.invoke(aws_commons.create_lambda_function_arn('<GEOCODE_LAMBDA_FUNCTION_NAME>'),
         concat('{"address_line":"',address_line,'",
                  "municipality_name":"',municipality_name,'",
                  "state_code":"',state_code,'",
                  "post_code":"',post_code,'",
                  "country_code":"',country_code,'"}')::json);
                  
    return result;
end;
$function$
;