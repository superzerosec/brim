/* @flow */
import {render} from "react-dom"

import type {Pen} from "../types"

export default function reactComponent(renderComponent: *): Pen {
  let root

  function mount(el) {
    root = document.createElement("div")
    if (el.parentNode) {
      el.parentNode.appendChild(root)
    }
  }

  function draw(chart) {
    render(renderComponent(chart), root)
  }

  return {draw, mount}
}
