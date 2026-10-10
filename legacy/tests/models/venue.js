import Schema from '../../src/io/db/schema.js';

export default Schema(
	'Venue',
	{
		"name*": String,
		street: String,
		town: String,
		code: String,
		"email?": String, // should be Email
		"website?": String, // should be URL
		"facebook?": String, // should be URL
		"instagram?": String, // should be Email
		// we gotta make sure this is working properly...
		teams: Schema.Join.OneToMany('Team'),
	}
);
