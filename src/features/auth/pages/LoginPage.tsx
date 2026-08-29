import pdgBackground from '@/assets/pdg-background.png';
import BrandLogo from '@/components/common/BrandLogo';
import Button from '@/components/ui/Button';

import { useLogin } from '../hooks/useLogin';


//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const LoginPage = () => {

  const { form, signInMutation } = useLogin();

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
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            noValidate
          >
            <fieldset className="flex flex-col gap-4 border-none">
              <legend className="sr-only">Admin credentials</legend>

              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="password">
                {(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                )}
              </form.AppField>
            </fieldset>

           <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  label="Sign In"
                  color='accent'
                  loading={isSubmitting || signInMutation.isPending}
                  disabled={!canSubmit}
                />
              )}
            </form.Subscribe>
          </form>
        </div>
      </section>
    </div>
  )
}

export default LoginPage;