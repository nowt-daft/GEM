const DELAY_TIME = 15;

export default
	globalThis.requestAnimationFrame ?
		(
			callback =>
				requestAnimationFrame(
					callback
				)
		) :
		(
			callback => {
				setTimeout(
					callback,
					DELAY_TIME
				)
			}
		);
