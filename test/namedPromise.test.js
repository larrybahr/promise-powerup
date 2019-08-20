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
