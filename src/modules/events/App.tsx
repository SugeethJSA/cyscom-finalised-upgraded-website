import "./index.css";
import { Routes, Route } from "react-router-dom";
import { TargetCursor } from "@cyscomvit/cyscomui";
import EventsHub from "./pages/EventsHub";
import PublicRegister from "./pages/PublicRegister";
import PublicTransfer from "./pages/PublicTransfer";

export default function App() {
  return (
    <>
      <Routes>
        {/* Global Events Hub Landing Page */}
        <Route path="/" element={<EventsHub />} />

        {/* Public Forms Scoped by Event Slug */}
        <Route path=":slug/register" element={<PublicRegister />} />
        <Route path=":slug/transfer" element={<PublicTransfer />} />
      </Routes>
    </>
  );
}
