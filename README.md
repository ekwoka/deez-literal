[<img src="https://img.shields.io/npm/v/deez-literal?label=%20&style=for-the-badge&logo=pnpm&logoColor=white">](https://www.npmjs.com/package/deez-literal)
<img src="https://img.shields.io/npm/dt/deez-literal?style=for-the-badge&logo=npm&logoColor=white" >
[<img src="https://img.shields.io/bundlephobia/minzip/deez-literal?style=for-the-badge&logo=esbuild&logoColor=white">](https://bundlephobia.com/package/deez-literal)

# deez-literal

`deez-literal` is a simple utility for working with multi-dimensional template literals.

Simply, now if you have values, you want to map into strings, you can use a template tag.

## Examples

```js
const subjects = ['world', 'mom']
// Before 💩
const greetings = subjects.map(subject => `Hello ${subject}!`)

// Now 🔥
const greetings = deez`Hello ${subjects}!`


// Both return
['Hello world!', 'Hello mom!']
```


## Exports

### `deez`

The main template tag. Takes in a template tag, and returns an array of strings composed from the templates, providing a string for EVERY possible combination of expressions made from what is provided.

```js
// simple
const subjects = ['world', 'mom']
deez`Hello ${subjects}!` // ['Hello world!', 'Hello mom!']

// complex
const greetingWords = ['Hello', 'Hi']
deez`${greetingWords} ${subjects}!`
// ['Hello world!', 'Hello mom!', 'Hi world!', 'Hi mom!']

// can still accept plain values
const user = 'Mom'
deez`${greetingWords} ${user}! Here's a joke: ${jokes}`
// ['Hello mom! Here's a joke: ...', 'Hi mom! Here's a joke: ...', ...]

```

When values aren't arrays, they are treated like single value arrays, making using this similarly to a normal template literal very simple!

> It may be important to note the order of the results. These are based on looping through the last expressions options first, then the next to last, and so on.

### `deezIter`

Internal iterator used for making the messages. Can be directly used to get the iterator that you can stream through to other things only as needed.

```js
const iter = deezIter`Hello ${subjects}!`
iter.next() // 'Hello world!'
iter.next() // 'Hello mom!'


// or

for (const greeting of deezIter`Hello ${subjects}!`)
	greeting // 'Hello world!' | 'Hello mom!'
```

### `arrangeDimensions`

Signature: `(first: Iterable<T>, others: Iterable<T>[]) => Generator<T[]>`

Even MORE internal iterator for figuring out all the combinations of the passed in expressions need. Really just exposed because, sure, maybe someone will find it useful;

```js
const iter = arrangeDimensions(['Hello', 'Hi'], [['World', 'Mom']])
iter.next() // ['Hello', 'World']
iter.next() // ['Hello', 'Mom']
iter.next() // ['Hi', 'World']
iter.next() // ['Hi', 'Mom']
```
