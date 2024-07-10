import {
	log,
	//warn,
	//error
} from "console";

const DASH = '-';
const HR_WIDTH = 40;

export const print_hr =
	message =>
		message ?
			print(
			`${ DASH.repeat(2) } ${ message } ` +
					DASH.repeat(HR_WIDTH - message.length - 4)
			) :
			print(
				DASH.repeat(HR_WIDTH)
			);

export default (...messages) => log(...messages);
