
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const initialState = {
	persons: [],
	positions: [],
};

ReactDOM.render(<App initialState={initialState}/>, document.getElementById('body'));
