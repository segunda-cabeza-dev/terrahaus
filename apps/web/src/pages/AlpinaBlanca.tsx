
import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";

// Hero reutilizable para esta página

const HeroAlpina: React.FC = () => (
	<section className="relative min-h-[80vh] flex flex-col font-sans">
		<div className="absolute inset-0 w-full h-full z-0">
			<img
				src="/assets/images/hero-alpina-formulario.jpg"
				alt="Alpina Blanca Hero"
				className="w-full h-full object-cover"
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
					ALPINA BLANCA
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
					Vivienda sostenible en madera, con diseño cálido, grandes ventanales y conexión total con la naturaleza, perfecta para climas fríos y paisajes únicos.
				</div>
			</div>
	</section>
);

const AlpinaBlanca: React.FC = () => (
	<>
		<HeroAlpina />
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
						EcoHouse es una vivienda unifamiliar pasiva y bioclimática construida con materiales tradicionales como ladrillo cerámico y mortero, combinados con sistemas de aislamiento térmico eficientes.
					</p>
					<p className="mb-4">
						Su diseño busca maximizar la eficiencia energética y el confort interior mediante estrategias como techos verdes, carpintería de madera con vidrio de doble acristalamiento y tragaluces para optimizar la iluminación natural. Además, utiliza un sistema de riego sostenible que recolecta agua de lluvia, integrando soluciones prácticas y ecológicas.
					</p>
					<p className="mb-4">
						  <span style={{color: '#b35427', fontWeight: 700, fontSize: '18px', display: 'inline-block', marginBottom: '6px'}}>Objetivo del proyecto:</span><br/>
						Crear un hogar cómodo, saludable y de bajo consumo energético, adaptado a un terreno con orientación desfavorable (norte), maximizando la conexión interior-exterior característica de la arquitectura mediterránea.
					</p>
					<p className="mb-4">
						  <span style={{color: '#b35427', fontWeight: 700, fontSize: '18px'}}>Aspectos destacados del diseño:</span>
						<ul className="list-disc pl-6 mt-2">
							<li><b>Diseño bioclimático:</b> Organización estratégica de los espacios para optimizar la luz y el calor natural. Las áreas habitables se orientan al este, mientras que los dormitorios y terrazas ajardinadas refuerzan la conexión con el exterior.</li>
							<li><b>Eficiencia energética:</b> Implementación de techos verdes, el efecto “botijo” para refrigeración pasiva, y protecciones solares como persianas mallorquinas.</li>
							<li><b>Paisajismo sostenible:</b> Jardines diseñados con especies autóctonas que interactúan con la arquitectura y generan espacios de sombra y recreación.</li>
						</ul>
					</p>
					<p>
						Este proyecto combina técnicas tradicionales con soluciones modernas para lograr un equilibrio entre diseño arquitectónico, eficiencia energética y sostenibilidad ambiental.
					</p>
				</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
				{[1,2,3,4,5,6,7,8].map(num => (
					<img 
						key={num}
						src={`/assets/images/alpina-blanca${num}.jpg`}
						alt={`Alpina Blanca ${num}`}
						className="w-full h-64 object-cover rounded shadow"
						style={{fontFamily: 'Barlow, sans-serif'}}
					/>
				))}
			</div>
		</section>
		<Formulario />
		<FoosterAlt />
	</>
);

export default AlpinaBlanca;
