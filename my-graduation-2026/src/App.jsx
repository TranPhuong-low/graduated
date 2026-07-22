import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FadeInSection from './components/FadeInSection';
import CollagePage from './pages/CollagePage';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import WishesPage from './pages/WishesPage';
import GuidePage from './pages/GuidePage';
import PersonalityPage from './pages/PersonalityPage';

import BackgroundImage from './assets/image.png';

function App() {
  return (
    <div 
      className="h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      
      <FadeInSection id="collage" zIndex={10}>
        <CollagePage />
      </FadeInSection>

      <FadeInSection id="map" zIndex={20}>
        <MapPage />
      </FadeInSection>

      <FadeInSection id="timeline" zIndex={30}>
        <TimelinePage />
      </FadeInSection>

      <FadeInSection id="wishes" zIndex={40}>
        <WishesPage />
      </FadeInSection>

      <FadeInSection id="guide" zIndex={50}>
        <GuidePage />
      </FadeInSection>

      <FadeInSection id="album" zIndex={60}>
        <PersonalityPage />
      </FadeInSection>

    </div>  
  );
}

export default App;