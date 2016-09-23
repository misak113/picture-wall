
import React from 'react';
import Body from './Body';

export default class App extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			globalState: props.initialState
		};
	}

	getChildContext() {
		return {
			dispatch: (action) => this.dispatch(action)
		};
	}

	render() {
		return <Body globalState={this.state.globalState}/>;
	}

	dispatch(action) {
		console.log("dispatch", action);
		const globalState = this.state.globalState;
		switch (action.type) {
			case "SAVE_PERSON_POSITION":
				const positions = globalState.positions.filter((position) => position.personId !== action.position.personId);
				positions.push(action.position);
				this.setState({
					globalState: {
						...globalState,
						positions,
					}
				});
				break;
		}
	}
}
App.childContextTypes = {
	dispatch: React.PropTypes.any
};
