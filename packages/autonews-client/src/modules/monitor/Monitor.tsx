import { useSelector, useDispatch } from "react-redux";
import cls from "./Monitor.module.scss";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { setLayouts, setFilteredList } from "src/store/actions/globalAction";
import { fetchMonitor } from "src/store/actions/monitorAction";
import MonitorCard from "./MonitorCard/MonitorCard";
import { useEffect } from "react";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {};

const MonitorComponent = (props: Props) => {
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.root);

  useEffect(() => {
    dispatch(fetchMonitor());
  }, [dispatch]);

  return (
    <div className={cls.monitor}>
      {/*monitor dashboard*/}
      <ResponsiveReactGridLayout
        className={cls.rowMargin}
        draggableHandle=".move-cursor"
        layouts={store.userSetting.layouts}
        breakpoints={store.gridLayoutConfig.breakpoints}
        cols={store.gridLayoutConfig.gridCols}
        onLayoutChange={(layout, layouts) => dispatch(setLayouts(layouts))}
      >
        {store.userSetting.originKeys.map((item: any, index: any) => {
          return (
            <div key={index} className={cls.layoutContent}>
              <MonitorCard
                {...store.newsList[item]}
                origin_key={item}
                filteredList={store.filteredList}
                setFilteredList={setFilteredList}
                showSentimentInspector={
                  store.userSetting.showSentimentInspector
                }
              />
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default MonitorComponent;
