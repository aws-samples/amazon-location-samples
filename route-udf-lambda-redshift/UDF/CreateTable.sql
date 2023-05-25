CREATE TABLE departures_destinations
(
	departure_id INTEGER NOT NULL,
	destination_id INTEGER NOT NULL,
	departure_longitude DOUBLE PRECISION NOT NULL,
	departure_latitude DOUBLE PRECISION NOT NULL,
	destination_longitude DOUBLE PRECISION NOT NULL,
	destination_latitude DOUBLE PRECISION NOT NULL,
	PRIMARY KEY (departure_id, destination_id)
)