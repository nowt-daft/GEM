/**
 * @class Store
 * @extends Broadcaster<Store>
 */
export class Store extends Broadcaster<Store> {
    /**
     * @param    {string}  name
     * @param    {any}     _default=null
     */
    constructor(name: string, _default?: any);
    /**
     * @returns  {string}  Path to store file
     */
    get path(): string;
    /**
     * @returns  {string}  The name of this Store.
     */
    get name(): string;
    read(): Promise<any>;
    save(data: any): this;
    #private;
}
import { Broadcaster } from "../types/broadcaster.js";
