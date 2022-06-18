// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import { Marker, Popup } from "react-map-gl";
import { VEHICLE_ICON_SIZE } from "../../constants";
import VehicleIcon from "../common/VehicleIcon";
import styles from "./Devices.module.css";

// Display single device with popup if clicked
const SingleDevice = ({ device, selectedDevice, onChangeSelectedDevice, onViewDeviceHistory }) => {
  const lastReportedTime = new Date(device.SampleTime).toLocaleString();

  return (
    <>
      <Marker
        latitude={device.Position[1]}
        longitude={device.Position[0]}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          onChangeSelectedDevice(device.DeviceId);
        }}
        className={styles.marker}
      >
        <VehicleIcon size={VEHICLE_ICON_SIZE} />
      </Marker>
      {selectedDevice && (
        <Popup
          latitude={device.Position[1]}
          longitude={device.Position[0]}
          offset={[0, -VEHICLE_ICON_SIZE]}
          closeButton={true}
          closeOnClick={true}
          onClose={() => onChangeSelectedDevice()}
          anchor="bottom"
          className={styles.popup}
        >
          <div className={styles.popup__content}>
            <div className={styles.popup__title}>{device.DeviceId}</div>
            <div className={styles.popup__coordinates}>
              {`${device.Position[1].toFixed(6)}, ${device.Position[0].toFixed(6)}`}
            </div>
            <div className={styles.popup__item}>
              <div className={styles.popup__subtitle}>Last Reported</div>
              <div>{lastReportedTime}</div>
            </div>
            {device.PositionProperties && (
              <div className={styles.popup__item}>
                <div className={styles.popup__subtitle}>Position Properties</div>
                {Object.keys(device.PositionProperties).map((key) => (
                  <div key={key}>
                    <strong>{key}: </strong>
                    {device.PositionProperties[key]}
                  </div>
                ))}
              </div>
            )}
            <Button
              size="small"
              isFullWidth={true}
              style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}
              onClick={() => onViewDeviceHistory(device.DeviceId)}
            >
              View History
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

// Display tracked devices on map
const Devices = ({ devices, onViewDeviceHistory }) => {
  const [selectedDevice, setSelectedDevice] = useState();

  return (
    <>
      {devices?.length > 0 &&
        devices.map((device) => {
          return (
            <SingleDevice
              key={device.DeviceId}
              device={device}
              selectedDevice={selectedDevice === device.DeviceId}
              onChangeSelectedDevice={(device) => setSelectedDevice(device)}
              onViewDeviceHistory={onViewDeviceHistory}
            />
          );
        })}
    </>
  );
};

export default Devices;
