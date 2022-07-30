// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from "react";
import { Heading, Button, RadioGroupField, Radio } from "@aws-amplify/ui-react";
import Panel from "../common/Panel";
import styles from "./RoutesPanel.module.css";

const initialState = {
  travelMode: "Car",
  departureTimeMode: "none",
  departureDate: "",
  departureTime: "",
};

const getDestinationTextColor = (departurePosition, destinationPosition) => {
  if (!departurePosition && !destinationPosition) {
    return "#cacaca";
  } else if (departurePosition && !destinationPosition) {
    return "#3eb0ce";
  } else {
    return "#606060";
  }
};

// Popup panel to calculate route
const RoutesPanel = ({ onCalculate, onReset, onClose, departurePosition, destinationPosition }) => {
  const [travelMode, setTravelMode] = useState(initialState.travelMode);
  const [departureTimeMode, setDepartureTimeMode] = useState(initialState.departureTimeMode);
  const [departureDate, setDepartureDate] = useState(initialState.departureDate);
  const [departureTime, setDepartureTime] = useState(initialState.departureTime);
  const [departureDateTimeError, setDepartureDateTimeError] = useState(false);
  const [pastDepartureDateTimeError, setPastDepartureDateTimeError] = useState(false);

  const handleCalculate = () => {
    const departureDateTime =
      departureDate && departureTime ? new Date(departureDate + " " + departureTime) : undefined;

    if (departureTimeMode === "future" && (departureDate === "" || departureTime === "")) {
      // Display error if trying to calculate future route with empty date or time values
      setDepartureDateTimeError(true);
    } else if (departureTimeMode === "future" && new Date() >= departureDateTime) {
      // Display error if trying to calculate future route with a date time in the past
      setPastDepartureDateTimeError(true);
    } else {
      setDepartureDateTimeError(false);
      setPastDepartureDateTimeError(false);
      onCalculate({
        travelMode,
        departureTimeMode,
        departureDateTime,
      });
    }
  };

  const handleReset = () => {
    setDepartureDateTimeError(false);
    setPastDepartureDateTimeError(false);
    setTravelMode(initialState.travelMode);
    setDepartureTimeMode(initialState.departureTimeMode);
    setDepartureDate(initialState.departureDate);
    setDepartureTime(initialState.departureTime);
    // Call parent component reset to clear the markers
    onReset();
  };

  return (
    <Panel
      header={
        <>
          <Heading level={4}>Routes</Heading>
          <div>Plot route positions on the map to calculate a route.</div>
        </>
      }
      footer={
        <>
          <Button size="small" onClick={onClose}>
            Close
          </Button>
          <div>
            <Button
              variation="link"
              size="small"
              style={{ marginRight: "0.5rem" }}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button size="small" variation="primary" onClick={handleCalculate}>
              Calculate
            </Button>
          </div>
        </>
      }
    >
      <div className={styles.field}>
        <div className={styles.field__label}>Departure Position</div>
        <em
          className={styles.field__coordinates}
          style={{ color: !departurePosition ? "#3eb0ce" : "#606060" }}
        >
          {departurePosition ? departurePosition : "Click on the map to set the position"}
        </em>
      </div>
      <div className={styles.field}>
        <div className={styles.field__label}>Destination Position</div>
        <em
          className={styles.field__coordinates}
          style={{ color: getDestinationTextColor(departurePosition, destinationPosition) }}
        >
          {destinationPosition ? destinationPosition : "Click on the map to set the position"}
        </em>
      </div>
      <RadioGroupField
        label="Travel Mode"
        name="travelMode"
        value={travelMode}
        onChange={(e) => setTravelMode(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <Radio value="Car">Car</Radio>
        <Radio value="Truck">Truck</Radio>
        <Radio value="Walking">Walking</Radio>
      </RadioGroupField>
      <RadioGroupField
        label="Departure Time"
        name="departureTime"
        value={departureTimeMode}
        onChange={(e) => setDepartureTimeMode(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <Radio value="none">None (no traffic)</Radio>
        <Radio value="now">Now (live traffic)</Radio>
        <Radio value="future">Future (predicted traffic)</Radio>
      </RadioGroupField>
      <div className={styles.field}>
        <label htmlFor="departureDate" className={styles.field__label}>
          Date
        </label>
        <input
          id="departureDate"
          type="date"
          className={styles.field__input}
          disabled={departureTimeMode !== "future" ? true : false}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => {
            setDepartureDate(e.target.value);
          }}
          value={departureDate}
        />
        {departureDateTimeError && (
          <div className={styles.error}>A valid date and time are required.</div>
        )}
        <em className={pastDepartureDateTimeError ? styles.error : undefined}>
          Departure date must be in the future.
        </em>
      </div>
      <div className={styles.field}>
        <label htmlFor="departureTime" className={styles.field__label}>
          Time
        </label>
        <input
          id="departureTime"
          type="time"
          className={styles.field__input}
          disabled={departureTimeMode !== "future" ? true : false}
          onChange={(e) => setDepartureTime(e.target.value)}
          value={departureTime}
        />
        {departureDateTimeError && (
          <div className={styles.error}>A valid date and time are required.</div>
        )}
        <em className={pastDepartureDateTimeError ? styles.error : undefined}>
          Departure time must be in the future.
        </em>
      </div>
    </Panel>
  );
};

export default RoutesPanel;
