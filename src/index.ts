export function deez(
  strings: TemplateStringsArray,
  ...dimensions: (unknown | unknown[])[]
) {
  return [...deezIter(strings, ...dimensions)];
}

export function* deezIter(
  strings: TemplateStringsArray,
  ...dimensions: (unknown | unknown[])[]
) {
  const [first, ...rest] = dimensions.map((d) =>
    Array.isArray(d) ? d.slice() : [d],
  );
  const polyD = arrangeDimensions(first, rest);
  for (const poly of polyD) {
    let next = '';
    for (const [idx, str] of strings.entries()) next += str + (poly[idx] ?? '');
    yield next;
  }
}

export function* arrangeDimensions<T>(
  iter: Iterable<T>,
  others: Iterable<T>[],
): Generator<T[], void, undefined> {
  const next = others.shift();
  if (!next) {
    for (const part of iter) yield [part] as T[];
    return;
  }
  for (const part of iter)
    for (const other of arrangeDimensions(next, others))
      yield [part, other].flat() as T[];
  return;
}

if (import.meta.vitest) {
  describe('arrangeDimansions', () => {
    it('arranges two iterables into combination iterator', () => {
      const iter = arrangeDimensions([1, 2], [[3, 4]]);
      expect(iter.next().value).toEqual([1, 3]);
      expect(iter.next().value).toEqual([1, 4]);
      expect(iter.next().value).toEqual([2, 3]);
      expect(iter.next().value).toEqual([2, 4]);
    });
    it('yields array wrapped items when provided only one contentful array', () => {
      const iter = arrangeDimensions([1, 2], []);
      expect(iter.next().value).toEqual([1]);
      expect(iter.next().value).toEqual([2]);
    });
  });
  describe('deezIter', () => {
    it('processes template literals', () => {
      const iter = deezIter`hello ${'world'}`;
      expect(iter.next()).toEqual({
        value: 'hello world',
        done: false,
      });
    });
    it('can process arrays as expressions', () => {
      const iter = deezIter`hello ${['world', 'mom']}`;
      expect(iter.next()).toEqual({
        value: 'hello world',
        done: false,
      });
      expect(iter.next()).toEqual({
        value: 'hello mom',
        done: false,
      });
      expect(iter.next()).toEqual({
        value: undefined,
        done: true,
      });
    });
    it('can return all possible combinations of template expressions', () => {
      const iter = deezIter`${['Hi', 'Hello']} ${['world', 'mom']}!`;
      expect(iter.next().value).toEqual('Hi world!');
      expect(iter.next().value).toEqual('Hi mom!');
      expect(iter.next().value).toEqual('Hello world!');
      expect(iter.next().value).toEqual('Hello mom!');
      expect(iter.next().value).toEqual(undefined);
    });
  });
  describe('deez', () => {
    it('processes template literals', () => {
      expect(deez`hello ${'world'}`).toEqual(['hello world']);
    });
    it('can process arrays as expressions', () => {
      expect(deez`hello ${['world', 'mom']}`).toEqual([
        'hello world',
        'hello mom',
      ]);
    });
    it('can return all possible combinations of template expressions', () => {
      expect(deez`${['Hi', 'Hello']} ${['world', 'mom']}!`).toEqual([
        'Hi world!',
        'Hi mom!',
        'Hello world!',
        'Hello mom!',
      ]);
    });
  });
}
