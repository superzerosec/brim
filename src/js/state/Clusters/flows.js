/* @flow */

import type {Cluster} from "./types"
import type {Thunk} from "../types"
import {clearNotifications, clearSearchBar, clearStarredLogs} from "../actions"
import {clearViewer} from "../viewer/actions"
import {initSpace} from "../../flows/initSpace"
import {testConnection} from "../../services/boom"
import Errors from "../Errors"
import History from "../history"
import Spaces from "../spaces"
import handlers from "../handlers"
import search from "../search"
import tabs from "../tabs"

export function connectCluster(cluster: Cluster): Thunk {
  return function(d) {
    return d(testConnection(cluster)).then((spaces) => {
      d(Spaces.setNames(cluster.id, spaces))
      d(search.setCluster(cluster.id))
      d(initSpace("default"))
    })
  }
}

export function disconnectCluster(): Thunk {
  return function(dispatch, getState) {
    let tabId = tabs.getActive(getState())
    clearClusterState(dispatch, tabId)
    dispatch(search.setCluster(""))
  }
}

export function switchCluster(cluster: Cluster): Thunk {
  return function(dispatch, getState) {
    let tabId = tabs.getActive(getState())
    clearClusterState(dispatch, tabId)
    dispatch(search.setCluster(cluster.id))
    return dispatch(connectCluster(cluster))
  }
}

function clearClusterState(dispatch, tabId: string) {
  dispatch(clearSearchBar())
  dispatch(clearStarredLogs())
  dispatch(History.clear())
  dispatch(clearViewer(tabId))
  dispatch(handlers.abortAll())
  dispatch(Errors.clearErrors())
  dispatch(clearNotifications())
  dispatch(search.clear())
}
