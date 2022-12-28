import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import ChatPage from "./pages/chatpage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
