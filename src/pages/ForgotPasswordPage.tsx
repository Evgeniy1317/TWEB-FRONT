import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, RotateCcw, ShieldCheck } from 'lucide-react';
import { AuthSplitCardShell } from '../components/auth/AuthSplitCardShell';
import { authInputClass } from '../components/auth/authFieldClasses';
import { publicUrl } from '../lib/publicUrl';

type Step = 'email' | 'code' | 'reset' | 'done';

const FORGOT_IMAGE = publicUrl('media/images/original-54780b5d8c3bd316e079f55fc52e6baf.webp');

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('code');
  };

  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      setError('Введите корректный код из письма.');
      return;
    }
    setError('');
    setStep('reset');
  };

  const submitPassword = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 символов.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    setError('');
    setStep('done');
  };

  return (
    <AuthSplitCardShell imageSrc={FORGOT_IMAGE}>
      <h1 className="mb-2 text-center text-xl font-bold font-heading leading-tight text-white sm:text-2xl md:text-[1.6rem]">
        Восстановление пароля
      </h1>
      <p className="mb-4 text-center text-xs text-white/45 sm:mb-5 sm:text-sm">
        {step === 'email' && 'Укажите email, и мы отправим код подтверждения'}
        {step === 'code' && 'Введите код, который пришёл вам на почту'}
        {step === 'reset' && 'Придумайте новый пароль для аккаунта'}
        {step === 'done' && 'Пароль успешно обновлён'}
      </p>

      {step === 'email' && (
        <form onSubmit={submitEmail} className="space-y-3">
          <div>
            <label htmlFor="forgot-email" className="mb-1 block text-xs font-medium text-white/85">
              Email адрес
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35" aria-hidden />
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`${authInputClass} pl-9`}
                placeholder="you@mail.md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2.5 text-sm font-bold text-dark transition-colors hover:bg-primary-dark"
          >
            <RotateCcw size={16} aria-hidden />
            Отправить код
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={submitCode} className="space-y-3">
          <div>
            <label htmlFor="forgot-code" className="mb-1 block text-xs font-medium text-white/85">
              Код из письма
            </label>
            <div className="relative">
              <ShieldCheck size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35" aria-hidden />
              <input
                id="forgot-code"
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className={`${authInputClass} pl-9`}
                placeholder="Например: 483920"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2.5 text-sm font-bold text-dark transition-colors hover:bg-primary-dark"
          >
            Подтвердить код
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={submitPassword} className="space-y-3">
          <div>
            <label htmlFor="forgot-password" className="mb-1 block text-xs font-medium text-white/85">
              Новый пароль
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35" aria-hidden />
              <input
                id="forgot-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${authInputClass} pl-9`}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label htmlFor="forgot-password-repeat" className="mb-1 block text-xs font-medium text-white/85">
              Повторите пароль
            </label>
            <input
              id="forgot-password-repeat"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-none bg-primary py-2.5 text-sm font-bold text-dark transition-colors hover:bg-primary-dark"
          >
            Сохранить пароль
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-3">
          <p className="rounded-none border border-primary/30 bg-primary/10 px-3 py-2 text-center text-sm text-primary">
            Пароль обновлён. Теперь можно войти с новым паролем.
          </p>
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-none border border-white/22 bg-white py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-white/95"
          >
            Вернуться ко входу
          </Link>
        </div>
      )}

      {error && <p className="mt-3 text-center text-xs text-red-400">{error}</p>}

      <p className="mt-4 text-center text-xs text-white/45 sm:text-sm">
        Вспомнили пароль?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Вернуться ко входу
        </Link>
      </p>
    </AuthSplitCardShell>
  );
}
