// function to get breadcrumb path based on cursor position in JSON editor
function getJsonPath(editor) {
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

  console.log('JSON Path:', path.join(' > '));
  return path.join(' > ').replace(/"/g, '');
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
