import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const auth = getAuth();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const auth = getAuth();
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Sign In'}</h2>
      <form onSubmit={handleEmailAuth} className="flex flex-col gap-2 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? 'Loading...' : isRegister ? 'Register' : 'Sign In'}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} disabled={loading} className="mt-2 bg-red-500 text-white p-2 rounded">
        Sign in with Google
      </button>
      <button onClick={() => setIsRegister(r => !r)} className="mt-2 text-blue-700 underline">
        {isRegister ? 'Already have an account? Sign In' : 'No account? Register'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
