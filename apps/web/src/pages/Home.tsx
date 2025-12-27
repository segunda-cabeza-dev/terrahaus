import React from "react";
import Hero from "../components/Hero";
import GlampingPreview from "../components/GlampingPreview";
import Especializaciones from "../components/Especializaciones";
import Formulario from "../components/Formulario";
import { FoosterAlt } from "../components/Fooster";

const Home: React.FC = () => (
  <>
    <Hero />
    <Especializaciones />
    <GlampingPreview />
    <section id="contacto">
      <Formulario />
    </section>
  <FoosterAlt />
  </>
);

export default Home;
