// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState } from "react";
import {
  Heading,
  Button,
  Table,
  TableCell,
  TableBody,
  TableRow,
  CheckboxField,
} from "@aws-amplify/ui-react";
import Panel from "../common/Panel";
import Spinner from "../common/Spinner";
import styles from "./GeofencesPanel.module.css";
import { GEOFENCE } from "../../configuration";

// Popup panel for Geofences
const GeofencesPanel = ({
  onClose,
  geofences,
  onDeleteGeofences,
  onAddGeofence,
  isLoading,
  onToggleGeofences,
  geofencesVisible,
  totalGeofences,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Help keep track of which checkboxes are selected
  const handleCheckboxChange = (e) => {
    if (selectedItems.includes(e.target.value)) {
      setSelectedItems(selectedItems.filter((item) => item !== e.target.value));
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, e.target.value]);
    }
  };

  const handleDeleteGeofences = () => {
    onDeleteGeofences(selectedItems);
    setSelectedItems([]);
  };

  return (
    <Panel
      header={
        <div className={styles.header}>
          <Heading level={4}>Geofences</Heading>
          <div>
            <Button size="small" style={{ marginRight: "0.5rem" }} onClick={handleDeleteGeofences}>
              Remove
            </Button>
            <Button size="small" variation="primary" onClick={onAddGeofence}>
              Add
            </Button>
          </div>
        </div>
      }
      footer={
        <>
          <Button size="small" onClick={onClose}>
            Close
          </Button>
          <Button size="small" onClick={onToggleGeofences}>
            {geofencesVisible ? "Hide" : "Show"} All Geofences
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Spinner />
      ) : geofences?.length > 0 ? (
        <>
          <div className={styles.collection}>{GEOFENCE}</div>
          <Table highlightOnHover={false} size="small" variation="striped">
            <TableBody>
              {geofences?.map((geofence) => {
                return (
                  <TableRow key={geofence.GeofenceId}>
                    <TableCell style={{ width: "1rem" }}>
                      <CheckboxField
                        value={geofence.GeofenceId}
                        checked={selectedItems.includes(geofence.GeofenceId)}
                        onChange={handleCheckboxChange}
                      />
                    </TableCell>
                    <TableCell>{geofence.GeofenceId}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {totalGeofences > 10 && (
            <em className={styles.max}>
              Displaying {geofences?.length} of {totalGeofences} geofences
            </em>
          )}
        </>
      ) : (
        geofences?.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.empty__header}>There are no geofences.</div>
            <div className={styles.empty__body}>
              Use the Add button to create a geofence. After you draw one or more geofences, they
              will show up here.
            </div>
          </div>
        )
      )}
    </Panel>
  );
};

export default GeofencesPanel;
