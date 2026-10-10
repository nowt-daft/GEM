import Schema from "../../src/io/db/schema.js";

export default Schema(
	'Player',
	{
		"given_name*": String,
		"surname*": String,
		...Schema.Join.ManyToOne('Team'),

		fullname: Schema.Get(
			({ given_name, surname }) =>
				`${ given_name } ${ surname }`
		),
		callname: Schema.Get(
			({ given_name, surname }) =>
				`${ given_name[0] } ${ surname }`
					.toUpperCase()
		)
	}
);
