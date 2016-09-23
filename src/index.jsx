
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const initialState = {
	persons: [
		{
			id: 1,
			firstName: "Michael",
			lastName: "Žabka",
			nick: "Mišák",
			departement: "it",
			profilePicture: "mz.jpg",
		},
		{
			id: 2,
			firstName: "Vašek",
			lastName: "Chromický",
			nick: "Vašek Ch.",
			departement: "it",
			profilePicture: "vch.jpg",
		},
		{
			id: 3,
			firstName: "Jan",
			lastName: "Machala",
			nick: "Masala",
			departement: "it",
			profilePicture: "jm.jpg",
		},
	],
	positions: [],
};

ReactDOM.render(<App initialState={initialState}/>, document.getElementById('body'));
