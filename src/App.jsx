import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Layout} from './pages/Layout';
import {Dashboard} from './pages/Dashboard';
import {Assets} from './pages/Assets';
import { Production } from './pages/Production';
import { Compliance } from './pages/Compliance';
import {Analytics} from './pages/Analytics';
import { Maintanance } from './pages/Maintanance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Everything inside this Route will use the Layout component */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="production" element={<Production />} />
          <Route path="maintanance" element={<Maintanance />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;