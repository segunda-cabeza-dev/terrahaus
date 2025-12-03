import { useParams, useNavigate } from 'react-router-dom';
import { ProyectoEditor } from '../components/ProyectoEditor';

export function ProyectoEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ProyectoEditor
      proyectoId={id}
      onBack={() => navigate('/admin/proyectos')}
    />
  );
}
