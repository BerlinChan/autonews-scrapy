/**
 * Created by berlin on 2017/4/8.
 */
import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {Row, Col, Form, Input, Select, Button, Transfer, Popconfirm, Switch} from 'antd';
const FormItem = Form.Item;

const validate = (values) => {
  const errors = {};
  values.selectedOriginKeys.length === 0 && (errors.selectedOriginKeys = '至少选择一个监控对象');
  values.selectedOriginKeys.length > 8 && (errors.selectedOriginKeys = '最多能选择8项');

  return errors;
};

const TransferField = ({input, required, dataSource, label, labelSpan, wrapperSpan, meta: {touched, error}}) => {
  return (
    <FormItem label={label}
              labelCol={{span: labelSpan === undefined ? "8" : labelSpan}}
              wrapperCol={{span: wrapperSpan === undefined ? "16" : wrapperSpan}}
              validateStatus={(touched && error) ? "error" : ""}
              help={touched && error} required={required}>
      <Transfer
        titles={['', '已选择']}
        listStyle={{width: 250, height: 300}}
        dataSource={dataSource}
        showSearch
        filterOption={(inputValue, option) => option.name.indexOf(inputValue) > -1}
        targetKeys={input.value}
        render={item => item.name}
        onChange={(targetKeys) => {
          input.onChange(targetKeys);
        }}/>
    </FormItem>
  )
};
const SwitchField = ({input, required, label, labelSpan, wrapperSpan, meta: {touched, error}}) => {
  return (
    <FormItem label={label}
              labelCol={{span: labelSpan === undefined ? "8" : labelSpan}}
              wrapperCol={{span: wrapperSpan === undefined ? "16" : wrapperSpan}}
              validateStatus={(touched && error) ? "error" : ""}
              help={touched && error} required={required}>
      <Switch checkedChildren={'开'} unCheckedChildren={'关'}
              checked={input.value}
              onChange={(checked) => {
                input.onChange(checked);
              }}/>
    </FormItem>
  )
};

class SettingForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  render() {
    const {origin, handleSubmit, submitting, onResetDefault, reset} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field name="sentimentInspector" label="情感评价指示器"
               labelSpan="3" wrapperSpan="21"
               onChange={(value) => {
                 //console.log(value);
               }}
               component={SwitchField}/>
        <Field name="selectedOriginKeys" label="监控对象"
               labelSpan="3" wrapperSpan="21"
               dataSource={origin} required={true}
               onChange={(value) => {
                 //console.log(value);
               }}
               component={TransferField}/>

        {/*buttons*/}
        <Row gutter={12}>
          <Col span={24} style={{marginBottom: '16px', textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" loading={submitting}
                    style={{marginRight: '12px'}}>保存</Button>
            <Button loading={submitting} onClick={reset}
                    style={{marginRight: '12px'}}>取消</Button>
            <Popconfirm title="确定要重置为系统默认？" okText="确定" cancelText="取消"
                        onConfirm={() => onResetDefault()}>
              <Button loading={submitting}>重置为系统默认</Button>
            </Popconfirm>
          </Col>
        </Row>
      </form>
    );
  }
}

SettingForm.defaultProps = {};

export default reduxForm({
  form: 'settingForm',
  validate,
  enableReinitialize: true,
})(SettingForm);
