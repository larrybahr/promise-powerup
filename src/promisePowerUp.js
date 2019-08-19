function PromiseLoopUntilReject(functionToRun)
{
	return new Promise((resolve) =>
	{
		let lastResult = undefined;
		let loop = function ()
		{
			return Promise.resolve()
				.then(() =>
				{
					return functionToRun(lastResult);
				})
				.then((result) =>
				{
					lastResult = result;
					return loop();
				})
				.catch((err) =>
				{
					resolve({
						result: lastResult,
						error: err
					});
					return;
				});
		};
		return loop();
	});
}

/**
 * @description Runs a funtion that returns a promise until it resolves
 * @param {Function} fn - Function that returns a promise
 * @param {number} delayBetweenTries - How long in milliseconds to wait between rejections
 * @param {number} maxTries - Max number of times this should be tried before giving up.
 * @return {Promise<object>} object will have result key and attempts key
 */
async function PromiseTryUntilSuccess(fn, delayBetweenTries, maxTries)
{
	let attempts = 0;
	let result;

	// Parameter check
	if ("number" !== typeof delayBetweenTries ||
		0 > delayBetweenTries)
	{
		delayBetweenTries = 0;
	}
	if ("number" !== typeof maxTries ||
		1 > maxTries)
	{
		maxTries = 1;
	}

	while (true)
	{
		attempts++;
		try
		{
			if (0 !== delayBetweenTries)
			{
				// Only add a delay to the chain if needed
				await new Promise(function (resolve)
				{
					setTimeout(resolve, delayBetweenTries);
					return;
				});
			}

			console.log(Date.now(), attempts, maxTries);
			result = {
				result: await fn(),
				attempts: attempts
			};
			break;
		}
		catch (err)
		{
			if (attempts === maxTries)
			{
				throw err;
			}
		}
	}
	return result;
}
