import React from "react";
import ChatBot from "./components/ChatBot";

function App() {
    return (
        <div style={{ height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
            <iframe
                src="http://localhost:1978"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    overflow: "hidden",
                }}
                title="Content"
            />
            <ChatBot />
        </div>
    );
}

export default App;
