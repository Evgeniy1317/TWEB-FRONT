import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthSplitCardShell } from '../components/auth/AuthSplitCardShell';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import {
  authInputClass,
  getAuthEmailAriaInvalid,
  getAuthEmailInputClass,
} from '../components/auth/authFieldClasses';

const LOGIN_IMAGE = '/media/images/original-54780b5d8c3bd316e079f55fc52e6baf.webp';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  /** Красный/зелёный только после ухода с поля; при фокусе снова нейтрально */
  const [emailShowValidation, setEmailShowValidation] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/profile');
  };

  const handleGoogle = () => {
    window.alert('Вход через Google будет подключён позже.');
  };

  return (
    <AuthSplitCardShell imageSrc={LOGIN_IMAGE}>
      <h1 className="mb-2 text-center text-xl font-bold font-heading leading-tight text-white sm:text-2xl md:text-[1.65rem]">
        С возвращением!
      </h1>
      <p className="mb-4 text-center text-xs text-white/45 sm:mb-5 sm:text-sm">
        Рады снова видеть вас в SmashMarket
      </p>

      <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-2.5">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-xs font-medium text-white/85">
            Email адрес
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setEmailShowValidation(false)}
            onBlur={() => setEmailShowValidation(true)}
            className={getAuthEmailInputClass(email, emailShowValidation)}
            placeholder="you@mail.md"
            aria-invalid={getAuthEmailAriaInvalid(email, emailShowValidation)}
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1 block text-xs font-medium text-white/85">
            Пароль
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${authInputClass} pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-none p-0.5 text-white/45 hover:text-white/80"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2.5 text-sm font-bold text-dark transition-colors hover:bg-primary-dark"
        >
          <LogIn size={17} />
          Войти
        </button>
      </form>

      <div className="relative my-4 md:my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/12" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider text-white/35">
          <span className="bg-[#111] px-3">или</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-none border border-white/22 bg-white py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-white/95"
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        Войти через Google
      </button>

      <p className="mt-4 text-center text-xs text-white/45 sm:text-sm">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </AuthSplitCardShell>
  );
}
