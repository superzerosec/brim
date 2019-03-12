/* @flow */

import throttle from "lodash/throttle"

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Payload} from "../../receivers/types"
import {setAnalysis} from "../../actions/analysis"
import BaseSearch from "./BaseSearch"

export default class AnalyticSearch extends BaseSearch {
  receiveData(handler: Handler, dispatch: Dispatch) {
    const THROTTLE_DELAY = 200

    let tuples = []
    let descriptor = []

    const dispatchNow = () => {
      if (tuples.length !== 0) {
        dispatch(setAnalysis(descriptor, tuples))
        tuples = []
      }
    }

    const dispatchSteady = throttle(dispatchNow, THROTTLE_DELAY)

    handler
      .channel(0, (payload: Payload) => {
        switch (payload.type) {
          case "SearchEnd":
            dispatchSteady.cancel
            dispatchNow()
            break
          case "SearchResult":
            tuples = [...tuples, ...payload.results.tuples]
            descriptor = payload.results.descriptor
            dispatchSteady()
            break
        }
      })
      .abort(() => {
        dispatchSteady.cancel()
      })
  }
}