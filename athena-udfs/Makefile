default: target/athena-udfs-1.0-SNAPSHOT.jar

AWS_REGION:
	@test "${$@}" || (echo "$@ is undefined" && false)

S3_BUCKET:
	@test "${$@}" || (echo "$@ is undefined" && false)

target/athena-udfs-1.0-SNAPSHOT.jar: pom.xml $(shell find src -type f)
	mvn clean install -Dpublishing=true

packaged.yaml: amazon-location-udfs.yaml target/athena-udfs-1.0-SNAPSHOT.jar S3_BUCKET AWS_REGION
	sam package --template-file $< --output-template-file $@ --s3-bucket ${S3_BUCKET} --region ${AWS_REGION}

publish: packaged.yaml AWS_REGION
	sam publish --template $< --region ${AWS_REGION}

.PHONY: AWS_REGION S3_BUCKET publish
