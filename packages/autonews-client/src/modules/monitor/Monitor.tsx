import cls from "./Monitor.module.scss";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type Props = {
  monitor: any;
  global: any;
  setLayouts: any;
  setFilteredList: any;
  newsList: object;
};

const MonitorComponent = ({
  monitor,
  global,
  setLayouts,
  setFilteredList,
  newsList,
}: Props) => {
  // const gridLayoutConfig = global.gridLayoutConfig;

  return (
    <div className={cls.monitor}>
      {/*monitor dashboard*/}
      <ResponsiveReactGridLayout
        className={cls.rowMargin}
        draggableHandle=".move-cursor"
        // layouts={global.userSetting.layouts}
        // breakpoints={gridLayoutConfig.breakpoints}
        // cols={gridLayoutConfig.gridCols}
        onLayoutChange={(layout, layouts) => setLayouts(layouts)}
      >
        {/* {global.userSetting.originKeys.map((item, index) => {
          return (
            <div key={item} className={cls.layoutContent}>
              <MonitorCard
                {...global.newsList[item]}
                origin_key={item}
                filteredList={global.filteredList}
                setFilteredList={setFilteredList}
                showSentimentInspector={
                  global.userSetting.showSentimentInspector
                }
              />
            </div>
          );
        })} */}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default MonitorComponent;
