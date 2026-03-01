import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RSVPPage from './pages/RSVPPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rsvp/:eventId" element={<RSVPPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
