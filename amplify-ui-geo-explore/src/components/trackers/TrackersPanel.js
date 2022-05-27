// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Heading, Button } from "@aws-amplify/ui-react";
import Panel from "../common/Panel";
import styles from "./TrackersPanel.module.css";
import { TRACKER, TRACKER_SIMULATED_DEVICE } from "../../configuration";

// Popup panel for Trackers
const TrackersPanel = ({
  onClose,
  onToggleDevices,
  devicesVisible,
  simulatedPosition,
  isViewingDeviceHistory,
}) => {
  return (
    <Panel
      header={
        <>
          <Heading level={4}>Trackers</Heading>
          <div>Simulate a device sending location updates to Trackers.</div>
        </>
      }
      footer={
        <>
          <Button size="small" onClick={onClose}>
            Close
          </Button>
          <Button size="small" onClick={onToggleDevices}>
            {devicesVisible ? "Hide" : "Show"} All Devices
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <div className={styles.field__label}>Tracker Resource</div>
        <div className={styles.field__value}>{TRACKER}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.field__label}>Simulated Device ID</div>
        <div className={styles.field__value}>{TRACKER_SIMULATED_DEVICE}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.field__label}>Simulated Device Position</div>
        {isViewingDeviceHistory && (
          <div className={styles.field__value} style={{ color: !simulatedPosition && "#3eb0ce" }}>
            <em>
              Exit out of the Device Position History Viewer before simulating a device position.
            </em>
          </div>
        )}
        <div
          className={styles.field__value}
          style={{
            color: isViewingDeviceHistory ? "#cacaca" : !simulatedPosition ? "#3eb0ce" : undefined,
          }}
        >
          {!simulatedPosition ? (
            <em>Click on the map to set the device position.</em>
          ) : (
            <>
              {simulatedPosition.longitude.toFixed(6)}, {simulatedPosition.latitude.toFixed(6)}
            </>
          )}
        </div>
        <div
          className={styles.field__value}
          style={{ color: !simulatedPosition ? "#cacaca" : "#3eb0ce" }}
        >
          <em>
            Wait for the device positions to refresh to see the new position of the simulated
            device.
          </em>
        </div>
      </div>
      <div className={styles.information}>Click on a device to view more information.</div>
      <div className={styles.refresh}>Device positions are refreshed every 5 seconds.</div>
    </Panel>
  );
};

export default TrackersPanel;
