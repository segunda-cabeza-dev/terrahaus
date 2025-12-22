import React from "react";
import Hero from "../components/Hero";
import Especializaciones from "../components/Especializaciones";
import Formulario from "../components/Formulario";
import Footer from "../components/Footer";

const Home: React.FC = () => (
  <>
    <Hero />
    <Especializaciones />
    <Formulario />
    <Footer />
  </>
);

export default Home;
