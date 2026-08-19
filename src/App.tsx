import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { ScrollTop } from './components/ScrollTop'
import Home from './pages/Home'
import About from './pages/About'
import Story from './pages/Story'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Journal from './pages/Journal'
import JournalDetail from './pages/JournalDetail'
import Collaboration from './pages/Collaboration'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Styleguide from './pages/Styleguide'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="story" element={<Story />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<JournalDetail />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/styleguide" element={<Styleguide />} />
      </Routes>
    </BrowserRouter>
  )
}
