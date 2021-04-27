/**
 * Created by berlin on 2017/3/9.
 */

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {Card, Badge, Spin, Checkbox} from 'antd';
import moment from 'moment';
import cls from './MonitorCard.scss'
import  {Table, Column, Cell}  from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.min.css'
import Dimensions from 'react-dimensions'

const CheckboxCell = ({rowIndex, data, col, ...props}) => (
  <Cell>
    <Checkbox onChange={(e) => props.setFilteredList(data[rowIndex]._id)}
              checked={props.filteredList.findIndex(i => i === data[rowIndex]._id) > -1}/>
  </Cell>
);

const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {moment(data[rowIndex].date).format('MM-DD HH:mm:ss')}
  </Cell>
);

const TitleCell = ({rowIndex, data, col, ...props}) => {
  const record = data.list[rowIndex];
  const showSentimentInspector = data.showSentimentInspector;
  const inspector = (sentiment) => {
    if ((sentiment !== null || sentiment !== undefined) && showSentimentInspector) {
      let width = Math.abs(sentiment - .5) * 100 + '%';
      return (
        <div className={cls.inspector}>
          <div className={sentiment >= .5 ? cls.positive : cls.negative}
               style={{width}}/>
        </div>
      );
    }
  };

  return (
    <Cell {...props}>
      <a href={record.url} target="_blank">
        {record.title ?
          (record.title + (record.subTitle ? (' ' + record.subTitle) : '')) :
          <span style={{color: '#888'}}>（无标题）</span>
        }</a>
      {inspector(record.nlpSentiment)}
    </Cell>
  )
};

class MonitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseEnter: false,
      listSnap: [],
    };
  }

  static propTypes = {
    origin_key: PropTypes.string,
    origin_name: PropTypes.string.isRequired,
    list: PropTypes.array,
    isFetched: PropTypes.bool,
  };

  render() {

    return (
      <Card className={cls.monitorCard}
            title={<div>
              {this.props.origin_name}
              <span className={cls.power} style={{backgroundColor: this.state.mouseEnter ? '#e33' : '#3e3'}}/>
            </div>}
            extra={<div>
              <Badge count={this.props.list.length} showZero overflowCount={999}
                     style={{backgroundColor: '#fff', color: '#999'}}/>
              <i className={cls.iconMove + ' move-cursor'} title="Move"/>
            </div>
            }>
        <Spin spinning={!this.props.isFetched}>
          <div onMouseEnter={() => this.setState({mouseEnter: true, listSnap: this.props.list})}
               onMouseLeave={() => this.setState({mouseEnter: false, listSnap: []})}>
            {this.props.list.length ?
              <Table touchScrollEnabled={true}
                     headerHeight={24} rowHeight={32}
                     rowsCount={this.props.list.length}
                     width={this.props.containerWidth}
                     height={this.props.containerHeight - 48}
                     {...this.props}>
                {this.state.mouseEnter &&
                <Column
                  cell={<CheckboxCell
                    data={this.state.mouseEnter ? this.state.listSnap : this.props.list} col="date"
                    setFilteredList={this.props.setFilteredList}
                    filteredList={this.props.filteredList}/>}
                  width={30}
                />}
                <Column
                  header={<Cell className={cls.tableHeader}>日期</Cell>}
                  cell={<DateCell data={this.state.mouseEnter ? this.state.listSnap : this.props.list} col="date"/>}
                  width={.28 * this.props.containerWidth - (this.state.mouseEnter ? 30 : 0)}
                />
                <Column
                  header={<Cell className={cls.tableHeader}>标题</Cell>}
                  cell={<TitleCell col="title"
                                   data={{
                                     list: this.state.mouseEnter ? this.state.listSnap : this.props.list,
                                     showSentimentInspector: this.props.showSentimentInspector
                                   }}/>}
                  width={.72 * this.props.containerWidth}
                />
              </Table> :
              <div className={cls.empty}>暂无数据</div>}
          </div>
        </Spin>
      </Card>
    );
  }
}

MonitorCard.defaultProps = {
  origin_key: '',
  origin_name: '楚天都市报',
  list: [
    {
      title: 'title',
      url: 'url',
      origin_key: 'origin',//来源
      date: new Date(),
    },
  ]
};

export default Dimensions({elementResize: true})(MonitorCard);
