import React  from 'react'
import PropTypes from 'prop-types';

function <%= pascalEntityName %> ({ children }) {
  return (
    <div className='<%= snakeEntityName %>-layout'>
      {children}
    </div>
  )
}

<%= pascalEntityName %>.propTypes = {
  children: PropTypes.element
}

export default <%= pascalEntityName %>
