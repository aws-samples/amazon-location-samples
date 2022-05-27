// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Card } from "@aws-amplify/ui-react";
import styles from "./Panel.module.css";

// Popup panel
const Panel = ({ header, footer, children }) => {
  return (
    <div className={styles.wrapper}>
      <Card className={styles.card} variation="elevated">
        <div className={styles.header}>{header}</div>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>{footer}</div>
      </Card>
    </div>
  );
};

export default Panel;
