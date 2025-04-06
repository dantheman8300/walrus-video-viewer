import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ViewPage } from './pages/ViewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/view/:id" element={<ViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
