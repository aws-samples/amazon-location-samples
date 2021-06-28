CREATE TABLE customer_address (
	customer_id int8 NOT NULL,
	address_line varchar(65) NULL,
	municipality_name varchar(30) NULL,
	state_code varchar(2) NULL,
	post_code varchar(10) NULL,
	country_code varchar(3) NULL,
	longitude float8 NULL,
	latitude float8 NULL,
	geocode_result jsonb NULL,
	address_status varchar(10)
);
CREATE UNIQUE INDEX customer_address_customer_id 
ON customer_address
USING btree (customer_id);