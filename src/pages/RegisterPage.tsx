import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { AuthSplitCardShell } from '../components/auth/AuthSplitCardShell';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import {
  authInputClass,
  getAuthEmailAriaInvalid,
  getAuthEmailInputClass,
} from '../components/auth/authFieldClasses';
import { getPostAuthRedirect } from '../utils/postAuthRedirect';
import { publicUrl } from '../lib/publicUrl';

const REGISTER_IMAGE = encodeURI(
  publicUrl('media/images/original-34b544577285f74d3acfa8c67777a2ae (1).webp'),
);

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailShowValidation, setEmailShowValidation] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const displayName = [firstName, lastName].filter(Boolean).join(' ').trim();
    login(email, password, displayName ? { name: displayName } : undefined);
    navigate(getPostAuthRedirect(location.state));
  };

  const handleGoogle = () => {
    window.alert('Вход через Google будет подключён позже.');
  };

  return (
    <AuthSplitCardShell imageSrc={REGISTER_IMAGE}>
      <h1 className="mb-2 text-center text-xl font-bold font-heading leading-tight text-white sm:text-2xl md:text-[1.6rem]">
        Регистрация
      </h1>

      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-x-3">
          <div>
            <label htmlFor="reg-first" className="mb-0.5 block text-xs font-medium text-white/85">
              Имя
            </label>
            <input
              id="reg-first"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className={authInputClass}
              placeholder="Иван"
            />
          </div>
          <div>
            <label htmlFor="reg-last" className="mb-0.5 block text-xs font-medium text-white/85">
              Фамилия
            </label>
            <input
              id="reg-last"
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className={authInputClass}
              placeholder="Иванов"
            />
          </div>
        </div>
        <div>
          <label htmlFor="reg-email" className="mb-0.5 block text-xs font-medium text-white/85">
            Email адрес
          </label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password" className="mb-0.5 block text-xs font-medium text-white/85">
            Пароль
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
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
          className="mt-0 flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2 text-sm font-bold text-dark transition-colors hover:bg-primary-dark"
        >
          <UserPlus size={17} />
          Зарегистрироваться
        </button>
      </form>

      <div className="relative my-3 md:my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/12" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-white/35 sm:text-xs">
          <span className="bg-[#111] px-2 sm:px-3">или</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-none border border-white/22 bg-white py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-white/95"
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        Войти через Google
      </button>

      <p className="mt-3 text-center text-xs text-white/45">
        Уже есть аккаунт?{' '}
        <Link to="/login" state={location.state} className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </AuthSplitCardShell>
  );
}
