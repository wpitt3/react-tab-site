
function convertTabTextToStrings(tab) {
  const tabLines = tab.split('\n').map((line) => readTabLine(line));
  const sections = tabLines.length / 7;
  let tunings = [];

  for (var i = 0; i < 6; i++) {
    tunings[i] = tabLines[i]?.tuning?.trim() || '';
  }

  if (tunings.every(tuning => !tuning || 0 === tuning.length)) {
      tunings = [];
  }

  let strings = [[],[],[],[],[],[]];
  for (var x = 0, leny = sections; x < leny; x++) {
    for (var z = 0; z < 6; z++) {
      strings[z] = strings[z].concat(tabLines[z + x*7]?.notes)
    }
  }
  for (var y = 0; y < 6; y++) {
    strings[y] = strings[y].filter(note => note !== undefined);
  }
  return {tunings: tunings, strings:strings};
}

function readTabLine(line) {
  // const allowedPattern = /([A-Fa-f][ #]\|)?[\-0-9hpb\/\\]/;
  const splitLine = line.split("|");
  let tuning = "";
  let notes = "";

  if (splitLine.length === 1) {
    notes = splitLine[0];
  } else {
    tuning = splitLine[0];
    notes = splitLine[1];
  }

  return {tuning: tuning, notes: (notes.split('').map((s) => !isNaN(s) && ! (s === " ") ? parseInt(s) : -1))}
}

function convertStringsToTabText(strings, lineLength, minblocks=4, tunings=['e', 'B', 'G', 'D', 'A', 'E']) {
  if (strings.length === 0) {
    return ""
  }

  let tuningPrefixes = [];
  for (var y = 0; y < 6; y++) {
    tuningPrefixes[y] = tunings[y] + " ".repeat(2-tunings[y].length) + "|"
  };

  // parsed guitar strings into arrays of rows to display
  let parsed = strings.map(string => {
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

  while(parsed[0].length < minblocks) {
    for(let i = 0; i < strings.length; i++) {
      parsed[i].push("-".repeat(lineLength));
    }
  }

  // create single array of all lines to display
  let tab = [];
  for (var i = 0, len = parsed[0].length; i < len; i++) {
    for (var j = 0; j < 6; j++) {
      tab.push(tuningPrefixes[j] + parsed[j][i]);
    }
    if (i !== len-1) {
      tab.push("");
    }
  }


  if (parsed[0].length > minblocks) {
    const lastLinesAreJustSpace = tab.slice(-6).every(line => !line || line.match(/^..\|-+$/g));
    if (lastLinesAreJustSpace) {
      tab = tab.slice(0, -6);
    }
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

  let newCursor = cursorPosition;

  // value has been removed
  if (minCount === 1) {
    const firstDifferenceIndex = findFirstDifferenceIndex(cursorPosition, lineLength, false);
    const lineIndex = lengths.findIndex(length => length === min);
    if (insertMode) {
      for (var j = 0; j < 6; j++) {
        if(lineIndex !== j) {
          newStrings[j].splice(firstDifferenceIndex, 1);
        }
      }
    } else {
      newStrings[lineIndex].splice(firstDifferenceIndex, 0, -1);
    }
  }

  // value has been added
  if (maxCount === 1) {
    const firstDifferenceIndex = findFirstDifferenceIndex(cursorPosition, lineLength, true);

    const lineIndex = lengths.findIndex(length => length === max);
    if (insertMode) {
      for (var i = 0; i < 6; i++) {
        if(lineIndex !== i) {
          newStrings[i].splice(firstDifferenceIndex-1, 0, -1);
        }
      }
    } else {
      newStrings[lineIndex].splice(firstDifferenceIndex, 1);
    }

    newCursor = findNewCursorPosition(firstDifferenceIndex, lineIndex, lineLength);
  }


  return { newStrings: newStrings, newCursor: newCursor}
}

function findFirstDifferenceIndex(cursorPosition, lineLength, noteAdded) {
  const sectionSize = lineLength*6+25;
  let section = Math.floor(cursorPosition / sectionSize);
  let modifier = -3;
  if (noteAdded && ((cursorPosition%sectionSize)%(lineLength+4)) === 0) {
    modifier += lineLength + 3

  }
  return ((cursorPosition%sectionSize)%(lineLength+4))+(section*lineLength) + modifier;
}

function findNewCursorPosition(cursorIndex, lineIndex, lineLength) {
  const sectionSize = lineLength*6+25;

  const section = Math.floor(cursorIndex / lineLength);
  return section*sectionSize +(lineLength+4)*lineIndex + cursorIndex%lineLength+3;
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