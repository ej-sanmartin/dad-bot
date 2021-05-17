const { setupTextContent } = require('./utils.js');

test('Makes sure null objects being passed into setupTextContent function throws error', () => {
    expect(() => {
        setupTextContent(null);
    }).toThrow('Null or no object passed into setupTextContent function.');
});

test('Make sure undefined sets string to have undefined joke', () => {
    expect(setupTextContent({})).toMatch(
        `
Wanna hear a joke? :D\n\n
undefined\n\n
undefined
`
    );
});