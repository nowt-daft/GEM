import Schema from '../../src/io/db/schema.js';

export default Schema(
	'Team',
	{
		"name*": String,

		...Schema.Join.ManyToOne(
			'Venue'
		),
		...Schema.Join.ManyToOne(
			'Division'
		),
		
		players: Schema.Join.OneToMany(
			'Player'
		)
	}
);
