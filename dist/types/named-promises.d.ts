/**
 * @classdesc Adds the ability to give a promise a name so it can be waited on without passing stuff around or keeping it in the global scope
 */
export declare class NamedPromise<T> extends Promise<T> {
    /**
     * Holds all the named promise info
     */
    private static namedPromiseStore;
    /**
     * @param {string} strName - Name of the event (must be unique)
     * @returns {Promise<any> | undefined} - Should be resolved by the creator when the event is done. Undefined on error
     * @description Creates a promise for the event name. Returns the promise for the event that should be resolved when it is completed
     */
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    name: string;
    private static CreateNamedPromise;
    /**
     * @param {string[]} names - List of event Names
     * @returns {Promise<any>} - Returns a promise that will resolve when all events are done
     * @description Get an promise that will resolve when a group of events completes. Creates any events that have not yet been created.
     */
    static Get(names: string[]): Promise<any>;
    /**
     * @param {string} name - Name of the event (must be unique)
     * @returns {boolean} - True if the event has been created else false
     * @description Tests if the named event has been created
     */
    static IsCreated(name: string): boolean;
}
