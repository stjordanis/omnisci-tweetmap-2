import "./styles.scss"
import {changeDimension as changeLegendDim, selectFilter, updateMode} from "./actions"
import {closeNav, closeSearch} from "../Nav/actions"
import {LANG_COLOR_MAP, langCodes, SOURCE_COLOR_MAP, QUANT_COLOR_MAP} from "../../constants"
import {changeDimension as changeMapDim} from "../MapBody/actions"
import {closeSidebar} from "../TweetSidebar/actions"
import {connect} from "react-redux"
import LegendItem from "./LegendItem/LegendItem"
import PropTypes from "prop-types"
import React from "react"

const LegendQuant = ({legend, ...props}) => {
  const colorMap = QUANT_COLOR_MAP

  // const titleize = legend.mode === "lang" ?
  //   lang => langCodes[lang].name :
  //   source => (source === "ios" ? "iOS" : capitalize(source))

  const items = legend.legendCounts.map(({item, count}) =>
    <li
      className="pointer"
      key={item}
    >
      <LegendItem
        active={true}
        color={QUANT_COLOR_MAP[item]}
        sub={String(count)}
        title={item}
      />
    </li>
  )

  return (
    <div className="legend" onClick={props.closeAll}>
      <ul>
        {/* legend title label */}
        <li className="title">
          <select onChange={props.modeUpdate} value={legend.mode}>
            <option value="origin">Source</option>
            <option value="lang">Language</option>
          </select>
        </li>

        {items}
        <div id="legendDummy" />
      </ul>
      <div className="fade" />
    </div>
  )
}

const Legend = ({legend, ...props}) => {
  const noneSelected = legend.selected.length === 0
  const colorMap = legend.mode === "lang" ?
    LANG_COLOR_MAP :
    SOURCE_COLOR_MAP

  const capitalize = source => source.charAt(0).toUpperCase() + source.slice(1)

  const titleize = legend.mode === "lang" ?
    lang => langCodes[lang].name :
    source => (source === "ios" ? "iOS" : capitalize(source))

  const items = legend.legendCounts.map(({item, count}) =>
    <li
      className="pointer"
      key={item}
      onClick={props.selectFilter(item)}
    >
      <LegendItem
        active={noneSelected || legend.selected.includes(item)}
        color={colorMap[item]}
        sub={String(count)}
        title={titleize(item)}
      />
    </li>
  )

  return (
    <div className="legend" onClick={props.closeAll}>
      <ul>
        {/* legend title label */}
        <li className="title">
          <select onChange={props.modeUpdate} value={legend.mode}>
            <option value="origin">Source</option>
            <option value="lang">Language</option>
          </select>
        </li>

        {items}
        <div id="legendDummy" />
      </ul>
      <div className="fade" />
    </div>
  )
}

const MultiLegend = (props) => (props.mapType === "points" ? <Legend {...props} /> : <div/>)

const legendCountType = PropTypes.shape({
  item: PropTypes.string,
  count: PropTypes.number
})

Legend.propTypes = {
  closeAll: PropTypes.func.isRequired,
  legendCounts: PropTypes.arrayOf(legendCountType).isRequired,
  mode: PropTypes.string.isRequired,
  modeUpdate: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectFilter: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  legend: state.legend,
  mapType: state.mapBody.chartType
})

const mapDispatchToProps = dispatch => ({
  closeAll: () => {
    dispatch(closeNav)
    dispatch(closeSearch)
    dispatch(closeSidebar)
  },
  modeUpdate: event => {
    const value = event.target.value
    dispatch(updateMode(value))
    dispatch(changeLegendDim(value))
    dispatch(changeMapDim(value))
  },
  selectFilter: item => () => dispatch(selectFilter(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(MultiLegend)
