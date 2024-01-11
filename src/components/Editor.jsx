import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/display/autorefresh.js'; // Import this addon for auto-refresh
import { Actions } from '../Actions';
const Editor = ({ socketRef, roomId ,onCodeChange}) => {
  const editorRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        autorefresh: true, // Enable auto-refresh
      });

      editorRef.current.on('change', (instance, changes) => {

        const { origin } = changes;        //origin of editor e.g. input , setValue or copy , paste
        const code = instance.getValue();    //getting code of editor
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(Actions.CODE_CHANGE, {
            roomId,
            code,
          })
        }
      })



    }
    init();

  }, [])

  useEffect(() => {
    if (socketRef.current !== null) {
      socketRef.current.on(Actions.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);  //dynamically setting code for all users through setValue
        }
      })
    }
    return ()=>{
      socketRef.current.off(Actions.CODE_CHANGE);
    }
  }, [socketRef.current])
  return (
    <textarea id="realtimeEditor" ></textarea>
  )
}

export default Editor