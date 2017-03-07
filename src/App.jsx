
import React from 'react';
import Body from './Body';
import Fetch from 'fetch-ponyfill';
const { fetch } = Fetch();

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
	    this.loadSettings();
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
				this.postPositions(positions)
				.then((response) => {
					action.done();
					this.loadPositions();
				});
				break;

			case "SAVE_PERSON":
				const savePerson = action.person;
				this.postPerson(savePerson)
				.then(() => this.setState({
					globalState: {
						...globalState,
						newPersons: globalState.newPersons.filter((person) => person.id !== savePerson.id),
						editablePersonIds: globalState.editablePersonIds.filter((personId) => personId !== savePerson.id),
					}
				}))
				.then(() => this.loadPersons());
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
				this.deletePerson(action.personId)
				.then(() => {
					this.loadPersons();
					this.loadPositions();
				});
				break;

			case "UPLOAD_IMAGE":
				this.uploadImage(action.file)
				.then((response) => {
					action.done(response.fileName);
				});
				break;

			case "SAVE_SETTINGS":
				this.postSettings(action.settings)
				.then(() => this.loadSettings());
				break;

			case "SEARCH":
				this.applySearch(action.searchValue);
				break;
		}
	}

	loadPositions() {
		return fetch('/positions', {
			headers: this.getHeaders(),
			credentials: 'include'
		})
		.then((response) => response.json(), (e) => alert('Error happened during loading'))
		.then((positions) => positions && this.setState({
			globalState: {
				...this.state.globalState,
				positions,
			}
		}));
	}

	postPositions(positions) {
		return fetch('/admin/positions', {
			method: 'post',
			headers: {
				...this.getHeaders(),
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(positions),
			credentials: 'include'
		})
		.then(() => true, (e) => alert('Error happened during saving'));
	}

	loadPersons() {
		return fetch('/persons', {
			headers: this.getHeaders(),
			credentials: 'include'
		})
		.then((response) => response.json(), (e) => alert('Error happened during loading'))
		.then((persons) => persons && this.setState({
			globalState: {
				...this.state.globalState,
				persons,
				highlightedPersonIds: this.filterPersonsMapIds(persons, ''),
			}
		}));
	}

	postPerson(person) {
		return fetch('/admin/person/' + person.id, {
			method: 'post',
			headers: {
				...this.getHeaders(),
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(person),
			credentials: 'include'
		})
		.then(() => true, (e) => alert('Error happened during saving'));
	}

	deletePerson(personId) {
		return fetch('/admin/person/' + personId, {
			method: 'delete',
			headers: this.getHeaders(),
			credentials: 'include'
		})
		.then(() => true, (e) => alert('Error happened during deleting'));
	}

	uploadImage(file) {
		const data = new FormData();
		data.append('file', file);
		return fetch('/admin/picture', {
			method: 'post',
			headers: this.getHeaders(),
			body: data,
			credentials: 'include'
		})
		.then((response) => response.json(), (e) => alert('Error happened during uploading'));
	}

	loadSettings() {
		return fetch('/settings', {
			headers: this.getHeaders(),
			credentials: 'include'
		})
		.then((response) => response.json(), (e) => alert('Error happened during loading'))
		.then((settings) => settings && this.setState({
			globalState: {
				...this.state.globalState,
				settings,
			}
		}));
	}

	postSettings(settings) {
		return fetch('/admin/settings', {
			method: 'post',
			headers: {
				...this.getHeaders(),
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(settings),
			credentials: 'include'
		})
		.then(() => true, (e) => alert('Error happened during saving'));
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

	applySearch(searchValue) {
		this.setState({
			globalState: {
				...this.state.globalState,
				highlightedPersonIds: this.filterPersonsMapIds(this.state.globalState.persons, searchValue),
			}
		});
	}

	filterPersonsMapIds(persons, searchValue) {
		const searchInKeys = ['lastName', 'firstName', 'email', 'nick', 'departement'];
		return persons
			.filter((person) => searchInKeys.reduce(
				(found, key) => found || (person[key] && person[key].toLowerCase().indexOf(searchValue.toLowerCase()) !== -1),
				false
			))
			.map((person) => person.id);
	}
}
App.childContextTypes = {
	dispatch: React.PropTypes.any
};
