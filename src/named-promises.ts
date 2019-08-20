declare namespace NamedPromise
{
	interface NamedPromiseStore
	{
		[promiseName: string]: NamedPromiseStoreEntry
	}

	interface NamedPromiseStoreEntry
	{
		promise: Promise<unknown>
		resolve: (value?: unknown | PromiseLike<unknown>) => void
		reject: (reason?: any) => void
		namedPromiseCreated: boolean
	}
}

/**
 * @classdesc Adds the ability to give a promise a name so it can be waited on without passing stuff around or keeping it in the global scope
 */
export class NamedPromise<T> extends Promise<T>
{
	/**
	 * Holds all the named promise info
	 */
	private static namedPromiseStore: NamedPromise.NamedPromiseStore = {};

	/**
	 * @param executor A callback used to initialize the promise. This callback is passed two arguments: a resolve callback used to resolve the promise with a value or the result of another promise, and a reject callback used to reject the promise with a provided reason or error.
	 * @description Creates the promise part of the named promise
	 */
	constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void)
	{
		super(executor);
		return;
	}

	/**
	 * name of the promise
	 */
	get name(): string
	{
		return this.name;
	}
	set name(name)
	{
		// Check and normalize parameters
		if ('string' !== typeof name)
		{
			throw new Error('name must be a string');
		}
		if (NamedPromise.IsCreated(name))
		{
			throw new Error('Promise with name ' + name + ' already exists');
		}

		if ('object' !== typeof (NamedPromise.namedPromiseStore[name]))
		{
			NamedPromise.CreateNamedPromise(name);
		}
		NamedPromise.namedPromiseStore[name].namedPromiseCreated = true;
		this
			.then((result: unknown) =>
			{
				NamedPromise.namedPromiseStore[name].resolve(result);
				return;
			})
			.catch((err: unknown) =>
			{
				NamedPromise.namedPromiseStore[name].reject(err);
				return;
			});
		return;
	}

	/**
	 * @param name name of the promise
	 * @return the new named promise
	 * @description Creates the internal structure for the named promise
	 */
	private static CreateNamedPromise(name: string): Promise<unknown>
	{
		let tempObject: Partial<NamedPromise.NamedPromiseStoreEntry> = {};

		if ("object" === (typeof NamedPromise.namedPromiseStore[name]))
		{
			throw new Error('Promise with name ' + name + ' already exists');
		}

		tempObject.promise = new Promise(function SettleNamedPromise(resolve, reject)
		{
			tempObject.resolve = resolve;
			tempObject.reject = reject;
			return;
		});
		tempObject.namedPromiseCreated = false;

		NamedPromise.namedPromiseStore[name] = tempObject as NamedPromise.NamedPromiseStoreEntry;
		return NamedPromise.namedPromiseStore[name].promise;
	}

	/**
	 * @param name name of the promise
	 * @returns Returns the named promise
	 * @description Gets a named promise even if it has not been created yet.
	 */
	public static GetNamedPromise(name: string): Promise<unknown>
	{
		let tempPromise: Promise<unknown>;

		/**
			 * Check and normalize parameters
			 */
		if ('string' !== typeof name)
		{
			throw new Error('Name is not a string. name = ' + JSON.stringify(name));
		}

		if ('object' !== typeof (NamedPromise.namedPromiseStore[name]))
		{
			tempPromise = NamedPromise.CreateNamedPromise(name);
		}
		else
		{
			tempPromise = NamedPromise.namedPromiseStore[name].promise;
		}

		return tempPromise;
	}

	/**
	 * @param name name of the promise
	 * @returns True if the promise has been created else false
	 * @description Tests if the named promise has been created
	 */
	public static IsCreated(name: string): boolean
	{
		/**
		 * Check and normalize parameters
		 */
		if ('string' !== typeof name)
		{
			throw new Error('Name is not a string. name = ' + JSON.stringify(name));
		}

		if ('object' === typeof (NamedPromise.namedPromiseStore[name]) &&
			true === NamedPromise.namedPromiseStore[name].namedPromiseCreated)
		{
			return true;
		}
		return false;
	}
}
