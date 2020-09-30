module.exports = {
    roots: ['<rootDir>/tests'],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};