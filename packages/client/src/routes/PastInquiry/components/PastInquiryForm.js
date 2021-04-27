/**
 * Created by berlin on 2017/3/26.
 */

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import {Row, Col, Form, Input, DatePicker, Select, Button} from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class PastInquiryForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.fetchPastInquiry(values.origin.join(','), new Date(values.rangeTimePicker[0]), new Date(values.rangeTimePicker[1]), values.keyword, 1, 20);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={12}>
          <Col span={8}>
            {this.props.origins.length ?
              <FormItem>
                {getFieldDecorator('origin', {
                  rules: [{required: true, message: '请选择来源'}],
                  onChange: (value) => {
                  },
                })(
                  <Select style={{width: '100%'}} multiple={true} placeholder="来源">
                    {this.props.origins.map((item, index) =>
                      <Select.Option key={index} value={item.key}>{item.name}</Select.Option>)}
                  </Select>)}
              </FormItem> : null}
          </Col>

          <Col span={7} offset={1}>
            <FormItem label="">
              {getFieldDecorator('rangeTimePicker', {
                rules: [{type: 'array', required: true, message: '请选择日期范围'}],
                initialValue: [moment(moment().format('YYYY-MM-DD')), moment(moment().add({day: 1}).format('YYYY-MM-DD'))],
                onChange: (value, dateString) => {
                },
              })(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>

          <Col span={4} offset={1}>
            <FormItem>
              {getFieldDecorator('keyword', {
                rules: [{required: false}],
                onChange: (value) => {
                },
              })(<Input placeholder="标题关键词"/>)}
            </FormItem>
          </Col>

          <Col span={2} offset={1} style={{marginBottom: '16px', textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>搜索</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

PastInquiryForm.defaultProps = {};

export default Form.create({
  onFieldsChange: (props, fields) => props.setFormValue(fields),
})(PastInquiryForm);

