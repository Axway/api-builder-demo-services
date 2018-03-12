// All overrides
const rules = {
	// TODO: Enable these when ready
	// 'no-var': 'error',
	// 'prefer-const': 'error',
	// 'prefer-arrow-callback': 'error',
	// 'object-shorthand': 'error',
	'array-bracket-spacing': [ 'error', 'always', {
		'objectsInArrays': false,
		'arraysInArrays': false
	}],
	'import/first': [ 'error', 'absolute-first' ],
	'import/no-mutable-exports': 'error',
	'import/no-unresolved': ['error', {
		commonjs: true,
		caseSensitive: true,
	}],
	'no-multi-str': 'off',
	'security/detect-child-process': 'off',
	'security/detect-non-literal-require': 'off',
	'security/detect-non-literal-regexp': 'off',
	'space-unary-ops': 'off'
};



module.exports = {
	extends: [
		'axway/env-node',
		'axway/+mocha',
		'axway/+chai'
	],
	rules: rules
}
