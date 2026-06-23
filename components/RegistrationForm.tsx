"use client"

import { SunIcon as Sunburst } from "lucide-react";
import { useActionState } from "react";
import { RegisterFormState } from "@/app/(auth)/register/schema";
import { registerAction } from "@/app/(auth)/register/actions";

const initialState: RegisterFormState = {
  errors: null,
  success: false,
};

export default function RegistrationForm() {
    const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <div className="min-h-screen  flex items-center justify-center overflow-hidden p-4l">
      <div className=" w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        <div className="w-full h-full z-2 absolute bg-linear-to-t from-transparent to-black"></div>
        <div className="flex absolute z-2  overflow-hidden backdrop-blur-2xl ">
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
        </div>
        <div className="w-60 h-60 bg-orange-500 absolute z-1 rounded-full bottom-0"></div>
        <div className="w-32 h-20 bg-white absolute z-1 rounded-full bottom-0"></div>
        <div className="w-32 h-20 bg-white absolute z-1 rounded-full bottom-0"></div>

        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl  overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight z-10 tracking-tight relative">
            Design and dev partner for startups and founders.
          </h1>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-99 text-secondary-foreground ">
          <div className="flex flex-col items-left mb-8">
            <div className="text-orange-500 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
              Get Started
            </h2>
            <p className="text-left opacity-80">
              Welcome to HextaStudio — Let&apos;s get started
            </p>
          </div>

          <form className="flex flex-col gap-4" action={formAction} noValidate>
            <div>
              <label htmlFor="name" className="block text-sm mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                defaultValue={state.enteredData?.name || ""}
                className="text-sm w-full py-2 px-3 border rounded-lg bg-white text-black border-gray-300"
              />
              {state.errors?.fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={state.enteredData?.email || ""}
                placeholder="hi@hextastudio.in"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${
                  state.errors?.fieldErrors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {state.errors?.fieldErrors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {state.errors.fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Create new password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${
                  state.errors?.fieldErrors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={!!state.errors?.fieldErrors.password}
                aria-describedby="password-error"
              />
              {state.errors?.fieldErrors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {state.errors?.fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isPending ? "Creating account" : "Create a new account"}
            </button>

            <div className="text-center text-gray-600 text-sm">
              Already have account?{" "}
              <a
                href="/login"
                className="text-secondary-foreground font-medium underline"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}