import React, { Component } from "react";
import PropTypes from "prop-types";
import cls from "./Monitor.scss";
import MonitorCard from "./widgets/MonitorCard/MonitorCard";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Monitor extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    newsList: PropTypes.object,
    origin: PropTypes.array,
  };

  componentDidMount() {
    this.props.fetchMonitor();
  }

  componentWillUnmount() {
    this.props.onDestroy();
  }

  render() {
    const { monitor, global, setLayouts, setFilteredList } = this.props;
    const gridLayoutConfig = global.toJS().gridLayoutConfig;

    return (
      <div className={cls.monitor}>
        {/*monitor dashboard*/}
        <ResponsiveReactGridLayout
          className={cls.rowMargin}
          draggableHandle=".move-cursor"
          layouts={global.toJS().userSetting.layouts}
          breakpoints={gridLayoutConfig.breakpoints}
          cols={gridLayoutConfig.gridCols}
          onLayoutChange={(layout, layouts) => setLayouts(layouts)}
        >
          {global
            .getIn(["userSetting", "originKeys"])
            .toJS()
            .map((item, index) => {
              return (
                <div key={item} className={cls.layoutContent}>
                  <MonitorCard
                    {...global.toJS().newsList[item]}
                    origin_key={item}
                    filteredList={global.get("filteredList").toJS()}
                    setFilteredList={setFilteredList}
                    showSentimentInspector={global.getIn([
                      "userSetting",
                      "showSentimentInspector",
                    ])}
                  />
                </div>
              );
            })}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

Monitor.defaultProps = {
  newsList: {},
  origin: [],
};

export default Monitor;
