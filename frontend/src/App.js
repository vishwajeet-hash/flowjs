import React, { useEffect, useRef, useState } from "react";
import Flow from "@flowjs/flow.js";
import "./App.css";

const FlowUpload = () => {
  const flowRef = useRef(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const flow = new Flow({
      target: "http://localhost:5000/upload", // Full URL of your backend endpoint
      chunkSize: 1024 * 1024, // 1MB
      testChunks: false,
    });

    const browseButton = document.getElementById("browseButton");
    const dropZone = document.getElementById("dropZone");

    if (browseButton && dropZone) {
      flow.assignBrowse(browseButton);
      flow.assignDrop(dropZone);
    } else {
      console.error("Browse button or drop zone not found");
    }

    flow.on("fileAdded", (file) => {
      console.log("File added:", file);
      setFiles((prevFiles) => [...prevFiles, file]);
    });

    flow.on("filesSubmitted", (fileArray) => {
      console.log("Files submitted:", fileArray);
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    });

    flow.on("fileSuccess", (file, message) => {
      console.log("File uploaded successfully:", file, message);
    });

    flow.on("fileError", (file, message) => {
      console.log("File upload failed:", file, message);
    });

    flowRef.current = flow;
  }, []);

  const startUpload = () => {
    if (flowRef.current) {
      flowRef.current.upload();
    }
  };

  return (
    <div>
      <button id="browseButton">Browse</button>
      <div id="dropZone" className="dropZone">
        Drop files here
      </div>
      <button onClick={startUpload}>Start Upload</button>
      <div>
        <h3>Selected Files:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlowUpload;
