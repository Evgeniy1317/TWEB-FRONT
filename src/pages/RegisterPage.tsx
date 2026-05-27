import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { AuthSplitCardShell } from '../components/auth/AuthSplitCardShell';
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

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateRegisterForm(name: string, email: string, password: string): string {
  if (name.length < 3) return 'Имя и фамилия должны быть не короче 3 символов.';
  if (name.length > 50) return 'Имя и фамилия должны быть не длиннее 50 символов.';
  if (!isValidEmail(email)) return 'Введите корректный email адрес.';
  if (password.length < 6) return 'Пароль должен быть не короче 6 символов.';
  return '';
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailShowValidation, setEmailShowValidation] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const displayName = [firstName, lastName].map(x => x.trim()).filter(Boolean).join(' ').trim();
    const validationError = validateRegisterForm(displayName, email, password);
    setError('');

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name: displayName, email: email.trim(), password });
      navigate(getPostAuthRedirect(location.state));
    } catch (err) {
      setError(getRegisterErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSplitCardShell imageSrc={REGISTER_IMAGE}>
      <h1 className="mb-2 text-center text-xl font-bold font-heading leading-tight text-white sm:text-2xl md:text-[1.6rem]">
        Регистрация
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-2 sm:space-y-2">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-x-3">
          <div>
            <label htmlFor="reg-first" className="mb-0.5 block text-xs font-medium text-white/85">
              Имя
            </label>
            <input
              id="reg-first"
              type="text"
              required
              minLength={1}
              maxLength={50}
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
              minLength={1}
              maxLength={50}
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
              minLength={6}
              autoComplete="new-password"
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
          className="mt-0 flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2 text-sm font-bold text-dark transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-65"
        >
          <UserPlus size={17} />
          {isSubmitting ? 'Создаем...' : 'Зарегистрироваться'}
        </button>

        {error && (
          <p className="text-center text-xs font-medium text-red-300" role="alert">
            {error}
          </p>
        )}
      </form>

      <p className="mt-3 text-center text-xs text-white/45">
        Уже есть аккаунт?{' '}
        <Link to="/login" state={location.state} className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </AuthSplitCardShell>
  );
}

function getRegisterErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 400) return getRegisterBadRequestMessage(err.response.data);
    if (err.response?.status === 401) return 'Неверные данные для входа после регистрации.';
    if (err.response?.status === 403) return 'Регистрация запрещена для этого аккаунта.';
    if (err.response?.status) return `Ошибка регистрации: ${err.response.status}.`;
    return 'Сервер недоступен или запрос заблокирован браузером.';
  }

  return 'Не удалось зарегистрироваться. Попробуйте еще раз.';
}

function getRegisterBadRequestMessage(data: unknown): string {
  if (typeof data === 'string') {
    const normalized = data.trim().toLowerCase();
    if (normalized.includes('email already exists')) {
      return 'Этот email уже зарегистрирован. Войдите в аккаунт или используйте другой email.';
    }
    if (normalized) return data;
  }

  if (data && typeof data === 'object') {
    const errors =
      'errors' in data && data.errors && typeof data.errors === 'object'
        ? Object.entries(data.errors).flatMap(([field, value]) => {
            const messages = Array.isArray(value) ? value : [value];
            return messages
              .filter((message): message is string => typeof message === 'string')
              .map(message => translateRegisterFieldError(field, message));
          })
        : [];
    if (errors.length > 0) return errors.join(' ');
  }

  return 'Проверьте имя, email и пароль.';
}

function translateRegisterFieldError(field: string, message: string): string {
  const normalizedField = field.toLowerCase();
  const normalizedMessage = message.toLowerCase();
  if (normalizedField.includes('email') || normalizedMessage.includes('email')) return 'Введите корректный email адрес.';
  if (normalizedField.includes('password') || normalizedMessage.includes('password')) return 'Пароль должен быть не короче 6 символов.';
  if (normalizedField.includes('name') || normalizedMessage.includes('name')) return 'Имя и фамилия должны быть от 3 до 50 символов.';
  return message;
}
