import { useParams, useNavigate } from 'react-router-dom';
import { CategoriaEditor } from '../components/CategoriaEditor';

export function CategoriaEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <CategoriaEditor
      categoriaId={parseInt(id)}
      onBack={() => navigate('/admin/proyectos/categorias')}
    />
  );
}
