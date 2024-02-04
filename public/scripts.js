$(document).ready(function () {
  function enterFullScreen(editor) {
    document.querySelectorAll('.CodeMirror').forEach(function (element) {
      element.style.maxHeight = '100vh';
    });
  }

  function exitFullScreen(editor) {
    // ... code to exit full screen mode ...
    document.querySelectorAll('.CodeMirror').forEach(function (element) {
      element.style.maxHeight = '600px';
    });
  }

  var jsonEditor, yamlEditor;
  try {
    jsonEditor = CodeMirror.fromTextArea(
      document.getElementById('jsonEditor'),
      {
        mode: { name: 'javascript', json: true },
        theme: 'monokai',
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: {
          F11: function (cm) {
            cm.setOption('fullScreen', !cm.getOption('fullScreen'));
            enterFullScreen(jsonEditor);
          },
          Esc: function (cm) {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
            exitFullScreen(jsonEditor);
          },
        },
      }
    );
    console.log('JSON editor initialized successfully.');
  } catch (error) {
    console.error(
      'Initialization of JSON Editor failed:',
      error.message,
      error.stack
    );
  }

  try {
    yamlEditor = CodeMirror.fromTextArea(
      document.getElementById('yamlEditor'),
      {
        mode: 'yaml',
        theme: 'monokai',
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: {
          F11: function (cm) {
            cm.setOption('fullScreen', !cm.getOption('fullScreen'));
            var codeMirrorElement =
              document.getElementsByClassName('CodeMirror')[0];
            if (cm.getOption('fullScreen')) {
              enterFullScreen(yamlEditor);
            } else {
              exitFullScreen(yamlEditor);
            }
          },
          Esc: function (cm) {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
          },
        },
      }
    );
    console.log('YAML editor initialized successfully.');
    document.getElementById('yamlEditorContainer').style.display = 'none';
  } catch (error) {
    console.error(
      'Initialization of YAML Editor failed:',
      error.message,
      error.stack
    );
  }

  jsonEditor.setSize(null, 'auto');
  yamlEditor.setSize(null, 'auto');

  jsonEditor.on('cursorActivity', function () {
    const path = getJsonPath(jsonEditor);
    $('#breadcrumb').text(`${path}`);
  });

  yamlEditor.on('cursorActivity', function () {
    $('#breadcrumb').text(`${getYamlPath(yamlEditor)}`);
  });

  $('#jsonYamlToggle').change(function () {
    console.log('Toggle switched. Updating editors visibility...');
    if (this.checked) {
      $('#jsonEditor').parent().hide();
      $('#yamlEditorContainer').show();
      var jsonData = jsonEditor.getValue();
      // console.log('Current JSON content:', jsonData); // gpt_pilot_debugging_log
      try {
        var yamlData = jsyaml.dump(JSON.parse(jsonData));
        try {
          yamlEditor.setValue(yamlData);
          setTimeout(function () {
            yamlEditor.refresh();
          }, 1);
          console.log('YAML editor refreshed.'); // gpt_pilot_debugging_log
        } catch (error) {
          console.error(
            'Error refreshing YAML editor:',
            error.message,
            error.stack
          ); // gpt_pilot_debugging_log
        }
        console.log('Conversion to YAML successful.'); // gpt_pilot_debugging_log
      } catch (error) {
        console.error(
          'Error during conversion to YAML: ',
          error.message,
          error.stack
        ); // gpt_pilot_debugging_log
        alert('Error in converting to YAML. Please ensure the JSON is valid.');
      }
    } else {
      $('#yamlEditorContainer').hide();
      $('#jsonEditor').parent().show();
      var yamlData = yamlEditor.getValue();
      // console.log('Current YAML content:', yamlData); // gpt_pilot_debugging_log
      try {
        var objectData = jsyaml.load(yamlData);
        // console.log('Converted JavaScript object:', objectData); // Debugging log
        var jsonData = JSON.stringify(objectData, null, 2);
        try {
          jsonEditor.setValue(jsonData);
          setTimeout(function () {
            jsonEditor.refresh();
          }, 1);
          console.log('JSON editor refreshed.'); // gpt_pilot_debugging_log
        } catch (error) {
          console.error(
            'Error refreshing JSON editor:',
            error.message,
            error.stack
          ); // gpt_pilot_debugging_log
        }
        console.log('Conversion to JSON and formatting successful.'); // gpt_pilot_debugging_log
      } catch (error) {
        console.error(
          'Error during conversion to JSON: ',
          error.message,
          error.stack
        ); // gpt_pilot_debugging_log
        alert('Error in converting to JSON. Please ensure the YAML is valid.');
      }
    }
  });
});
