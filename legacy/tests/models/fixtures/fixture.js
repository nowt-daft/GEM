import { log as print } from 'console';
import Schema from "../../../src/io/db/schema.js";

export class Score {
	home = 0;
	away = 0;

	constructor(
		home,
		away
	) {
		Object.assign(
			this,
			{
				home,
				away
			}
		);
	}

	toArray() {
		return [
			this.home,
			this.away
		];
	}

	toString() {
		 return this.toArray().join(' - ');
	}
}

export default Schema(
	'Fixture',
	{
		"date*": Date,
		
		frames: Schema.Join.OneToMany(
			'Frame'
		),
		teams: Schema.Join.ManyToMany(
			'Team'
		),

		home_team: Schema.Get(
			'Team',

			fixture => fixture.teams.query(
				through => through.hosting
			)[0]
		),

		away_team: Schema.Get(
			'Team',

			fixture => fixture.teams.query(
				through => !through.hosting
			)[0]
		),
		
		venue: Schema.Get(
			'Venue',

			fixture => fixture.home_team.venue
		),

		score: Schema.Get(
			Score,
			
			fixture => {
				const {
					home_team,
					away_team
				} = fixture;

				const [
					home,
					away
				] = [
					fixture.frames.query(
						frame =>
							frame.winner.team == home_team
					),
					fixture.frames.query(
						frame => frame.winner.team == away_team
					)
				].map(
					frames => frames.length
				);

				return new Score(
					home,
					away
				);
			}
		)
	}
);
