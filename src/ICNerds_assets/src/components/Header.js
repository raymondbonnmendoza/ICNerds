import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'

const Header = ({ title, onConnect, connected }) => {
  return (
    <header className='header'>
        <h1>{title}</h1>
        <Button color={connected ? 'red' : 'green'} 
          text={connected ? 'Disconnect' : 'Connect'} 
          onClick={onConnect} />
    </header>
  )
}

Header.defaultProps = {
    title: 'ICNerds',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

// CSS in JS
//<h1 style={headingStyle}> {title}</h1>
//const headingStyle = {
//    color: 'red',
//    backgroundColor: 'black'  
//}

export default Header