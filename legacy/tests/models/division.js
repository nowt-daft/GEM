import Schema from "../../src/io/db/schema.js";

export default Schema(
	'Division',
	{
		name: String,
		teams: Schema.Join.OneToMany(
			'Team'
		)
	}
);