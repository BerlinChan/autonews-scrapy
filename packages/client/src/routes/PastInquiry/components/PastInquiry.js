import React, {Component} from 'react'
import {Table, Card, Modal, Spin} from 'antd';
import cls from './PastInquiry.scss'
import PastInquiryForm from './PastInquiryForm'
import moment from 'moment'

class PastInquiry extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};

  componentDidMount() {
  }

  componentWillUnmount() {
    this.props.onDestroy();
  }

  render() {
    const {global, pastInquiry, setFilteredList} = this.props;
    const pastInquiryResult = pastInquiry.get('pastInquiryResult').toJS();
    const formData = pastInquiry.get('form').toJS();
    const detail = pastInquiry.get('detail').toJS();
    const columns = [
      {
        title: '日期',
        key: 'date',
        render: (text, record, index) => moment(record.date).format('MM-DD HH:mm:ss'),
      },
      {
        title: '来源',
        dataIndex: 'origin_name',
        key: 'origin_name',
      },
      {
        title: '标题',
        key: 'title',
        render: (text, record, index) => <a href={record.url} target="_blank">
          {record.title ?
            (record.title + (record.subTitle ? ' ' + record.subTitle : '')) :
            <span style={{color: '#888'}}>（无标题）</span>}
        </a>,
      },
      {
        title: '作者',
        dataIndex: 'authorName',
        key: 'authorName',
      },
      {
        title: '编辑',
        dataIndex: 'editorName',
        key: 'editorName',
      },
      {
        title: '分类',
        key: 'nlpClassify',
        render: (text, record, index) => record.nlpClassify && record.nlpClassify.length && record.nlpClassify[0].name
      },
      {
        title: '栏目',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '关键词',
        key: 'keywords',
        render: (text, record, index) => record.keywords.join(', ')
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record, index) =>
          <span style={{cursor: 'pointer', color: '#66f'}}
                onClick={() => this.props.fetchDetailById(record._id)}>预览</span>,
      },
    ];
    const rowSelection = {
      selectedRowKeys: global.get('filteredList').toJS(),
      onSelect: (record, selected, selectedRows) => {
        setFilteredList(record._id);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        changeRows.length && changeRows.forEach(i => setFilteredList(i._id));
      },
    };
    const pagination = {
      current: pastInquiryResult.pagination.current,
      total: pastInquiryResult.pagination.total,
      pageSize: pastInquiryResult.pagination.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      pageSizeOptions: ['10', '20', '30'],
      onChange: (page, pageSize) => this.props.fetchPastInquiry(formData.origin.value.join(','), new Date(formData.rangeTimePicker.value[0]), new Date(formData.rangeTimePicker.value[1]), formData.keyword.value, page || 1, pageSize || 20),
      onShowSizeChange: (page, pageSize) => this.props.fetchPastInquiry(formData.origin.value.join(','), new Date(formData.rangeTimePicker.value[0]), new Date(formData.rangeTimePicker.value[1]), formData.keyword.value, page || 1, pageSize || 20),
    };

    return (
      <div className={cls.pastInquiry}>
        {/*query form*/}
        <PastInquiryForm origins={global.get('origin').toJS()}
                         fetchPastInquiry={this.props.fetchPastInquiry}
                         setFormValue={this.props.setFormValue}
                         query={this.props.location.query}/>

        {/*search result*/}
        <Card>
          <Table columns={columns} rowSelection={rowSelection}
                 rowKey={(record) => record._id} pagination={pagination}
                 dataSource={pastInquiryResult.list}/>
        </Card>

        {/*detail modal*/}
        {pastInquiry.get('isDetailModalShow') &&
        <Modal title="预览详情" visible={true} footer="" width='70%'
               onCancel={() => this.props.setIsDetailModalShow(false)}>
          <Spin spinning={pastInquiry.get('isDetailFetching')} size="large">
            <div dangerouslySetInnerHTML={{__html: detail.content}}/>
          </Spin>
        </Modal>}
      </div>
    );
  }
}

PastInquiry.defaultProps = {};

export default PastInquiry
