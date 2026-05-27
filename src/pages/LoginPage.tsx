import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthSplitCardShell } from '../components/auth/AuthSplitCardShell';
import {
  authInputClass,
  getAuthEmailAriaInvalid,
  getAuthEmailInputClass,
} from '../components/auth/authFieldClasses';
import { getPostAuthRedirect } from '../utils/postAuthRedirect';
import { publicUrl } from '../lib/publicUrl';

const LOGIN_IMAGE = publicUrl('media/images/original-54780b5d8c3bd316e079f55fc52e6baf.webp');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailShowValidation, setEmailShowValidation] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(getPostAuthRedirect(location.state));
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="mb-1 flex items-center justify-between gap-2">
            <label htmlFor="login-password" className="block text-xs font-medium text-white/85">
              Пароль
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-medium text-primary/90 transition-colors hover:text-primary sm:text-xs"
            >
              Забыли пароль?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${authInputClass} pr-10`}
              placeholder="********"
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
          disabled={isSubmitting}
          className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2.5 text-sm font-bold text-dark transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-65"
        >
          <LogIn size={17} />
          {isSubmitting ? 'Входим...' : 'Войти'}
        </button>

        {error && (
          <p className="text-center text-xs font-medium text-red-300" role="alert">
            {error}
          </p>
        )}
      </form>

      <p className="mt-4 text-center text-xs text-white/45 sm:text-sm">
        Нет аккаунта?{' '}
        <Link to="/register" state={location.state} className="font-medium text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </AuthSplitCardShell>
  );
}

function getLoginErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) return 'Неверный email или пароль.';
    if (err.response?.status) return `Ошибка входа: ${err.response.status}.`;
    return 'Сервер недоступен или запрос заблокирован браузером.';
  }

  return 'Не удалось войти. Попробуйте еще раз.';
}
