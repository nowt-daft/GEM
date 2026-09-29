export default class GenericEvent extends Event {
    /**
     * @param {string}  name
     * @param {object}  data
     * @param {boolean} bubbles
     * @param {boolean} cancelable
     */
    constructor(name: string, data?: object, bubbles?: boolean, cancelable?: boolean);
}
