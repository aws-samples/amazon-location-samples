import { useState, useEffect } from "react";
import { Hub } from "@aws-amplify/core";
import { Flex, Alert } from '@aws-amplify/ui-react';

const Body = ({ children }) => {
  const [error, setError] = useState(null);

  const handleErrors = (data) => {
    const { payload } = data;
    setError(payload.data);
  };

  useEffect(() => {
    Hub.listen("errors", handleErrors);

    // Clean up subscriptions when the component unmounts
    return () => {
      Hub.remove("errors", handleErrors);
    };
  });

  return (
    <Flex width="100%" height="100vh" justifyContent="center" alignItems="center">
      {error ? <Alert variation="error">{error}</Alert> : children}
    </Flex>
  );
};

export default Body;