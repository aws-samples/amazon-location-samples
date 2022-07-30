// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.wrapper}> 
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
