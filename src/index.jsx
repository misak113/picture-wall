
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const initialState = {
	persons: [],
	positions: [],
	newPersons: [],
	editablePersonIds: [],
	highlightedPersonIds: [],
};

ReactDOM.render(<App initialState={initialState}/>, document.getElementById('body'));
