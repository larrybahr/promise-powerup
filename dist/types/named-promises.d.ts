/**
 * @classdesc Adds the ability to give a promise a name so it can be waited on without passing stuff around or keeping it in the global scope
 */
export declare class NamedPromise<T> extends Promise<T> {
    private _name;
    /**
     * Holds all the named promise info
     */
    private static namedPromiseStore;
    /**
     * @param executor A callback used to initialize the promise. This callback is passed two arguments: a resolve callback used to resolve the promise with a value or the result of another promise, and a reject callback used to reject the promise with a provided reason or error.
     * @description Creates the promise part of the named promise
     */
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    /**
     * name of the promise
     */
    name: string | undefined;
    /**
     * @param name name of the promise
     * @return the new named promise
     * @description Creates the internal structure for the named promise
     */
    private static CreateNamedPromise;
    /**
     * @param name name of the promise
     * @returns Returns the named promise
     * @description Gets a named promise even if it has not been created yet.
     */
    static GetNamedPromise(name: string): Promise<unknown>;
    /**
     * @param name name of the promise
     * @returns True if the promise has been created else false
     * @description Tests if the named promise has been created
     */
    static IsCreated(name: string): boolean;
}
