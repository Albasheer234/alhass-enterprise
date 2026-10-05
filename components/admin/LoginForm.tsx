'use client';

import { useFormState } from 'react-dom';
import { loginAction, type AuthFormState } from '@/lib/actions/auth';
import SubmitButton from './SubmitButton';

const initial: AuthFormState = {};

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initial);
  return (
    <form action={formAction} className="form-grid">
      {state.error && (
        <div className="alert alert--error" role="alert">{state.error}</div>
      )}
      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <SubmitButton label="Sign In" pendingLabel="Signing in…" />
    </form>
  );
}
