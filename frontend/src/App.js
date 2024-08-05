import React, { useEffect, useRef, useState } from "react";
import Flow from "@flowjs/flow.js";
import "./App.css";

const FlowUpload = () => {
  const flowRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const flow = new Flow({
      target: "http://localhost:5000/upload",
      chunkSize: 1024 * 1024,
      testChunks: false,
      singleFile: true,
    });

    flowRef.current = flow;

    flow.assignDrop(dropZoneRef.current);

    flow.on("fileAdded", (file, event) => {
      console.log("File added:", file);
      setFiles(prevFiles => {
        if (!prevFiles.some(f => f.uniqueIdentifier === file.uniqueIdentifier)) {
          return [...prevFiles, { ...file, status: "Pending" }];
        }
        return prevFiles;
      });
    });

    flow.on("fileSuccess", (file, message) => {
      console.log("File uploaded successfully:", file, message);
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.uniqueIdentifier === file.uniqueIdentifier ? { ...f, status: "Uploaded" } : f
        )
      );
    });

    flow.on("fileError", (file, message) => {
      console.log("File upload failed:", file, message);
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.uniqueIdentifier === file.uniqueIdentifier ? { ...f, status: "Failed" } : f
        )
      );
    });

    flow.on("uploadStart", () => {
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.status === "Pending" ? { ...f, status: "Uploading" } : f
        )
      );
    });

    return () => {
      flow.cancel();
    };
  }, []);

  const handleBrowse = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      flowRef.current.addFile(selectedFile);
    }
  };

  const startUpload = () => {
    if (flowRef.current) {
      console.log("Starting upload...");
      flowRef.current.upload();
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <div>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileSelect}
        />
        <button onClick={handleBrowse}>Browse Files</button>
      </div>
      <div ref={dropZoneRef} style={{ border: '2px dashed #ccc', padding: '40px', margin: '20px 0', minHeight: '150px' }}>
        <p>Drag & Drop files here</p>
      </div>
      <button onClick={startUpload} disabled={files.length === 0}>
        Start Upload
      </button>
      <div>
        <h3>Selected Files:</h3>
        <ul>
          {files.map((file) => (
            <li key={file.uniqueIdentifier}>
              {file.name} [{file.status}]
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlowUpload;