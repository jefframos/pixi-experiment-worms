const path = require('path');
const build = require('@goodboydigital/fido-build');

var args = {};

process.argv.forEach(function (val, index, array) {
	args[val] = true;
});


if(args.production)
{
	build.startupProduction();
}
else
{
	build.startupDevelopment();
}