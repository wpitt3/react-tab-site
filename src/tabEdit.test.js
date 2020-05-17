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

  // test('with unbalanced lines', () => {
  //   const result = convertTabTextToStrings("2");

  //   expect(result).toHaveLength(6);
  //   expect(result).toStrictEqual([[2],[-1],[-1],[-1],[-1],[-1]]);
  // })
});

describe('convertStringsToTabText', () => {
  test('single section', () => {
    const result = convertStringsToTabText(basicStrings(), 5, 1);

    expect(result).toHaveLength(35);
    expect(result).toBe("2-3-0\n3-0-0\n2-0-0\n0-0-0\n--2-0\n--3-0"
      );
  })

  test('two sections', () => {
    const result = convertStringsToTabText(basicStrings(), 3, 1);

    expect(result).toHaveLength(48);
    expect(result).toBe("2-3\n3-0\n2-0\n0-0\n--2\n--3\n\n-0-\n-0-\n-0-\n-0-\n-0-\n-0-");
  })

  test('fills out all sections to length', () => {
    const result = convertStringsToTabText(basicStrings(), 3, 1);

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
    const result = convertStringsToTabText(strings, 3, 1);

    expect(result).toBe("2-3\n3-0\n2-0\n0-0\n--2\n--3\n");
  })
});

describe('handleTabEdit', () => {
  test('Delete a single note on line 0', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 0)
    modifiedStrings[0].splice(4, 1);

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, false);

    expect(newStrings[0]).toStrictEqual([ 2, -1, 3, -1, -1, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  test('Delete a single note on line 1', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    const cursorIndex = firstIndexOf(modifiedStrings, 1, 0)
    modifiedStrings[1].splice(2, 1);

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, false);

    expect(newStrings[1]).toStrictEqual([ 3, -1, -1, -1, 0, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  test('Replace a single note', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(4, 0, 5);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 5) + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, false);

    expect(newStrings[0]).toStrictEqual([ 2, -1, 3, -1, 5, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  test('Insert a single note of chord', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(4, 0, 5);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 5) + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, true);

    expect(newStrings[0]).toStrictEqual([ 2, -1, 3, -1, 5, 0, -1]);
    expect(newStrings[1]).toStrictEqual([ 3, -1, 0, -1, -1, 0, -1]);
    expect(newStrings[2]).toStrictEqual([ 2, -1, 0, -1, -1, 0, -1]);
    expect(newStrings[3]).toStrictEqual([ 0, -1, 0, -1, -1, 0, -1]);
    expect(newStrings[4]).toStrictEqual([ -1, -1, 2, -1, -1, 0, -1]);
    expect(newStrings[5]).toStrictEqual([ -1, -1, 3, -1, -1, 0, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  test('Delete a note in insert mode', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    const cursorIndex = firstIndexOf(modifiedStrings, 1, 0)
    modifiedStrings[1].splice(2, 1);

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, true);

    expect(newStrings[0]).toStrictEqual([ 2, -1, -1, 0, -1]);
    expect(newStrings[1]).toStrictEqual([ 3, -1, -1, 0, -1]);
    expect(newStrings[2]).toStrictEqual([ 2, -1, -1, 0, -1]);
    expect(newStrings[3]).toStrictEqual([ 0, -1, -1, 0, -1]);
    expect(newStrings[4]).toStrictEqual([ -1, -1, -1, 0, -1]);
    expect(newStrings[5]).toStrictEqual([ -1, -1,-1, 0, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  test('Cursor moves to next block on new line, insert mode', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(6, 0, 5);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 5) + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, true);

    expect(newCursor).toBe(cursorIndex + 5 * 7 + 1);
  })

  test('Cursor stays in correct place on new line delete', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(5, 1);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 0) + 5 * 6 + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, true);

    expect(newCursor).toBe(cursorIndex );
  })
});


function firstIndexOf(strings, stringIndex, value, length=6) {
  return strings[stringIndex].findIndex((x) => x == value) + stringIndex * (length + 1)
}

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

function basicStringsWithTrailingSpace() {
  return [
    [ 2, -1, 3, -1, 0, -1],
    [ 3, -1, 0, -1, 0, -1],
    [ 2, -1, 0, -1, 0, -1],
    [ 0, -1, 0, -1, 0, -1],
    [-1, -1, 2, -1, 0, -1],
    [-1, -1, 3, -1, 0, -1]
  ]
}


