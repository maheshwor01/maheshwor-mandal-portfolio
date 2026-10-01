import { useRef } from 'react'
import About from './components/About'
import BgFx from './components/BgFx'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'
import useScrollSpy from './hooks/useScrollSpy'

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'experience', 'contact']

export default function App() {
  const activeSection = useScrollSpy(SECTION_IDS)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)

  return (
    <>
      <BgFx />
      <Navbar
        activeSection={activeSection}
        onActivateTab={(id) => skillsRef.current?.activateTab(id)}
        onExpandAbout={() => aboutRef.current?.expandReadMore()}
        onExpandSkillsShowMore={() => skillsRef.current?.expandDataShowMore?.()}
      />
      <main>
        <Hero />
        <About ref={aboutRef} />
        <Skills ref={skillsRef} />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
