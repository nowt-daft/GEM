export default class Descriptor {
    /**
     * @param {boolean} enumerable    Is property visibile when iterating?
     * @param {boolean} configurable  Can we reconfigure the property?
     */
    constructor(enumerable: boolean, configurable?: boolean);
    /** @type {boolean} */
    enumerable: boolean;
    /** @type {boolean} */
    configurable: boolean;
}
