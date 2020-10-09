import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    children: PropTypes.node,
}

const defaultProps ={};

class Footer extends React.Component {
    render() {
        return (
            <React.Fragment>
                {/* <span>&copy; 2019 </span> */}
                <span className="ml-auto">Powered by <a href="http://10.32.0.14/">IT ADDA</a> &copy; 2020</span>
            </React.Fragment>
        )
    }
}

Footer.propTypes = propTypes;
Footer.defaultProps =defaultProps;

export default Footer