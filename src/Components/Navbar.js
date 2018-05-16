import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../style/Navbar.css'

class Navbar extends Component {

    static defaultProps= {
        onShowForm(){}
    };

    static propTypes={
        onShowForm: PropTypes.func,
        onStop: PropTypes.func
    };
    render() {
        return (
            <div id="main-toolbar" className="toolbar">
                <button className="toolbutton" id="activity-button" title="My Activity"/>
                <button className="toolbutton" id="add-button" onClick={this.props.onShowForm} title="Add Recipe"/>
                <button className="toolbutton" id="network-button" title="Network"/>
                <button className="toolbutton pull-right" id="stop-button" title="Stop" onClick={this.props.onStop}/>
            </div>
        );
    }
}

export default Navbar;