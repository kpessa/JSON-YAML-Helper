// function to get breadcrumb path based on cursor position in JSON editor
function getJsonPath(editor) {
  let cursor = editor.getCursor();
  let path = [];
  let currentKey = '';
  let currentLevel = -1;

  editor.doc.eachLine(0, cursor.line + 1, function (lineHandle) {
    let lineText = lineHandle.text;
    let leadingSpaces = lineText.match(/^(\s*)/)[0].length;
    let lineKey = lineText.trim().split(':')[0];
    if (leadingSpaces > currentLevel) {
      if (currentKey) {
        path.push(currentKey);
      }
      currentKey = lineKey;
      currentLevel = leadingSpaces;
    } else if (leadingSpaces < currentLevel) {
      path.pop();
      currentKey = lineKey;
      currentLevel = leadingSpaces;
    } else {
      currentKey = lineKey;
    }

    // Check if the line contains an array element
    let arrayElement = lineText.trim().match(/^\[(\d+)\]/);
    if (arrayElement) {
      path.push(arrayElement[1]);
    }
  });

  // Include the current line's key-value pair or array item in the path
  let currentLine = editor.getLine(cursor.line);
  let currentLineKey = currentLine.trim().split(':')[0];
  let currentLineValue = currentLine.trim().split(':')[1];
  let arrayItem = currentLine.trim().match(/^\[(\d+)\]/);

  if (currentLine.includes(':')) {
    path.push(`${currentLineKey}: ${currentLineValue}`);
  } else if (arrayItem) {
    path.push(`[${arrayItem[1]}]`);
  }

  // Filter out empty items from the path array
  path = path.filter(item => item && item !== '{');

  console.log('Updated JSON Path based on cursor:', path); // gpt_pilot_debugging_log
  return path
    .join(' > ')
    .replace(/[:\[{\\,]*$/, '')
    .replace(/"/g, '');
}

// Replaced getYamlPath function based on instructions
function getYamlPath(editor) {
  let cursor = editor.getCursor();
  let line = cursor.line;
  let ch = cursor.ch;
  let path = [];
  let lastIndentLevel = Infinity;

  for (let i = line; i >= 0; i--) {
    let lineText = editor.getLine(i);
    let indentMatch = lineText.match(/^(\s*)/);
    // Skip empty lines or lines that are not keys
    if (lineText.trim() === '' || !lineText.trim().includes(':')) continue;

    // Get the current line's indentation level and key
    let indentLevel = indentMatch ? indentMatch[0].length : 0;
    let key = lineText.trim().split(':')[0];

    // If the current line's indentation level is less than the last one, it's part of the path
    if (indentLevel < lastIndentLevel) {
      path.unshift(key); // Add to the start of the path
      lastIndentLevel = indentLevel;
    }

    // Stop if we reach the root level (no indentation)
    if (indentLevel === 0) break;
  }

  console.log('YAML Path:', path.join(' > '));
  return path.join(' > ');
}
