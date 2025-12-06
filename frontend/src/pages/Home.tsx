import { Hero } from '../components/home/Hero';
import { AboutArt } from '../components/home/AboutArt';
import { UpcomingExhibitions } from '../components/home/UpcomingExhibitions';

export function Home() {
  return (
    <>
      <Hero />
      <UpcomingExhibitions />
      <AboutArt />
    </>
  );
}
