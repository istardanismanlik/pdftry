import "./App.css";
import { useState } from "react";
import { Worker } from "@react-pdf-viewer/core";
// Import the main Viewer component
import { Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

function App() {
  // states
  // pdf file onChange state
  const [pdfFile, setPdfFile] = useState(null);
  // pdf file error state
  const [pdfError, setPdfError] = useState("");
  const [context, setContext] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [codes, setCodes] = useState([]);
  const [position, setPosition] = useState(null);
  const [chosen, setChosen] = useState();
  const [xYPosistion, setXyPosistion] = useState({ x: 0, y: 0 });

  const showNav = (event) => {
    if (text) {
      event.preventDefault();
      setContext(false);
      // position not used yet
      const positionChange = {
        x: event.pageX,
        y: event.pageY,
      };
      setXyPosistion(positionChange);
      setContext(true);
    }
  };
  const hideContext = (event) => {
    setContext(false);
  };
  const initMenu = (chosen) => {
    setChosen(chosen);
  };

  // handle file onChange event
  const allowedFiles = ["application/pdf"];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    // console.log(selectedFile.type);
    if (selectedFile) {
      if (selectedFile && allowedFiles.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfError("");
          setPdfFile(e.target.result);
        };
      } else {
        setPdfError("Not a valid pdf: Please select only PDF");
        setPdfFile("");
      }
    } else {
      console.log("please select a PDF");
    }
  };

  const createCode = () => {
    const myCode = { text, name: name, color: "red", position };
    setCodes([myCode, ...codes]);
    setContext(false);
    setName("");
    setText("");
    setPosition(null);
  };

  const handleMouseUp = () => {
    if (window.getSelection().toString()) {
      setText(window.getSelection().toString());
      setPosition(window.getSelection().getRangeAt(0).getBoundingClientRect());
    }
  };
  return (
    <div className="container">
      {/* Upload PDF */}
      <form>
        <label>
          <h5>Upload PDF</h5>
        </label>
        <br></br>

        <input
          type="file"
          className="form-control"
          onChange={handleFile}
        ></input>

        {/* we will display error message in case user select some file
        other than pdf */}
        {pdfError && <span className="text-danger">{pdfError}</span>}
      </form>
      {/* display all the codes here */}
      <div>
        {codes.map((code, i) => {
          return <div key={i}>{code.name}</div>;
        })}
      </div>
      {/* View PDF */}
      <h5>View PDF</h5>
      <div className="viewer">
        {/* render this if we have a pdf file */}
        {pdfFile && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
            <div
              style={{
                border: "1px solid rgba(0, 0, 0, 0.3)",
              }}
              onContextMenu={showNav}
              onClick={hideContext}
              onMouseUp={handleMouseUp}
            >
              <Viewer fileUrl={pdfFile} />
            </div>
          </Worker>
        )}

        {/* render this if we have pdfFile state null   */}
        {!pdfFile && <>No file is selected yet</>}
      </div>
      {/* pop up menu */}
      {context && (
        <div style={{ top: 273, left: 676 }} className="rightClick">
          <input
            type="text"
            placeholder="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={createCode}>create</button>
        </div>
      )}
    </div>
  );
}

export default App;
