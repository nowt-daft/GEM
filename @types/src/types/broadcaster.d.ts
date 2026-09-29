/**
 * @template  {any}  Message
 */
export class Broadcaster<Message extends unknown> {
    /**
     * @param  {...Listener}  listeners
     */
    constructor(...listeners: ((message: Message) => void)[]);
    /**
     * Append a callback to the Broadcast
     * @param    {Listener}  listener
     * @returns  {Broadcaster<Message>}  The current Broadcaster instance
     */
    listen(listener: (message: Message) => void): Broadcaster<Message>;
    /**
     * Remove a callback to the Broadcast
     * @param   {Listener}  listener
     * @returns {Broadcaster<Message>}  The current Broadcaster instance
     */
    unlisten(listener: (message: Message) => void): Broadcaster<Message>;
    /**
     * Broadcast a message to all listeners
     * @param    {Message}  message
     * @returns  {Broadcaster<Message>}  The current Broadcaster instance
     */
    dispatch(message: Message): Broadcaster<Message>;
    /**
     * Remove all listeners
     * @returns  {Broadcaster<Message>}  The current Broadcaster instance
     */
    kill(): Broadcaster<Message>;
    #private;
}
/**
 * @template  {any}  Message
 */
export class ChannelBroadcaster<Message extends unknown> {
    /**
     * @callback Listener
     * @param    {Message}  message
     * @returns  {void}
     */
    /** @type {string} */
    static DELIM: string;
    /**
     * @param  {...string|[string, ...Listener]}  channels
     */
    constructor(...channels: (string | [string, ...(message: Message_1) => void])[]);
    /**
     * @param    {string|symbol} channel
     * @param    {Listener}      listener
     * @returns  {ChannelBroadcaster<Message>}  The current instance.
     */
    listen(channel: string | symbol, listener: (message: Message_1) => void): ChannelBroadcaster<Message>;
    /**
     * @param    {Listener}  listener
     * @returns  {ChannelBroadcaster<Message>}  The current instance.
     */
    unlisten(channel: any, listener: (message: Message_1) => void): ChannelBroadcaster<Message>;
    /**
     * @param    {string|symbol}  channel
     * @param    {any}            message
     * @returns  {ChannelBroadcaster<Message>}  The current instance.
     */
    dispatch(channel: string | symbol, message: any): ChannelBroadcaster<Message>;
    /**
     * Remove all channels and listeners.
     * @returns  {ChannelBroadcaster<Message>}  The current instance.
     */
    kill(): ChannelBroadcaster<Message>;
    #private;
}
