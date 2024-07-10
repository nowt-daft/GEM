const DELAY_TIME = Math.ceil(1000 / 60);

/**
 * @param {FrameRequestCallback} callback
 */
export default (
	globalThis.requestAnimationFrame ?
		callback => requestAnimationFrame(callback) :
		callback => setTimeout(callback, DELAY_TIME)
);
