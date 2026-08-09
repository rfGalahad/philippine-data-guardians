import pdgBackground from '@/assets/pdg-background.png';
import BrandLogo from '@/components/BrandLogo';
import CustomField from '@/components/ui/CustomField';
import Button from '@/components/ui/Button';

import { useAuth } from '../hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { email, required } from '@/utils/validators';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const INITIAL_VALUES = {
  email: "",
  password: ""
}

const VALIDATION_RULES = {
  email: [required(), email()],
  password: [required()],
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const LoginPage = () => {

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated, navigate]);

  const form = useForm({
    initialValues: INITIAL_VALUES,
    validationRules: VALIDATION_RULES,
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
  });

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 py-12"
      style={{ backgroundImage: `url(${pdgBackground})` }}
    >
      <section className="relative z-10 w-full max-w-md animate-[fadeIn_0.7s_ease_both]">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-surface/80 p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8">

          {/* Brand */}
          <div className="flex justify-center mb-10">
            <BrandLogo to={null} />
          </div>

          {/* TITLE & SUBTITLE */}
          <div className="mb-7 ">
            <h1
              className="
                mb-1.5 font-display text-lg sm:text-2xl font-bold
                leading-[1.15] text-white
              "
            >
              Sign in to your dashboard
            </h1>
            <p className="text-sm text-text-secondary">
              Restricted access. Authorized administrators only.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form 
            className="flex flex-col gap-6" 
            onSubmit={form.handleSubmit} 
            noValidate
          >
            <fieldset className="flex flex-col gap-4 border-none">
              <legend className="sr-only">Admin credentials</legend>

              {/* Email Field */}
              <CustomField
                id="email"
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.values.email}
                onChange={form.handleChange}
                required
                error={form.touched.email ? form.errors.email : undefined}
              />

              {/* Password Field */}
              <div>
                <CustomField
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.values.password}
                  onChange={form.handleChange}
                  error={form.touched.password ? form.errors.password : undefined}
                  required
                />
              </div>
            </fieldset>

            <Button
              label={form.isSubmitting ? "Signing in..." : "Sign in"}
              type="submit"
              loading={form.isSubmitting}
              color="accent"
            />
          </form>
        </div>
      </section>
    </div>
  )
}

export default LoginPage;