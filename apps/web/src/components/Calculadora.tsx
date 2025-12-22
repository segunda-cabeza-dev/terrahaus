import React, { useState } from "react";

const opciones = {
	tipologia: ["Moderna", "Tradicional"],
	plantas: ["1 Planta", "1 y 1/2 plantas", "2 Plantas"],
	habitaciones: ["1", "2", "3", "+4"],
	calidad: ["Estándar", "Premium"],
	banos: ["1", "2", "3", "+4"],
};


const Paso1 = ({ values, onChange, onNext }) => (
	<form className="w-full font-normal" style={{fontFamily: 'Inter Tight, sans-serif'}} onSubmit={e => { e.preventDefault(); onNext(); }}>
		<div className="mb-6">
			<div className="text-xl mb-2">Paso 1 de 3</div>
			<div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-8">
				<div className="h-full bg-[#0a72b1] transition-all" style={{ width: '33%' }} />
			</div>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Tipología */}
			<div>
				<label className="block mb-2 text-base">Tipología <span className="text-red-600">*</span></label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="tipologia" value={values.tipologia} onChange={onChange}>
					<option value="">Selecciona</option>
					{opciones.tipologia.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
			{/* Plantas */}
			<div>
				<label className="block mb-2 text-base">Plantas <span className="text-red-600">*</span></label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="plantas" value={values.plantas} onChange={onChange}>
					<option value="">Selecciona</option>
					{opciones.plantas.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
			{/* m2 */}
			<div>
				<label className="block mb-2 text-base">¿De cuantos m2 quieres tu casa? <span className="text-red-600">*</span></label>
				<input required type="number" min="0" className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="metros" value={values.metros} onChange={onChange} />
			</div>
			{/* Habitaciones */}
			<div>
				<label className="block mb-2 text-base">Habitaciones <span className="text-red-600">*</span></label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="habitaciones" value={values.habitaciones} onChange={onChange}>
					<option value="">Selecciona</option>
					{opciones.habitaciones.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
			{/* Calidad */}
			<div>
				<label className="block mb-2 text-base">Calidad de materiales <span className="text-red-600">*</span></label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="calidad" value={values.calidad} onChange={onChange}>
					<option value="">Selecciona</option>
					{opciones.calidad.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
			{/* Baños */}
			<div>
				<label className="block mb-2 text-base">Baños <span className="text-red-600">*</span></label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="banos" value={values.banos} onChange={onChange}>
					<option value="">Selecciona</option>
					{opciones.banos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
		</div>
		<button type="submit" className="mt-8 bg-[#b35427] text-white px-8 py-3 rounded font-normal hover:bg-[#a3471d] transition text-base">Siguiente</button>
	</form>
);

const opcionesPaso2 = {
	cuando: ["Cuanto antes", "Dentro de los próximos 2 meses", "Mas de 2 meses"],
	terreno: ["Si, ya tengo", "No"],
	servicios: [
		"Climatización central",
		"Paneles solares",
		"Automatizaciones",
		"Suelo radiante",
		"Punto de carga para coche eléctrico",
		"Zona de barbacoas",
		"Terraza",
		"Garage",
		"Comedor exterior",
		"Estufa hogar",
	],
};

const Paso2 = ({ values, onChange, onCheck, onPrev, onNext }) => (
	<form className="w-full font-normal" style={{fontFamily: 'Inter Tight, sans-serif'}} onSubmit={e => { e.preventDefault(); onNext(); }}>
		<div className="mb-6">
			<div className="text-xl mb-2">Paso 2 de 3</div>
			<div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-8">
				<div className="h-full bg-[#0a72b1] transition-all" style={{ width: '66%' }} />
			</div>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* ¿Cuándo deseas comenzar? */}
			<div>
				<label className="block mb-2 text-base font-normal">¿Cuándo deseas comenzar?</label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="cuando" value={values.cuando} onChange={onChange}>
					<option value="">Selecciona</option>
					{opcionesPaso2.cuando.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
			{/* ¿Tienes terreno? */}
			<div>
				<label className="block mb-2 text-base font-normal">¿Tienes terreno? <span className="text-red-600">*</span></label>
				<select required className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="terreno" value={values.terreno} onChange={onChange}>
					<option value="">Selecciona</option>
					{opcionesPaso2.terreno.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			</div>
		</div>
		{/* Servicios opcionales */}
		<div className="mt-8">
			<label className="block mb-4 text-base font-normal">Servicios opcionales</label>
			<div className="flex flex-wrap gap-x-8 gap-y-4">
				{opcionesPaso2.servicios.map(opt => (
					<label key={opt} className="flex items-center gap-2 text-base font-normal">
						<input type="checkbox" name="servicios" value={opt} checked={values.servicios?.includes(opt)} onChange={onCheck} className="accent-[#b35427] w-5 h-5" />
						{opt}
					</label>
				))}
			</div>
		</div>
		<div className="flex gap-4 mt-10">
			<button type="button" onClick={onPrev} className="bg-gray-200 text-black px-8 py-3 rounded font-normal hover:bg-gray-300 transition text-base">Anterior</button>
			<button type="submit" className="bg-[#b35427] text-white px-8 py-3 rounded font-normal hover:bg-[#a3471d] transition text-base">Siguiente</button>
		</div>
	</form>
);

const Paso3 = ({ values, onChange, onPrev, onSubmit }) => (
	<form className="w-full font-normal" style={{fontFamily: 'Inter Tight, sans-serif'}} onSubmit={e => { e.preventDefault(); onSubmit(); }}>
		<div className="mb-6">
			<div className="text-xl mb-2">Paso 3 de 3</div>
			<div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-8">
				<div className="h-full bg-[#0a72b1] transition-all" style={{ width: '100%' }} />
			</div>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label className="block mb-2 text-base">Nombre <span className="text-red-600">*</span></label>
				<input required type="text" className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="nombre" value={values.nombre} onChange={onChange} />
			</div>
			<div>
				<label className="block mb-2 text-base">Email <span className="text-red-600">*</span></label>
				<input required type="email" className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="email" value={values.email} onChange={onChange} />
			</div>
			<div>
				<label className="block mb-2 text-base">Teléfono <span className="text-red-600">*</span></label>
				<input required type="tel" className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="telefono" value={values.telefono} onChange={onChange} />
			</div>
			<div>
				<label className="block mb-2 text-base">Código postal <span className="text-red-600">*</span></label>
				<input required type="text" className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="cp" value={values.cp} onChange={onChange} />
			</div>
		</div>
		<div className="mt-8">
			<label className="block mb-2 text-base">Comentanos más sobre tu proyecto:</label>
			<textarea className="w-full border border-gray-400 rounded px-4 py-3 text-base" name="comentarios" value={values.comentarios} onChange={onChange} rows={4} />
		</div>
		<div className="flex gap-4 mt-10">
			<button type="button" onClick={onPrev} className="bg-gray-200 text-black px-8 py-3 rounded font-normal hover:bg-gray-300 transition text-base">Anterior</button>
			<button type="submit" className="bg-[#b35427] text-white px-8 py-3 rounded font-normal hover:bg-[#a3471d] transition text-base w-full">Solicitar cotización</button>
		</div>
	</form>
);

const Calculadora = () => {
		const [step, setStep] = useState(1);
		const [values, setValues] = useState({
			tipologia: "",
			plantas: "",
			metros: "",
			habitaciones: "",
			calidad: "",
			banos: "",
			cuando: "",
			terreno: "",
			servicios: [],
			nombre: "",
			email: "",
			telefono: "",
			cp: "",
			comentarios: "",
		});

		const handleChange = e => {
			const { name, value } = e.target;
			setValues(v => ({ ...v, [name]: value }));
		};

		const handleCheck = e => {
			const { value, checked } = e.target;
			setValues(v => {
				const servicios = new Set(v.servicios || []);
				if (checked) servicios.add(value);
				else servicios.delete(value);
				return { ...v, servicios: Array.from(servicios) };
			});
		};

		const handleSubmit = () => {
			// Aquí irá la lógica de envío final
			alert('¡Cotización enviada!');
		};

		return (
			<section className="w-full bg-white py-12 px-4 md:px-8">
				<div className="max-w-5xl mx-auto">
					{step === 1 && (
						<Paso1 values={values} onChange={handleChange} onNext={() => setStep(2)} />
					)}
					{step === 2 && (
						<Paso2 values={values} onChange={handleChange} onCheck={handleCheck} onPrev={() => setStep(1)} onNext={() => setStep(3)} />
					)}
					{step === 3 && (
						<Paso3 values={values} onChange={handleChange} onPrev={() => setStep(2)} onSubmit={handleSubmit} />
					)}
				</div>
			</section>
		);
};

export default Calculadora;
