import { useState } from "react";
import { Card, Badge, Spin } from "antd";
import cls from "./MonitorCard.module.scss";
import "fixed-data-table-2/dist/fixed-data-table.min.css";

type Props = {
  origin_key: string;
  origin_name: string;
  list: Array<{
    title: string;
    url: string;
    origin_key: string; //来源
    date: Date;
  }>;
  isFetched: boolean;
};

const MonitorCard = (props: Props) => {
  const [state, setState] = useState<{
    mouseEnter: boolean;
    list: Props["list"];
  }>({
    mouseEnter: false,
    list: [],
  });

  return (
    <Card
      className={cls.monitorCard}
      title={
        <div>
          {props.origin_name}
          <span
            className={cls.power}
            style={{ backgroundColor: state.mouseEnter ? "#e33" : "#3e3" }}
          />
        </div>
      }
      extra={
        <div>
          <Badge
            count={props.list.length}
            showZero
            overflowCount={999}
            style={{ backgroundColor: "#fff", color: "#999" }}
          />
          <i className={cls.iconMove + " move-cursor"} title="Move" />
        </div>
      }
    >
      <Spin spinning={!props.isFetched}>
        <div
          onMouseEnter={() => setState({ mouseEnter: true, list: props.list })}
          onMouseLeave={() => setState({ mouseEnter: false, list: [] })}
        >
          {props.list.length ? null : <div className={cls.empty}>暂无数据</div>}
        </div>
      </Spin>
    </Card>
  );
};

export default MonitorCard;
