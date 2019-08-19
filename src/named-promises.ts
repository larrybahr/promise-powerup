/**
 * @classdesc Adds the ability to give a promise a name so it can be waited on without passing stuff around or keeping it in the global scope
 */
class NamedPromise<T> extends  Promise<T>
{
	/**
	 * Holds all the named promise info
	 */
	private static namedPromiseStore: Object = {};

	/**
	 * @function CreateEvent
	 * @memberof CAppStatusEventManager
	 * @private
	 * @static
	 * @param {string} strName - Name of the event (must be unique)
	 * @returns {Promise<any> | undefined} - Should be resolved by the creator when the event is done. Undefined on error
	 * @description Creates a promise for the event name. Returns the promise for the event that should be resolved when it is completed
	 */
	constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void)
	{
		super(executor);
		return;
	}

	get name(): string
	{
		return this.name;
	}
	set name(name)
	{
		/**
		 * Check and normalize parameters
		 */
		if ('string' !== typeof name)
		{
			throw new Error('name must be a string');
		}
		if (true === NamedPromise.IsCreated(name))
		{
			throw new Error('Promise with name ' + name + ' already exists');
		}
		NamedPromise.CreateNamedPromise(name);
		this
		.then(function (result)
		{
			NamedPromise.namedPromiseStore[name].resolve(result);
			return;
		})
		.catch(function (err)
		{
			NamedPromise.namedPromiseStore[name].reject(err);
			return;
		});
		return;
	}

	private static CreateNamedPromise(name: string): Promise<unknown>
	{
		let namedPromise;
		let namedResolve;
		let namedReject;

		if (true === NamedPromise.IsCreated(name))
		{
			// It is already created
			return NamedPromise.namedPromiseStore[name].promise;
		}

		namedPromise = new Promise(function SettleNamedPromise(resolve, reject)
		{
			namedResolve = resolve;
			namedReject = reject;
			return;
		});
		NamedPromise.namedPromiseStore[name] = {
			promise: namedPromise,
			resolve: namedResolve,
			reject: namedReject
		};
		return namedPromise;
	}

	/**
	 * @function Get
	 * @memberof CAppStatusEventManager
	 * @public
	 * @static
	 * @param {string[]} names - List of event Names
	 * @returns {Promise<any>} - Returns a promise that will resolve when all events are done
	 * @description Get an promise that will resolve when a group of events completes. Creates any events that have not yet been created.
	 */
	public static Get(names: string[]): Promise<any>
	{
		let promiseHolder: Promise<unknown>[] = [];

		/**
		 * Check and normalize parameters
		 */
		if (false === Array.isArray(names))
		{
			throw new Error('Invalid parameter. names = ' + JSON.stringify(names));
		}

		for (let strNameKey in names)
		{
			let name = names[strNameKey];
			let tempPromise: Promise<unknown>;

			/**
			 * Check and normalize parameters
			 */
			if ('string' !== typeof name)
			{
				throw new Error('Name is not a string. name = ' + JSON.stringify(name));
			}

			if (false === NamedPromise.IsCreated(name))
			{
				tempPromise = NamedPromise.CreateNamedPromise(name);
			}
			else
			{
				tempPromise = NamedPromise.namedPromiseStore[name].promise;
			}

			promiseHolder.push(tempPromise);
		}

		return Promise.all(promiseHolder);
	}

	/**
	 * @function IsCreated
	 * @memberof CAppStatusEventManager
	 * @public
	 * @static
	 * @param {string} strName - Name of the event (must be unique)
	 * @returns {boolean} - True if the event has been created else false
	 * @description Tests if the named event has been created
	 */
	public static IsCreated(strName: string): boolean
	{
		/**
		 * Check and normalize parameters
		 */
		if ('string' !== typeof strName)
		{
			throw new Error('Name is not a string. name = ' + JSON.stringify(strName));
		}

		if ('object' === typeof (NamedPromise.namedPromiseStore[name]))
		{
			return true;
		}
		return false;
	}
}
