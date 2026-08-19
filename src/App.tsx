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

/**
 * 路由樹只有這一份。
 * 瀏覽器端由下面的 App 包 BrowserRouter；
 * build 時的預先渲染由 entry-server.tsx 包 StaticRouter（scripts/prerender.mjs）。
 */
export function AppRoutes() {
  return (
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
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <AppRoutes />
    </BrowserRouter>
  )
}
