'use client';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center p-6 font-sans">

      <div className="w-full max-w-[420px] space-y-8">

        <div className="space-y-4">
          <h1 className="text-5xl font-bold leading-[1.25]">Вход</h1>
          <p className="text-gray-400 text-lg">
            Нет аккаунта?{' '}
            <a href="/register" className="text-[#ff5722] font-bold hover:underline">Зарегистрироваться</a>
          </p>
        </div>

        <form className="space-y-4 mt-8">
          <div className="relative ">
              <input
                type="text"
                placeholder="Login"
                className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
              />
            </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
            />
          </div>

          <div className="relative">
            <a href='#' className="text-sm text-gray-400 hover:text-[#ff5722] transition-colors font-sans pl-4">
                Забыли пароль?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-lg rounded-full py-4 mt-4 transition-colors shadow-lg shadow-orange-900/20"
          >
            Войти
          </button>
        </form>

      </div>
      
    </div>
    );
}