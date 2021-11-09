// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useEffect, useRef } from "react";
import { Hub } from "@aws-amplify/core";
import useDebounce from "../useDebounce";
import { defaultState } from "../AppContext";
import Button from "../primitives/Button";

const DepartureTimeHoursOption = ({ date }) => {
  const humanFriendly = new Intl.DateTimeFormat("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return (
    <option
      value={humanFriendly}
      data-hours={date.getHours()}
      data-minutes={date.getMinutes()}
    >
      {humanFriendly}
    </option>
  );
};

const DepartureTimeHoursSelect = ({ departureTime, setDepartureTime }) => {
  const nowDate = new Date();
  const [localDepartureTime, setLocalDepartureTime] = useState();
  let tick = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate()
  );
  const isToday =
    tick.toISOString() ===
    new Date(
      departureTime.getFullYear(),
      departureTime.getMonth(),
      departureTime.getDate()
    ).toISOString();
  const options = [];

  useEffect(() => {
    if (localDepartureTime !== undefined && localDepartureTime !== null) {
      let newPotentialDate = new Date(localDepartureTime.getTime());
      newPotentialDate = new Date(
        newPotentialDate.setHours(
          localDepartureTime.getHours(),
          localDepartureTime.getMinutes(),
          localDepartureTime.getSeconds()
        )
      );
      setDepartureTime(newPotentialDate);
    }
  }, [localDepartureTime, setDepartureTime]);

  const handleSelectChange = (e) => {
    const { selectedOptions } = e.target;
    const { dataset } = selectedOptions[0];
    console.debug(dataset);

    let newPotentialDate = new Date(departureTime.getTime());
    newPotentialDate = new Date(
      newPotentialDate.setHours(dataset.hours, dataset.minutes, 0)
    );
    setLocalDepartureTime(newPotentialDate);
  };

  while (
    new Intl.DateTimeFormat("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    }).format(tick) !== "12:00 AM" ||
    options.length === 0
  ) {
    if (isToday && tick <= nowDate) {
      tick = new Date(tick.setMinutes(tick.getMinutes() + 30));
      continue;
    }
    options.push(new Date(tick));
    tick = new Date(tick.setMinutes(tick.getMinutes() + 30));
  }

  return (
    <select onChange={handleSelectChange}>
      {options.map((tick, idx) => {
        if (idx === 0 && localDepartureTime === undefined) {
          setLocalDepartureTime(tick);
        }
        return <DepartureTimeHoursOption key={tick.getTime()} date={tick} />;
      })}
    </select>
  );
};

// TODO: Comment this component
const DepartureTimeSelector = ({ isOptionOpen, setIsOptionOpen }) => {
  const [departureTime, setDepartureTime] = useState(null);
  const [isLeaveNow, setIsLeaveNow] = useState(true);
  const debouncedDepartureTime = useDebounce(departureTime, 500);
  const dateInputRef = useRef();
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 30));

  useEffect(() => {
    if (isLeaveNow && debouncedDepartureTime !== defaultState.departureTime) {
      Hub.dispatch("Routing", { event: "changeDepartureTime", data: null });
    } else if (
      !isLeaveNow &&
      debouncedDepartureTime !== defaultState.departureTime
    ) {
      Hub.dispatch("Routing", {
        event: "changeDepartureTime",
        data: debouncedDepartureTime,
      });
    }
  }, [isLeaveNow, debouncedDepartureTime]);

  const handleDepartureChange = (e) => {
    const { value } = e.target;
    const isNewLeaveNow = Boolean(parseInt(value));
    console.debug("Change leave now to", isNewLeaveNow);
    setIsLeaveNow(isNewLeaveNow);
    if (isLeaveNow && departureTime === null) {
      setDepartureTime(new Date());
    }
  };

  const handleDateClick = (e) => {
    const { id } = e.target;

    let newPotentialDate = new Date(
      departureTime.getFullYear(),
      departureTime.getMonth(),
      departureTime.getDate()
    );
    const nowDate = new Date();
    const now = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate()
    );
    if (id === "departureTimeBackDateBtn") {
      // Cannot set a day in the past
      if (newPotentialDate.toISOString() === now.toISOString()) {
        return;
      }
      newPotentialDate = new Date(
        newPotentialDate.setDate(newPotentialDate.getDate() - 1)
      );
    } else if (id === "departureTimeNextDateBtn") {
      // Cannot set a day too much in the future
      if (newPotentialDate.toISOString() === maxDate.toISOString()) {
        return;
      }
      newPotentialDate = new Date(
        newPotentialDate.setDate(newPotentialDate.getDate() + 1)
      );
    }
    setDepartureTime(
      new Date(
        newPotentialDate.setHours(
          departureTime.getHours(),
          departureTime.getMinutes(),
          departureTime.getSeconds()
        )
      )
    );
  };

  const handleCalendarChange = (e) => {
    const { target } = e;
    let newPotentialDate = new Date(target.value);
    setDepartureTime(
      new Date(
        newPotentialDate.setHours(
          departureTime.getHours(),
          departureTime.getMinutes(),
          departureTime.getSeconds()
        )
      )
    );
    target.blur();
  };

  return (
    <>
      <div className="w-full flex">
        <div className="w-3/4">
          <select onChange={handleDepartureChange}>
            <option value={1}>Leave Now</option>
            <option value={0}>Depart At</option>
          </select>
        </div>
        <Button
          className="w-1/4 text-center text-sm uppercase"
          onPress={() => setIsOptionOpen(!isOptionOpen)}
        >
          {isOptionOpen ? "Close" : "Options"}
        </Button>
      </div>
      {isLeaveNow === false && (
        <div className="flex pt-3">
          <div className="w-1/2">
            <DepartureTimeHoursSelect
              departureTime={
                departureTime !== null ? departureTime : new Date()
              }
              setDepartureTime={setDepartureTime}
            />
          </div>
          <div className="w-1/2">
            {/* TODO: disable buttons when limits reached */}
            <button
              className="w-1/5 text-sm text-white bg-gray-500 rounded-tl-md rounded-bl-md border border-gray-500"
              title={`Decrease date`}
              onClick={handleDateClick}
              id="departureTimeBackDateBtn"
            >
              &lt;
            </button>
            <input
              type="date"
              value={departureTime.toISOString().split("T")[0]}
              min={new Date().toISOString().split("T")[0]}
              max={
                new Date(new Date().setDate(new Date().getDate() + 30))
                  .toISOString()
                  .split("T")[0]
              }
              ref={dateInputRef}
              onChange={handleCalendarChange}
            />
            <button
              className="w-1/5 text-sm text-white bg-gray-500 rounded-tr-md rounded-br-md border border-gray-500"
              onClick={handleDateClick}
              id="departureTimeNextDateBtn"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartureTimeSelector;
