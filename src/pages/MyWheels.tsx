import { useEffect, useState } from 'react';
import { loadWheels, deleteWheel } from '../api/firestore';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function MyWheels({ onLoadWheel }: { onLoadWheel: (entries: string[]) => void }) {
  const { currentUser } = useAuth();
  const [wheels, setWheels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    loadWheels(currentUser.uid).then(setWheels).finally(() => setLoading(false));
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    await deleteWheel(id);
    setWheels(wheels.filter(w => w.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Wheels</h2>
      <ul>
        {wheels.map(wheel => (
          <li key={wheel.id} className="mb-2 flex items-center gap-2">
            <button
              className="text-blue-600 underline"
              onClick={() => {
                onLoadWheel(wheel.entries);
                navigate('/');
              }}
            >
              {wheel.entries.join(', ')}
            </button>
            <button
              className="text-red-500"
              onClick={() => handleDelete(wheel.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
