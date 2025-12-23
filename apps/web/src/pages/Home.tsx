import React from "react";
import Hero from "../components/Hero";
import Especializaciones from "../components/Especializaciones";
import Formulario from "../components/Formulario";
import { FoosterAlt } from "../components/Fooster";

const Home: React.FC = () => (
  <>
    <Hero />
    <Especializaciones />
    <Formulario />
  <FoosterAlt />
  </>
);

export default Home;
