import { img } from "../lib/assets";
import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";

const HeroCasaCuadrante: React.FC = () => (
	<section className="relative min-h-[80vh] flex flex-col font-sans">
		<div className="absolute inset-0 w-full h-full z-0">
			<img
				src={img("hero-casa-cuadrante- formulario.webp")}
				alt="Casa Cuadrante Hero"
				className="w-full h-full object-cover"
				loading="eager"
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/70" />
		</div>
		<Header />
		<div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-0 flex-1 hero-content-responsive" style={{paddingTop: '120px'}}>
			<h1
				className="mb-6 uppercase tracking-tight mx-auto hero-title-responsive"
				style={{
					fontFamily: 'Bebas Neue, sans-serif',
					fontSize: '68px',
					fontWeight: 400,
					letterSpacing: '2px',
					lineHeight: 1.05,
					maxWidth: '820px',
					background: 'none',
					padding: 0,
					borderRadius: 0
				}}
			>
				<style>{`
					@media (max-width: 640px) {
						.hero-title-responsive {
							font-size: 54px !important;
							line-height: 1.08 !important;
						}
					}
				`}</style>
				CASA CUADRANTE
			</h1>
			<div 
				className="mb-6 mx-auto text-center hero-desc-responsive"
				style={{
					fontFamily: 'Barlow, sans-serif',
					fontWeight: 400,
					maxWidth: '900px',
					lineHeight: 1.3,
					fontSize: '20px',
				}}
			>
				<style>{`
					@media (max-width: 640px) {
						.hero-desc-responsive {
							font-size: 17px !important;
							line-height: 1.25 !important;
							padding-left: 14px !important;
							padding-right: 14px !important;
						}
					}
				`}</style>
				Vivienda moderna y sostenible con diseño en madera y grandes ventanales que conectan con la naturaleza. Espacios abiertos, luminosos y funcionales, ideales para disfrutar del entorno con comodidad y estilo.
			</div>
		</div>
	</section>
);

const CasaCuadrante: React.FC = () => (
	<>
		<HeroCasaCuadrante />
		<section className="max-w-5xl mx-auto px-4 py-12">
			<h2 
				className="mb-8 text-center section-title-responsive"
				style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontWeight: 700, fontSize: '45px', lineHeight: 1.08}}
			>
				<style>{`
					@media (max-width: 640px) {
						.section-title-responsive {
							font-size: 30px !important;
							line-height: 1.13 !important;
						}
					}
				`}</style>
				Descripción del proyecto
			</h2>
			<div 
				className="text-base mb-6 section-desc-responsive"
				style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, color: '#222', fontSize: '18px', paddingLeft: '24px', paddingRight: '24px'}}
			>
				<style>{`
					@media (max-width: 640px) {
						.section-desc-responsive {
							padding-left: 14px !important;
							padding-right: 14px !important;
						}
					}
				`}</style>
				<p className="mb-4">
					<span style={{color: '#b35427', fontWeight: 700, fontSize: '18px', display: 'inline-block', marginBottom: '6px'}}>Descripción técnica inicial:</span><br/>
					La Casa Cuadrante es un refugio contemporáneo diseñado para integrarse de manera armónica con su entorno natural. Construida principalmente con madera, este proyecto combina líneas modernas con un enfoque cálido y acogedor. Su diseño abierto prioriza la luminosidad natural y la conexión directa con el paisaje circundante, destacando por sus amplios ventanales que enmarcan las vistas del bosque.
				</p>
				<p className="mb-4">
					El espacio interior se organiza en una planta funcional que une la cocina, comedor y sala de estar en un área común, creando una transición fluida entre los ambientes. La madera domina tanto el techo como los revestimientos, aportando una sensación de calidez y confort. La cocina, con detalles en tonos oscuros y acabados minimalistas, contrasta de manera elegante con el resto de los espacios. Los dormitorios son serenos y luminosos, diseñados con una estética simple que refuerza la conexión con el exterior gracias a ventanas panorámicas.
				</p>
				<p className="mb-4">
					La terraza elevada, rodeada de árboles, ofrece un espacio de descanso que amplifica la relación entre la vivienda y la naturaleza. Este detalle arquitectónico eleva la experiencia del usuario, permitiéndole disfrutar de las estaciones y la tranquilidad del entorno. Materiales como el vidrio y la madera tratados cuidadosamente reflejan el compromiso del proyecto con la sostenibilidad y la durabilidad.
				</p>
				<p className="mb-4">
					<span style={{color: '#b35427', fontWeight: 700, fontSize: '18px'}}>Aspectos clave del diseño:</span>
					<ul className="list-disc pl-6 mt-2">
						<li><b>Eficiencia lumínica:</b> Los grandes ventanales maximizan la entrada de luz natural y enmarcan vistas del bosque.</li>
						<li><b>Materialidad sostenible:</b> Predomina el uso de madera y vidrio, integrando diseño moderno con tradición.</li>
						<li><b>Espacios funcionales:</b> La integración fluida de las áreas comunes fomenta la convivencia y optimiza el uso del espacio.</li>
						<li><b>Relación interior-exterior:</b> La terraza y los ventanales crean una transición perfecta hacia el paisaje.</li>
					</ul>
				</p>
				<p>
					La Casa Cuadrante es un ejemplo de cómo la arquitectura contemporánea puede respetar y potenciar la relación con el medio ambiente, ofreciendo un hogar funcional y lleno de calidez.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
				{[1,2,3,4,5,6].map(num => (
					<img 
						key={num}
						src={img(`casa-cuadrante${num}.webp`)}
						alt={`Casa Cuadrante ${num}`}
						className="w-full h-64 object-cover rounded shadow"
						style={{fontFamily: 'Barlow, sans-serif'}}
						loading="lazy"
					/>
				))}
			</div>
		</section>
				<section id="contacto">
					<Formulario />
				</section>
		<FoosterAlt />
	</>
);

export default CasaCuadrante;
