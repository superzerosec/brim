import React from "react"
import moment from "moment"
import LogCell, {TsCell} from "./LogCell"

const exclude = {
  uid: true,
  ts: true,
  fuid: true
}

export default class LogRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.style.top !== this.props.style.top
  }

  render() {
    const {log, style, showDetail, appendToQuery, prevLog} = this.props
    const ts = moment(log.cast("ts"))
    let tsHighlight = true
    if (prevLog) {
      const prevTs = moment(prevLog.cast("ts"))
      tsHighlight = !ts
        .clone()
        .endOf("minute")
        .isSame(prevTs.endOf("minute"))
    }

    const cells = [
      <TsCell
        key="ts"
        ts={ts}
        highlight={tsHighlight}
        onClick={() => showDetail(log)}
      />
    ]

    for (let index = 1; index < log.tuple.length; index++) {
      const {name, value, type} = log.getFieldAt(index)
      if (exclude[name]) continue
      cells.push(
        <LogCell
          key={index}
          appendToQuery={appendToQuery}
          name={name}
          type={type}
          value={value}
        />
      )
    }

    return (
      <div className="log-row" style={style}>
        {cells}
      </div>
    )
  }
}