import { convertStringsToTabText, convertTabTextToStrings, handleTabEdit, tabHeight } from './tabEdit';

describe('convertTabToStrings', () => {
  test('with empty', () => {
    const result = convertTabTextToStrings("");

    expect(result).toHaveLength(6);
    expect(result[0]).toStrictEqual([-1, -1]);
  })

  test('with 6 lines', () => {
    const result = convertTabTextToStrings("2-\n3-\n2-\n0-\n--\n--\n");

    expect(result).toHaveLength(6);
    expect(result).toStrictEqual([[2,-1],[3,-1],[2,-1],[0,-1],[-1,-1],[-1,-1]]);
  })

  test('with multiple blocks', () => {
    const result = convertTabTextToStrings("2\n3\n2\n0\n-\n-\n\n-\n-\n-\n-\n-\n-\n");

    expect(result).toHaveLength(6);
    expect(result).toStrictEqual([[2,-1],[3,-1],[2,-1],[0,-1],[-1,-1],[-1,-1]]);
  })
});

describe('convertStringsToTabText', () => {
  test('single section', () => {
    const result = convertStringsToTabText(basicStrings(), 5);

    expect(result).toHaveLength(35);
    expect(result).toBe("2-3-0\n3-0-0\n2-0-0\n0-0-0\n--2-0\n--3-0"
      );
  })

  test('two sections', () => {
    const result = convertStringsToTabText(basicStrings(), 3);

    expect(result).toHaveLength(48);
    expect(result).toBe("2-3\n3-0\n2-0\n0-0\n--2\n--3\n\n-0-\n-0-\n-0-\n-0-\n-0-\n-0-");
  })

  test('fills out all sections to length', () => {
    const result = convertStringsToTabText(basicStrings(), 3);

    expect(result).toHaveLength(48);
    expect(result).toBe("2-3\n3-0\n2-0\n0-0\n--2\n--3\n\n-0-\n-0-\n-0-\n-0-\n-0-\n-0-");
  })

  test('remove empty training blocks of lines', () => {
    const strings = [
      [ 2, -1, 3, -1, -1],
      [ 3, -1, 0, -1, -1],
      [ 2, -1, 0, -1, -1],
      [ 0, -1, 0, -1, -1],
      [-1, -1, 2, -1, -1],
      [-1, -1, 3, -1, -1]
    ]
    const result = convertStringsToTabText(strings, 3);

    expect(result).toBe("2-3\n3-0\n2-0\n0-0\n--2\n--3\n");
  })
});

function basicStrings() {
  return [
    [ 2, -1, 3, -1, 0],
    [ 3, -1, 0, -1, 0],
    [ 2, -1, 0, -1, 0],
    [ 0, -1, 0, -1, 0],
    [-1, -1, 2, -1, 0],
    [-1, -1, 3, -1, 0]
  ]
}