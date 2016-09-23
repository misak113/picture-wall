
import React from 'react';
import Cards from './Cards';

export default class Body extends React.Component {

	render() {
		return <Cards persons={this.props.state.persons} positions={this.props.state.positions}/>;
	}
}
