import { convertStringsToTabText, convertTabTextToStrings, handleTabEdit, tabHeight } from './tabEdit';

describe('convertTabToStrings', () => {
  describe('non canonical', () => {
    it('with empty', () => {
      const result = convertTabTextToStrings("");

      expect(result.strings).toHaveLength(6);
      expect(result.strings[0]).toStrictEqual([]);
      expect(result.tunings).toStrictEqual([]);
    })

    it('with 6 lines', () => {
      const result = convertTabTextToStrings("2-\n3-\n2-\n0-\n--\n--\n");

      expect(result.strings).toHaveLength(6);
      expect(result.strings).toStrictEqual([[2,-1],[3,-1],[2,-1],[0,-1],[-1,-1],[-1,-1]]);
      expect(result.tunings).toStrictEqual([]);
    })

    it('with multiple blocks', () => {
      const result = convertTabTextToStrings("2\n3\n2\n0\n-\n-\n\n-\n-\n-\n-\n-\n-\n");

      expect(result.strings).toHaveLength(6);
      expect(result.strings).toStrictEqual([[2,-1],[3,-1],[2,-1],[0,-1],[-1,-1],[-1,-1]]);
      expect(result.tunings).toStrictEqual([]);
    })
  });

  describe('canonical', () => {
    it('with empty', () => {
      const result = convertTabTextToStrings("e |\nB |\nG |\nD |\nA |\nE |\n");

      expect(result.strings).toHaveLength(6);
      expect(result.strings[0]).toStrictEqual([]);
      expect(result.tunings).toStrictEqual(["e", "B", "G", "D", "A", "E"]);
    })

    it('with 6 lines', () => {
      const result = convertTabTextToStrings("e |2-\nB |3-\nF#|2-\nD |0-\nA |--\nE |--\n");

      expect(result.strings).toHaveLength(6);
      expect(result.strings).toStrictEqual([[2,-1],[3,-1],[2,-1],[0,-1],[-1,-1],[-1,-1]]);
      expect(result.tunings).toStrictEqual(["e", "B", "F#", "D", "A", "E"]);
    })

    it('with multiple blocks', () => {
      const result = convertTabTextToStrings("e |2\nB |3\nF#|2\nD |0\nA |-\nE |-\n\ne |-\nB |-\nF#|-\nD |-\nA |-\nE |-\n");

      expect(result.strings).toHaveLength(6);
      expect(result.strings).toStrictEqual([[2,-1],[3,-1],[2,-1],[0,-1],[-1,-1],[-1,-1]]);
      expect(result.tunings).toStrictEqual(["e", "B", "F#", "D", "A", "E"]);
    })
  });

  // test('with unbalanced lines', () => {
  //   const result = convertTabTextToStrings("2");

  //   expect(result).toHaveLength(6);
  //   expect(result).toStrictEqual([[2],[-1],[-1],[-1],[-1],[-1]]);
  // })
});

describe('convertStringsToTabText', () => {
  it('single section', () => {
    const result = convertStringsToTabText(basicStrings(), 5, 1);

    expect(result).toHaveLength(53);
    expect(result).toBe("e |2-3-0\nB |3-0-0\nG |2-0-0\nD |0-0-0\nA |--2-0\nE |--3-0"
      );
  })

  it('two sections', () => {
    const result = convertStringsToTabText(basicStrings(), 3, 1);

    expect(result).toHaveLength(84);
    expect(result).toBe("e |2-3\nB |3-0\nG |2-0\nD |0-0\nA |--2\nE |--3\n\ne |-0-\nB |-0-\nG |-0-\nD |-0-\nA |-0-\nE |-0-");
  })

  it('fills out all sections to length', () => {
    const result = convertStringsToTabText(basicStrings(), 3, 1);

    expect(result).toHaveLength(84);
    expect(result).toBe("e |2-3\nB |3-0\nG |2-0\nD |0-0\nA |--2\nE |--3\n\ne |-0-\nB |-0-\nG |-0-\nD |-0-\nA |-0-\nE |-0-");
  })

  it('remove empty training blocks of lines', () => {
    const strings = [
      [ 2, -1, 3, -1, -1],
      [ 3, -1, 0, -1, -1],
      [ 2, -1, 0, -1, -1],
      [ 0, -1, 0, -1, -1],
      [-1, -1, 2, -1, -1],
      [-1, -1, 3, -1, -1]
    ]
    const result = convertStringsToTabText(strings, 3, 1);

    expect(result).toBe("e |2-3\nB |3-0\nG |2-0\nD |0-0\nA |--2\nE |--3\n");
  })
});

describe('handleTabEdit', () => {
  it('Delete a single note on line 0', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 0)
    modifiedStrings[0].splice(4, 1);

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, false);

    expect(newStrings[0]).toStrictEqual([ 2, -1, 3, -1, -1, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  it('Delete a single note on line 1', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    const cursorIndex = firstIndexOf(modifiedStrings, 1, 0)
    modifiedStrings[1].splice(2, 1);

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, false);

    expect(newStrings[1]).toStrictEqual([ 3, -1, -1, -1, 0, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  it('Replace a single note', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(4, 0, 5);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 5) + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, false);

    expect(newStrings[0]).toStrictEqual([ 2, -1, 3, -1, 5, -1]);
    expect(newCursor).toBe(cursorIndex);
  })

  it('Insert a single note of chord', () => {
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

  it('Delete a note in insert mode', () => {
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

  it('Cursor moves to next block on new line, insert mode', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(6, 0, 5);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 5) + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, true);

    expect(newCursor).toBe(cursorIndex + 5 * 10 + 4);
  })

  it('Cursor stays in correct place on new line delete', () => {
    const oldStrings = basicStringsWithTrailingSpace()
    let modifiedStrings = basicStringsWithTrailingSpace()
    modifiedStrings[0].splice(5, 1);
    const cursorIndex = firstIndexOf(modifiedStrings, 0, 0) + 5 * 6 + 1

    const { newStrings, newCursor } = handleTabEdit(modifiedStrings, oldStrings, cursorIndex, 6, true);

    expect(newCursor).toBe(cursorIndex );
  })
});


function firstIndexOf(strings, stringIndex, value, length=6) {
  return strings[stringIndex].findIndex((x) => x == value) + stringIndex * (length + 4) + 3
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


