export default class GenericError extends Error {
    /**
     * @param    {string} name
     * @param    {string} description
     * @param    {Error} [cause]  The original source of the error
     */
    constructor(name: string, description: string, cause?: Error | undefined);
}
