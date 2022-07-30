// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Card } from "@aws-amplify/ui-react";
import styles from "./InfoBox.module.css";

// Information box
const InfoBox = ({ header, children }) => {
  return (
    <div className={styles.wrapper}>
      <Card variation="elevated">
        <h2 className={styles.header}>{header}</h2>
        <div className={styles.content}>{children}</div>
      </Card>
    </div>
  );
};

export default InfoBox;
