
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
	    this.setState({
	    	globalState: {
	    		...this.state.globalState,
	    		adminView: window.location.pathname.indexOf('/admin') === 0,
	    	}
	    });
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

			case "CANCEL_EDIT_PERSON":
				this.setState({
					globalState: {
						...globalState,
						editablePersonIds: globalState.editablePersonIds.filter((personId) => personId !== action.personId),
					}
				});
				break;

			case "DELETE_PERSON":
				this.deletePerson(action.personId);
				break;

			case "UPLOAD_IMAGE":
				this.uploadImage(action.file)
				.then((response) => {
					action.done(response.fileName);
				});
				break;
		}
	}

	loadPositions() {
		fetch('/positions', {
			headers: this.getHeaders(),
		})
		.then((response) => response.json())
		.then((positions) => this.setState({
			globalState: {
				...this.state.globalState,
				positions,
			}
		}));
	}

	postPositions(positions) {
		fetch('/admin/positions', {
			method: 'post',
			headers: {
				...this.getHeaders(),
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(positions),
		})
		.then(() => this.loadPositions())
	}

	loadPersons() {
		fetch('/persons', {
			headers: this.getHeaders(),
		})
		.then((response) => response.json())
		.then((persons) => this.setState({
			globalState: {
				...this.state.globalState,
				persons,
			}
		}));
	}

	postPerson(person) {
		fetch('/admin/person/' + person.id, {
			method: 'post',
			headers: {
				...this.getHeaders(),
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(person),
		})
		.then(() => this.loadPersons())
	}

	deletePerson(personId) {
		fetch('/admin/person/' + personId, {
			method: 'delete',
			headers: this.getHeaders(),
		})
		.then(() => this.loadPersons())
	}

	uploadImage(file) {
		const data = new FormData();
		data.append('file', file);
		return fetch('/admin/picture', {
			method: 'post',
			headers: this.getHeaders(),
			body: data,
		})
		.then((response) => response.json());
	}

	getHeaders() {
		const cookies = this.getCookies();
		return {
			'Authorization': 'Basic ' + cookies['Authorization'],
		};
	}

	getCookies() {
		return document.cookie.split(';')
		.map((cookieLine) => {
			return cookieLine.split('=').map((cookiePart) => {
				return cookiePart.trim();
			});
		})
		.filter((parts) => parts[0])
		.reduce((object, parts) => ({
			 ...object,
			 [decodeURIComponent(parts[0])]: decodeURIComponent(parts[1]),
		}), {});
	}
}
App.childContextTypes = {
	dispatch: React.PropTypes.any
};
