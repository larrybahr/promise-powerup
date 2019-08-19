function CountToThree(input)
{
	return new Promise((resolve, reject) =>
	{
		if ("number" !== typeof input ||
			true === isNaN(input))
		{
			input = 0;
		}

		input++;
		if (input <= 3)
		{
			resolve(input);
		}
		else
		{
			reject(new Error("not a real error"));
		}
		return;
	});
}

function HandleResult(result)
{
	if (result.err.name === "Error" &&
		result.err.message === "not a real error")
	{
		console.log("Success! Count is " + result.lastResult);
		console.info(result.err);
	}
	else
	{
		console.error("Last result before error: " + result.lastResult);
		console.error(result.err);
	}
	return;
}

var failACoupleTimeCount = 0;
function FailACoupleTime()
{
	failACoupleTimeCount++;
	console.log(failACoupleTimeCount, Date.now());
	if (3 !== failACoupleTimeCount)
	{
		return Promise.reject(new Error('not three'));
	}
	else
	{
		return Promise.resolve(failACoupleTimeCount);
	}
}

PromiseTryUntilSuccess(FailACoupleTime, 1000, 2)
.then(function (result)
{
	console.dir(result);
})
.catch(function (err)
{
	console.log('error ' + err);
});
/*
PromiseTryUntilSuccess(FailACoupleTime, 1000, 2)
.then(function (result)
{
	console.dir(result);
})
.catch(function (err)
{
	console.log('error ' + err);
});
*/
// Success case
PromiseLoopUntilReject(CountToThree)
	.then(HandleResult);

// Error case
PromiseLoopUntilReject(() =>
{
	return Promise.reject(new Error("real Error"));
})
	.then(HandleResult);
