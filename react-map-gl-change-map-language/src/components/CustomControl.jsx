// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export default class CustomControl {
  constructor(redraw, id) {
    this._redraw = redraw;
    this._id = id;
  }

  onAdd(map) {
    this._map = map;
    map.on("move", this._redraw);
    this._container = document.createElement("div");
    this._container.className = "maplibre-ctrl";
    this._container.id = this._id;
    this._redraw();
    return this._container;
  }

  onRemove() {
    this._container.remove();
    this._map.off("move", this._redraw);
    this._map = null;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }
}