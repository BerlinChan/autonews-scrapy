import React, {Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';
import cls from './Filter.scss'
import Sortable from 'sortablejs'

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {};

  componentDidMount() {
    if (this.props.global.get('filteredList').size > 0) {
      this.props.fetchFilter(this.props.global.get('filteredList').toJS());
    }
  }

  sortableContainersDecorator = (componentBackingInstance) => {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        // handle: ".group-title", // Restricts sort start click/touch to the specified element
        draggable: "li", // Specifies which items inside the element should be sortable
      };
      Sortable.create(componentBackingInstance, options);
    }
  };

  render() {
    const {global, filter} = this.props;

    return (
      <Card className={cls.filter}>
        <ul ref={this.sortableContainersDecorator} className={cls.list}>
          {filter.get('filteredList').size > 0 &&
          filter.get('filteredList').toJS().map((item, index) =>
            <li key={index}>
              <div>{index}</div>
              <div>{item.title}</div>
            </li>)
          }
        </ul>
      </Card>
    )
  }
}

Filter.defaultProps = {};

export default Filter
