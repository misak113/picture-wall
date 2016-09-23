
import React from 'react';
import Cards from './Cards';

export default class Body extends React.Component {

	render() {
		return <Cards persons={this.props.globalState.persons} positions={this.props.globalState.positions}/>;
	}
}
