import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";

const HeroPequenaAndina: React.FC = () => (
	<section className="relative min-h-[80vh] flex flex-col font-sans">
		<div className="absolute inset-0 w-full h-full z-0">
			<img
				src="/assets/images/hero-pequena-andina.jpg"
				alt="Pequeña Andina Hero"
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
					PEQUEÑA ANDINA
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
					Una cabaña cálida y sostenible que combina madera y piedra para integrarse al paisaje andino. Con espacios compactos, funcionales y grandes ventanales que conectan el interior con la naturaleza, es el refugio perfecto para disfrutar del entorno en confort y armonía.
				</div>
			</div>
	</section>
);

const PequenaAndina: React.FC = () => (
	<>
		<HeroPequenaAndina />
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
					  La Pequeña Andina es una cabaña diseñada para reflejar la esencia de los paisajes montañosos, combinando un estilo arquitectónico tradicional con un enfoque moderno y sostenible. Construida principalmente con madera y piedra, materiales típicos de las regiones andinas, esta vivienda destaca por su calidez, simplicidad y funcionalidad. Su diseño está pensado para integrarse completamente al entorno, ofreciendo refugio y confort en climas fríos.
					</p>
					<p className="mb-4">
					  Los interiores presentan una estética minimalista con acabados naturales. Las paredes y techos de madera generan una atmósfera cálida, mientras que los grandes ventanales enmarcan las vistas de las montañas, inundando los espacios de luz natural. La distribución interior es compacta pero eficiente, maximizando cada rincón. La cocina y sala de estar se integran en un solo espacio común, mientras que los dormitorios ofrecen privacidad y confort con detalles cuidadosamente diseñados.
					</p>
					<p className="mb-4">
					  En el exterior, las terrazas y balcones invitan a disfrutar del entorno natural, ofreciendo espacios para la contemplación y el descanso. La Pequeña Andina se eleva sobre una base de piedra, protegiendo la estructura del terreno y añadiendo un toque rústico que complementa el diseño general.
					</p>
					<p className="mb-4">
					  <span style={{color: '#b35427', fontWeight: 700, fontSize: '18px'}}>Aspectos clave del diseño:</span>
					  <ul className="list-disc pl-6 mt-2">
					    <li><b>Materialidad regional:</b> Uso de madera y piedra para reflejar la identidad andina y garantizar durabilidad.</li>
					    <li><b>Integración con el paisaje:</b> Grandes ventanales y terrazas conectan los interiores con el entorno.</li>
					    <li><b>Espacios compactos y funcionales:</b> Diseño interior optimizado para un confort moderno en un formato reducido.</li>
					    <li><b>Sostenibilidad:</b> Diseño eficiente en energía y uso de materiales locales.</li>
					  </ul>
					</p>
					<p>
					  La Pequeña Andina es una combinación perfecta de tradición y modernidad, creada para quienes buscan un refugio cálido, funcional y en conexión con la naturaleza.
					</p>
					</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
					{[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
						<img 
							key={num}
							src={`/assets/images/pequena-andina${num}.jpg`}
							alt={`Pequeña Andina ${num}`}
							className="w-full h-64 object-cover rounded shadow"
							style={{fontFamily: 'Barlow, sans-serif'}}
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

export default PequenaAndina;
