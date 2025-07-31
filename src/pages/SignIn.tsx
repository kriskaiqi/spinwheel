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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-8">{isRegister ? 'Register' : 'Sign In'}</h2>
      <div className="signin-form-container">
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 w-80">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="p-3 border-2 border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="p-3 border-2 border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          />
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>
        <button onClick={handleGoogleSignIn} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          Sign in with Google
        </button>
        <button onClick={() => setIsRegister(r => !r)} className="text-blue-400 hover:text-blue-300 underline font-semibold">
          {isRegister ? 'Already have an account? Sign In' : 'No account? Register'}
        </button>
      </div>
      {error && <div className="text-red-400 mt-4">{error}</div>}
    </div>
  );
}