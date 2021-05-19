import { Table, Card, Modal, Spin } from "antd";
import cls from "./PastInquiry.module.scss";
import PastInquiryForm from "./PastInquiryForm";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { setFilteredList } from "../../store/actions/globalAction";
import {
  fetchPastInquiry,
  setIsDetailModalShow,
  fetchDetailById,
} from "../../store/actions/pastInquiryAction";

const PastInquiry = () => {
  const { global, pastInquiry } = useSelector((state: any) => ({
    global: state.root,
    pastInquiry: state.pastInquiryReducer,
  }));
  const {
    pastInquiryResult,
    form: formData,
    detail,
  } = pastInquiry;
  const columns = [
    {
      title: "日期",
      key: "date",
      render: (text: any, record: any, index: any) =>
        dayjs(record.date).format("MM-DD HH:mm:ss"),
    },
    {
      title: "来源",
      dataIndex: "origin_name",
      key: "origin_name",
    },
    {
      title: "标题",
      key: "title",
      render: (text: any, record: any, index: any) => (
        <a href={record.url} target="_blank" rel="noreferrer">
          {record.title ? (
            record.title + (record.subTitle ? " " + record.subTitle : "")
          ) : (
            <span style={{ color: "#888" }}>（无标题）</span>
          )}
        </a>
      ),
    },
    {
      title: "作者",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "编辑",
      dataIndex: "editorName",
      key: "editorName",
    },
    {
      title: "分类",
      key: "nlpClassify",
      render: (text: any, record: any, index: any) =>
        record.nlpClassify &&
        record.nlpClassify.length &&
        record.nlpClassify[0].name,
    },
    {
      title: "栏目",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "关键词",
      key: "keywords",
      render: (text: any, record: any, index: any) =>
        record.keywords.join(", "),
    },
    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any, index: any) => (
        <span
          style={{ cursor: "pointer", color: "#66f" }}
          onClick={() => fetchDetailById(record._id)}
        >
          预览
        </span>
      ),
    },
  ];
  const rowSelection = {
    selectedRowKeys: global.filteredList,
    onSelect: (record: any, selected: any, selectedRows: any) => {
      setFilteredList(record._id);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      changeRows.length &&
        changeRows.forEach((i: any) => setFilteredList(i._id));
    },
  };
  const pagination = {
    current: pastInquiryResult.pagination.current,
    total: pastInquiryResult.pagination.total,
    pageSize: pastInquiryResult.pagination.pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: any, range: any) =>
      `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ["10", "20", "30"],
    onChange: (page: any, pageSize: any) =>
      fetchPastInquiry(
        formData.origin.value.join(","),
        new Date(formData.rangeTimePicker.value[0]),
        new Date(formData.rangeTimePicker.value[1]),
        formData.keyword.value,
        page || 1,
        pageSize || 20
      ),
    onShowSizeChange: (page: any, pageSize: any) =>
      fetchPastInquiry(
        formData.origin.value.join(","),
        new Date(formData.rangeTimePicker.value[0]),
        new Date(formData.rangeTimePicker.value[1]),
        formData.keyword.value,
        page || 1,
        pageSize || 20
      ),
  };

  return (
    <div className={cls.pastInquiry}>
      {/*query form*/}
      <PastInquiryForm />

      {/*search result*/}
      <Card>
        <Table
          columns={columns}
          rowSelection={rowSelection}
          rowKey={(record) => record._id}
          pagination={pagination}
          dataSource={pastInquiryResult.list}
        />
      </Card>

      {/*detail modal*/}
      {pastInquiry.isDetailModalShow && (
        <Modal
          title="预览详情"
          visible={true}
          footer=""
          width="70%"
          onCancel={() => setIsDetailModalShow(false)}
        >
          <Spin spinning={pastInquiry.isDetailFetching} size="large">
            <div dangerouslySetInnerHTML={{ __html: detail.content }} />
          </Spin>
        </Modal>
      )}
    </div>
  );
};

export default PastInquiry;
