
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Body from './Body';

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
	],
	positions: [
		{
			personId: 1,
			left: 90,
			top: 46
		},
		{
			personId: 2,
			left: 90,
			top: 20
		},
	],
};

ReactDOM.render(<Body state={initialState}/>, document.getElementById('body'));
