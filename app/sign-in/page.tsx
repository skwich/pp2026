'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    const { data, error } = await authClient.signIn.username({
      username: login,
      password: password,
    }, {
      onSuccess(context) {
        router.push("/my-projects");
      },
    });
  }

  return (
  <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-6 font-sans">

    <div className="w-full max-w-[430px]">

      <div>
        <h1 className="text-[32px] font-normal">ВХОД</h1>
        <p className="text-[18px] font-light">
          Нет аккаунта?{' '}
          <a href="/sign-up" className="hover:underline">Зарегистрироваться</a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-[17px] flex flex-col items-center w-full">
        <div className="relative w-full">
            <input
              value={login}
              onChange={e => setLogin(e.target.value)}
              type="text"
              placeholder="Логин"
              className="w-full text-black font-inter placeholder-[#9F9F9F] placeholder:text-[18px] border-b-3 border-b-[#D0D0D0] py-4 outline-none"
            />
          </div>

        <div className="relative w-full">
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Пароль"
            className="w-full text-black font-inter placeholder-[#9F9F9F] placeholder:text-[18px] border-b-3 border-b-[#D0D0D0] py-4 outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full max-w-[300px] h-full max-h-[50px] bg-[#252525] font-inter text-white text-[18px] font-normal rounded-[4px] py-[14px] mt-[50px]"
        >
          Войти
        </button>
      </form>

    </div>
    
  </div>
  );
}