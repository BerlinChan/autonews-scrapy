import React,{Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';

class  <%= pascalEntityName %> extends Component
{
  constructor(props) {
      super(props);
  }

  static propTypes = {};

  componentDidMount()
  {
  this.props.fetch<%= pascalEntityName %>();
  }

  render()
  {
    return(
      <div>
   hello <%= pascalEntityName %>
      </div>
    )
  }
}

<%= pascalEntityName %>.defaultProps = {};

export default <%= pascalEntityName %>
