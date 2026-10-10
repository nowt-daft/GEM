import Schema from "../../../src/io/db/schema.js";
import UInt from "../../../src/types/number/uint.js";

export default Schema.ManyToMany(
	'Frame',
	'Player',
	{
		point: UInt
	}
);