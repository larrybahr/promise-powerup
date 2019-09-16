let promisePowerup = require('../dist/promisePowerup.js');

describe('Named Promises', () =>
{
	const TIME_TO_WAIT_UNTIL_RESOLVE = 10;

	it('should create a promise', function ()
	{
		let tempPromise = new promisePowerup.NamedPromise((resolve) => { resolve(); });

		if (false === (tempPromise instanceof Promise))
		{
			throw new Error('type = ' + typeof tempPromise);
		}
		return Promise.resolve();
	});

	it('should be able to set and get the name', function ()
	{
		const PROMISE_NAME = Math.random().toString();
		let nameResult;
		let tempPromise = new promisePowerup.NamedPromise((resolve) => { resolve(); });

		tempPromise.name = PROMISE_NAME;
		nameResult = tempPromise.name;
		if (PROMISE_NAME !== nameResult)
		{
			throw new Error("wrong name. Expected " + PROMISE_NAME + " but got " + nameResult);
		}

		return Promise.resolve();
	});

	it('Named promise should resolve with the correct result', function ()
	{
		return new Promise(function (testResolve, testReject)
		{
			const PROMISE_NAME = Math.random().toString();
			let resolveValue = Math.random();
			let tempPromise;

			tempPromise = new promisePowerup.NamedPromise(function (resolve)
			{
				setTimeout(() =>
				{
					resolve(resolveValue);
				}, TIME_TO_WAIT_UNTIL_RESOLVE);
				return;
			});
			tempPromise.name = PROMISE_NAME;

			tempPromise
				.then(function (result)
				{
					if (result !== resolveValue)
					{
						throw new Error('expected ' + resolveValue + ' but got ' + result);
					}
					testResolve();
					return;
				})
				.catch(function (err)
				{
					testReject(err);
				});

			setTimeout(() =>
			{
				testReject(new Error('Test took too long'));
				return;
			}, TIME_TO_WAIT_UNTIL_RESOLVE * 2);
		});
	});

	it('should reject with the correct result', function ()
	{
		return new Promise(function (testResolve, testReject)
		{
			const PROMISE_NAME = Math.random().toString();
			let rejectValue = Math.random();
			let tempPromise;

			tempPromise = new promisePowerup.NamedPromise(function (resolve, reject)
			{
				setTimeout(() =>
				{
					reject(rejectValue);
				}, TIME_TO_WAIT_UNTIL_RESOLVE);
				return;
			});
			tempPromise.name = PROMISE_NAME;

			tempPromise
				.then(function (result)
				{
					testReject(new Error('Should have rejected'));
					return;
				})
				.catch(function (err)
				{
					if (rejectValue !== err)
					{
						testReject(new Error('Rejected with wrong value. Expected ' + rejectValue + ' but got ' + err));
						return;
					}
					testResolve();
					return;
				});

			setTimeout(() =>
			{
				testReject(new Error('Test took too long'));
				return;
			}, TIME_TO_WAIT_UNTIL_RESOLVE * 2);
		});
	});

	it('should not let a name be used more than once', function ()
	{
		let errored = false;
		const PROMISE_NAME = Math.random().toString();
		let tempPromise = new promisePowerup.NamedPromise((resolve) => { resolve(); });

		tempPromise.name = PROMISE_NAME;

		tempPromise = new promisePowerup.NamedPromise((resolve) => { resolve(); });

		try
		{
			tempPromise.name = PROMISE_NAME;
		}
		catch(err)
		{
			errored = true;
		}

		if (false === errored)
		{
			throw new Error('Let the name ' + PROMISE_NAME + ' be used more than once');
		}
		return Promise.resolve();
	});

	it('GetNamedPromise should wait until the named promise resolves', function ()
	{
		return new Promise(function (testResolve, testReject)
		{
			const PROMISE_NAME = Math.random().toString();
			let namedPromiseResolved = false;

			tempPromise = new promisePowerup.NamedPromise(function (resolve)
			{
				setTimeout(() =>
				{
					resolve();
					namedPromiseResolved = true;
				}, TIME_TO_WAIT_UNTIL_RESOLVE);
				return;
			});
			tempPromise.name = PROMISE_NAME;

			promisePowerup.NamedPromise.GetNamedPromise(PROMISE_NAME)
				.then(function ()
				{
					if (false === namedPromiseResolved)
					{
						throw new Error('resolved before named promise');
					}
					testResolve();
					return;
				})
				.catch(function (err)
				{
					testReject(err);
				});

			setTimeout(() =>
			{
				testReject(new Error('Test took too long'));
				return;
			}, TIME_TO_WAIT_UNTIL_RESOLVE * 2);
		});
	});

	it('GetNamedPromise should resolve with the named promise result', function ()
	{
		return new Promise(function (testResolve, testReject)
		{
			const PROMISE_NAME = Math.random().toString();
			let resolveValue = Math.random();

			promisePowerup.NamedPromise.GetNamedPromise(PROMISE_NAME)
				.then(function (result)
				{
					if (result !== resolveValue)
					{
						throw new Error('expected ' + resolveValue + ' but got ' + result);
					}
					testResolve();
					return;
				})
				.catch(function (err)
				{
					testReject(err);
				});

			tempPromise = new promisePowerup.NamedPromise(function (resolve)
			{
				setTimeout(() =>
				{
					resolve(resolveValue);
				}, TIME_TO_WAIT_UNTIL_RESOLVE);
				return;
			});
			tempPromise.name = PROMISE_NAME;

			setTimeout(() =>
			{
				testReject(new Error('Test took too long'));
				return;
			}, TIME_TO_WAIT_UNTIL_RESOLVE * 2);
		});
	});
});
