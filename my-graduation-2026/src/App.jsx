import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FadeInSection from './components/FadeInSection';
import CollagePage from './pages/CollagePage';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import WishesPage from './pages/WishesPage';
import GuidePage from './pages/GuidePage';
import PersonalityPage from './pages/PersonalityPage';

function App() {
  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth">
      
      <FadeInSection id="collage" zIndex={10} className="bg-[#f2eee3]">
        <CollagePage />
      </FadeInSection>

      <FadeInSection id="map" zIndex={20} className="bg-gray-50">
        <MapPage />
      </FadeInSection>

      <FadeInSection id="timeline" zIndex={30} className="bg-[#faf9f6]">
        <TimelinePage />
      </FadeInSection>

      <FadeInSection id="wishes" zIndex={40} className="bg-[#fafaf9]">
        <WishesPage />
      </FadeInSection>

      <FadeInSection id="guide" zIndex={50} className="bg-blue-50">
        <GuidePage />
      </FadeInSection>

      <FadeInSection id="album" zIndex={60} className="bg-slate-100">
        <PersonalityPage />
      </FadeInSection>

    </div>  
  );
}

export default App;