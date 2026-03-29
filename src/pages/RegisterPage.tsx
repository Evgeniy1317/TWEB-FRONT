import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { AuthSplitCardShell } from '../components/auth/AuthSplitCardShell';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import {
  authInputClass,
  getAuthEmailAriaInvalid,
  getAuthEmailInputClass,
} from '../components/auth/authFieldClasses';

const REGISTER_IMAGE = encodeURI(
  '/media/images/original-34b544577285f74d3acfa8c67777a2ae (1).webp',
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/profile');
  };

  const handleGoogle = () => {
    window.alert('Вход через Google будет подключён позже.');
  };

  return (
    <AuthSplitCardShell imageSrc={REGISTER_IMAGE}>
      <h1 className="mb-4 text-center text-xl font-bold font-heading leading-tight text-white sm:mb-5 sm:text-2xl md:mb-5 md:text-[1.65rem]">
        Регистрация
      </h1>

      <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-2.5">
        <div>
          <label htmlFor="reg-first" className="mb-1 block text-xs font-medium text-white/85">
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
          <label htmlFor="reg-last" className="mb-1 block text-xs font-medium text-white/85">
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
        <div>
          <label htmlFor="reg-email" className="mb-1 block text-xs font-medium text-white/85">
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
          <label htmlFor="reg-password" className="mb-1 block text-xs font-medium text-white/85">
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
          className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2.5 text-sm font-bold text-dark transition-colors hover:bg-primary-dark"
        >
          <UserPlus size={17} />
          Зарегистрироваться
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
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </AuthSplitCardShell>
  );
}
