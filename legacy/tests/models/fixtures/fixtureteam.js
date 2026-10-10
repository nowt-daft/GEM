import Schema from "../../../src/io/db/schema.js";

export default Schema.ManyToMany(
	'Fixture',
	'Team',
	{
		hosting: Boolean
	}
);