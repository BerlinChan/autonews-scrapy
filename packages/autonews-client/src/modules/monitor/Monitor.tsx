import { useSelector, useDispatch } from "react-redux";
import cls from "./Monitor.module.scss";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { setLayouts, setFilteredList } from "src/store/actions/globalAction";
import MonitorCard from "./MonitorCard/MonitorCard";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {
  monitor: any;
  global: any;
  newsList: object;
};

const MonitorComponent = ({ monitor, global, newsList }: Props) => {
  // const gridLayoutConfig = global.gridLayoutConfig;
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.root);
  console.log("🚀 ~ file: Monitor.tsx ~ line 26 ~ store", store);

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
