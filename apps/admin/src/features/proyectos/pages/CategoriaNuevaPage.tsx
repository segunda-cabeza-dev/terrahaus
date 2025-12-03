import { useNavigate } from 'react-router-dom';
import { CategoriaNueva } from '../components/CategoriaNueva';

export function CategoriaNuevaPage() {
  const navigate = useNavigate();

  return (
    <CategoriaNueva
      onBack={() => navigate('/admin/proyectos/categorias')}
    />
  );
}
