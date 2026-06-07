'use client';

import { SyntheticEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

async function OnClickRegisterButton({email, password, username}: {email:string, password: string, username: string}) {
  const { data, error } = await authClient.signUp.email({
          email: email,
          name: "user",
          password: password,
          username: username
      }, {
          onRequest: (ctx) => {
              //show loading
          },
          onSuccess: (ctx) => {
              //redirect to the dashboard or sign in page
          },
          onError: (ctx) => {
              // display the error message
              alert(ctx.error.message);
          },
  });
}

export default function RegistrationPage() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    const { data, error } = await authClient.signUp.email({
        email: email,
        name: "user",
        password: password,
        username: login 
    }, {
        onRequest: (ctx) => {
            // show loading
        },
        onSuccess: (ctx) => {
            // redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            alert(ctx.error.message);
        },
    });
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-6 font-sans">

      <div className="w-full max-w-[430px] ">

        <div>
          <h1 className="text-[32px] font-normal">СОЗДАТЬ АККАУНТ</h1>
          <p className="text-[18px] font-light">
            Уже есть аккаунт?{' '}
            <a href="/login" className="hover:underline">Войти</a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-[17px] flex flex-col items-center w-full">
          <div className="relative w-full">
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                type="text"
                placeholder="Логин"
                className="w-full text-black font-inter placeholder-[#9F9F9F] placeholder:text-[18px] border-b-3 border-b-[#D0D0D0] py-4 outline-none"
              />
            </div>

          <div className="relative w-full">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-mail"
              className="w-full text-black font-inter placeholder-[#9F9F9F] placeholder:text-[18px] border-b-3 border-b-[#D0D0D0] py-4 outline-none"
            />
          </div>

          <div className="relative w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Пароль"
              className="w-full text-black font-inter placeholder-[#9F9F9F] placeholder:text-[18px] border-b-3 border-b-[#D0D0D0] py-4 outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full max-w-[300px] h-full max-h-[50px] bg-[#252525] font-inter text-white text-[18px] font-normal rounded-[4px] py-[14px] mt-[50px]"
          >
            Зарегистрироваться
          </button>
        </form>

      </div>

    </div>
  );
}