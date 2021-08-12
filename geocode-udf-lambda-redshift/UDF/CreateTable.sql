CREATE TABLE customer_address
(
	customer_id INTEGER NOT NULL,
	address_line VARCHAR(65),
	municipality_name VARCHAR(30),
	state_code VARCHAR(2),
	post_code VARCHAR(10),
	longitude DOUBLE PRECISION,
	latitude DOUBLE PRECISION,
	country_code VARCHAR(3),
	geocode_result VARCHAR(200),
	address_status VARCHAR(10),
	PRIMARY KEY (customer_id)
)