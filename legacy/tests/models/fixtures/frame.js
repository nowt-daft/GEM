import { log as print } from 'console';

import Entry from "../../../src/io/db/entry.js";
import Schema from "../../../src/io/db/schema.js";

export default Schema(
	'Frame',
	{
		...Schema.Join.ManyToOne(
			'Fixture'
		),
		
		players: Schema.Join.ManyToMany(
			'Player'
		),

		winner: Schema.GetSet(
			'Player',

			frame =>
				frame.players.query(
					entry => entry.point > 0
				)[0],
			
			(frame, player) => {

				frame.players.update(
					({ player_id }) =>
						+player == player_id,
					{
						point: 1
					}
				);

				frame.players.update(
					({ player_id }) =>
						+player != player_id,
					{
						point: 0
					}
				);

			}
		)
	}
);