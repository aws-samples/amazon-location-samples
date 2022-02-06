import React from "react";
import { Flex, Link } from "@aws-amplify/ui-react";

export const Header = () => {
  return (
    <Flex
      width="100%"
      height="var(--amplify-space-xxl)"
      direction="row"
      gap="0"
      justifyContent="center"
      padding="var(--amplify-space-xxxs) var(--amplify-space-medium)"
      as="header"
    >
      <Flex width="30vw" height="100%" alignItems="center" justifyContent="flex-start">
        <Link href={window.location.href} display="inline-flex" height="100%" width="20%">
          <img
            height="100%"
            src="/aws_logo.svg"
            alt="Amazon Web Services"
          />
        </Link>
      </Flex>
      <Flex width="70vw" height="100%" alignItems="center" justifyContent="flex-end">
        <Link
          href="https://developer.here.com/blog/build-and-deploy-location-apps-with-aws-location-services-and-here"
          alt="Blog Post on Here Developer Blog"
          isExternal={true}
          margin="0 0 0 var(--amplify-space-xs)"
          color="var(--amplify-primary-color)"
          fontSize="var(--amplify-font-sizes-medium)"
        >
          Learn More
        </Link>
        <Link
          href="https://github.com/aws-samples/amazon-location-samples/tree/main/react-map-gl-amplify-here-map"
          alt="Source Code on GitHub"
          isExternal={true}
          margin="0 0 0 var(--amplify-space-xs)"
          color="var(--amplify-primary-color)"
          fontSize="var(--amplify-font-sizes-medium)"
        >
          Source Code
        </Link>
        {/* <Link
          href="https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/aws-samples/amazon-location-samples/tree/main/react-map-gl-amplify-here-map"
          isExternal={true}
          margin="0 0 0 var(--amplify-space-xs)"
        >
          <img
            src="https://oneclick.amplifyapp.com/button.svg"
            alt="Deploy to Amplify Console"
          />
        </Link> */}
      </Flex>
    </Flex>
  );
};