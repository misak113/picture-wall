
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

	componentDidMount() {
	    this.loadPositions();  
	    this.loadPersons();  
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
				this.postPositions(positions);
				break;

			case "SAVE_PERSON":
				const savePerson = action.person;
				this.setState({
					globalState: {
						...globalState,
						newPersons: globalState.newPersons.filter((person) => person.id !== savePerson.id),
						editablePersonIds: globalState.editablePersonIds.filter((personId) => personId !== savePerson.id),
					}
				});
				this.postPerson(savePerson);
				break;

			case "ADD_PERSON":
				const newPerson = action.person;
				this.setState({
					globalState: {
						...globalState,
						newPersons: [...globalState.newPersons, newPerson],
						editablePersonIds: [...globalState.editablePersonIds, newPerson.id]
					}
				});
				break;

			case "EDIT_PERSON":
				this.setState({
					globalState: {
						...globalState,
						editablePersonIds: [...globalState.editablePersonIds, action.personId]
					}
				});
				break;
		}
	}

	loadPositions() {
		fetch('/positions')
		.then((response) => response.json())
		.then((positions) => this.setState({
			globalState: {
				...this.state.globalState,
				positions,
			}
		}));
	}

	postPositions(positions) {
		fetch('/positions', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(positions),
		})
		.then(() => this.loadPositions())
	}

	loadPersons() {
		fetch('/persons')
		.then((response) => response.json())
		.then((persons) => this.setState({
			globalState: {
				...this.state.globalState,
				persons,
			}
		}));
	}

	postPerson(person) {
		fetch('/person/' + person.id, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(person),
		})
		.then(() => this.loadPersons())
	}
}
App.childContextTypes = {
	dispatch: React.PropTypes.any
};
