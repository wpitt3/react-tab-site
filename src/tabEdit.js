
function convertTabTextToStrings(tab) {
  const tabLines = tab.split('\n').map((line) => readTabLine(line));
  const sections = tabLines.length / 7;

  let strings = [[],[],[],[],[],[]];
  for (var x = 0, leny = sections; x < leny; x++) {
    for (var z = 0; z < 6; z++) {
      strings[z] = strings[z].concat(tabLines[z + x*7])
    }
  }
  for (var y = 0; y < 6; y++) {
    strings[y] = strings[y].filter(note => note !== undefined);

    if (strings[y].length === 0) {
      strings[y].push(-1);
      strings[y].push(-1);
    }
  }
  return strings;
}

function readTabLine(line) {
  return (line.split('').map((s) => !isNaN(s) && ! (s === " ") ? parseInt(s) : -1))
}

function convertStringsToTabText(strings, lineLength) {
  if (strings.length === 0) {
    return ""
  }
  const parsed = strings.map(string => {
    let lines = [];
    const x = string.map(note => note.toString().replace('-1', '-'));
    for (var i = 0, len = string.length/lineLength; i < len; i++) {
      let line = x.slice(i*lineLength, (i+1)*lineLength).join('')
      if (line.length < lineLength) {
        line = line + "-".repeat(lineLength - line.length);
      }
      lines.push(line);
    }
    return lines;
  });

  let tab = [];
  for (var i = 0, len = parsed[0].length; i < len; i++) {
    for (var j = 0; j < 6; j++) {
      tab.push(parsed[j][i]);
    }
    if (i !== len-1) {
      tab.push("");
    }
  }

  const lastLinesAreJustSpace = tab.slice(-6).every(line => !line || line.match(/^-+$/g));
  if (lastLinesAreJustSpace) {
    tab = tab.slice(0, -6);
  }

  return tab.join("\n");
}

function handleTabEdit(newStrings, strings, cursorPosition, lineLength, insertMode) {
  const lengths = newStrings.map(string => string.length);
  const min = Math.min.apply(Math, lengths);
  const max = Math.max.apply(Math, lengths);
  const minCount = lengths.filter(length => min === length).length
  const maxCount = lengths.filter(length => max === length).length

  if (max - min !== 1) {
    return { newStrings: strings, newCursor: cursorPosition};
  }

  // value has been removed
  if (minCount === 1) {
    const changeIndex = lengths.findIndex(length => length === min);
    const firstDifferenceIndex = findFirstDifferenceIndex(cursorPosition, lineLength);
    if (insertMode) {
      for (var j = 0; j < 6; j++) {
        if(changeIndex !== j) {
          newStrings[j].splice(firstDifferenceIndex, 1);
        }
      }
    } else {
      newStrings[changeIndex].splice(firstDifferenceIndex, 0, -1);
    }
  }

  // value has been added
  if (maxCount === 1) {
    const changeIndex = lengths.findIndex(length => length === max);
    const firstDifferenceIndex = findFirstDifferenceIndex(cursorPosition, lineLength);
    if (insertMode) {
      for (var i = 0; i < 6; i++) {
        if(changeIndex !== i) {
          newStrings[i].splice(firstDifferenceIndex-1, 0, -1);
        }
      }
    } else {
      newStrings[changeIndex].splice(firstDifferenceIndex, 1);
    }
  }
  return { newStrings: newStrings, newCursor: cursorPosition}
}

function findFirstDifferenceIndex(cursorPosition, lineLength) {
  const sectionSize = lineLength*6+7;
  const section = Math.floor((cursorPosition / sectionSize));
  return ((cursorPosition%sectionSize)%(lineLength+1))+(section*lineLength);
}

function tabHeight(strings, lineLength) {
  let tabHeight = 1

  if (strings.length > 0) {
    tabHeight = Math.floor((strings[0].length - 1) / lineLength) + 1
  }
  if (tabHeight < 4) {
    tabHeight = 4
  }

  return (tabHeight*7-1).toString();
}

export { convertTabTextToStrings, convertStringsToTabText, handleTabEdit, tabHeight } ;