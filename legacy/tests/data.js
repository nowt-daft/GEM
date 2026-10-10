import { log as print } from 'console';

import Division from './models/division.js';
import Venue from './models/venue.js';
import Team from './models/team.js';
import Player from './models/player.js';

import Fixture from './models/fixtures/fixture.js';
import FixtureTeam from './models/fixtures/fixtureteam.js';

import Frame from './models/fixtures/frame.js';
import FramePlayer from './models/fixtures/frameplayer.js';

const LENGTH = 50;
const GAP = 4;

const SPACE = ' ';

const start_timer = (
	start = Date.now()
) => {
	return (
		now = Date.now()
	) => {
		print(now - start, 'ms', '\n');
		start = now;
	}
}

const print_line =
	() =>
		print(
			'-'.repeat(LENGTH)
		);

const render_left =
	(
		text = '',
		right_text = ''
	) =>
		text +
			SPACE.repeat(
				LENGTH / 2 -
				text.length -
				right_text.length -
				GAP / 2
			) + right_text;

const render_right =
	(
		text = '',
		left_text = ''
	 ) =>
		left_text +
			SPACE.repeat(
				LENGTH / 2 -
				text.length -
				left_text.length -
				GAP / 2
			) + text;

const print_timer =
	start_timer();

FramePlayer.collection.listen(
	collection => {
		print_timer();
		const fixture = Fixture.get(0);
		const [ home_score, away_score ] = fixture.score.toArray();
		print_timer();
		print_line();
		print(
			render_left(
				fixture.home_team.name,
				String(home_score)
			),
			'-',
			render_right(
				fixture.away_team.name,
				String(away_score)
			)
		);
		print_line();
		for (const frame of fixture.frames) {
			const players = frame.players.select(
				({ player, point }) => {
					return {
						player,
						point
					}
				}
			);

			print(
				players
					.map(
						({
							player: { callname },
							point
						}, index) => {
							return index === 0 ?
								render_left(
									callname,
									String(point)
								) :
								render_right(
									callname,
									String(point)
								);
						}
					)
					.join(' - ')
			);
		}
		print_line();
		print_timer();
	}
);