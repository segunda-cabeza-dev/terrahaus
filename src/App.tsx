import { Routes, Route } from 'react-router-dom'
import ComponentsShowcase from './pages/ComponentsShowcase'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="container mx-auto p-8"><h1 className="text-4xl font-bold">Beltrame Web</h1><p className="mt-4">Visita <a href="/elements" className="text-primary underline">/elements</a> para ver los componentes</p></div>} />
      <Route path="/elements" element={<ComponentsShowcase />} />
    </Routes>
  )
}

export default App
