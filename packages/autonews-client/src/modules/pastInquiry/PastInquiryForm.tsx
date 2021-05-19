import dayjs from "dayjs";
import { Row, Col, Form, Input, DatePicker, Select, Button } from "antd";
import { useSelector } from "react-redux";
import { fetchPastInquiry } from "../../store/actions/pastInquiryAction";

const PastInquiryForm = () => {
  const { origin } = useSelector((state: any) => state.root);

  const handleSubmit = (values: any) => {
    fetchPastInquiry(
      values.origin.join(","),
      new Date(values.rangeTimePicker[0]),
      new Date(values.rangeTimePicker[1]),
      values.keyword,
      1,
      20
    );
  };

  return (
    <Form
      initialValues={{
        origin: [],
        rangeTimePicker: [
          dayjs(dayjs().format("YYYY-MM-DD")),
          dayjs(dayjs().add(1, "day").format("YYYY-MM-DD")),
        ],
        keyword: "",
      }}
      onFinish={handleSubmit}
    >
      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="origin"
            rules={[{ required: true, message: "请选择来源" }]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="来源"
            >
              {origin.map((item: any, index: any) => (
                <Select.Option key={index} value={item.key}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={7} offset={1}>
          <Form.Item
            name="rangeTimePicker"
            label=""
            rules={[
              { type: "array", required: true, message: "请选择日期范围" },
            ]}
          >
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={4} offset={1}>
          <Form.Item name="keyword">
            <Input placeholder="标题关键词" />
          </Form.Item>
        </Col>

        <Col
          span={2}
          offset={1}
          style={{ marginBottom: "16px", textAlign: "right" }}
        >
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            搜索
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PastInquiryForm;
