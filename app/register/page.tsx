'use client';

export default function RegistrationPage() {
  return (
    // Основной контейнер на весь экран
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center p-6 font-sans">
      
      {/* Контейнер для контента (ограничиваем ширину) */}
      <div className="w-full max-w-[420px] space-y-8">
        
        {/* Заголовок и подзаголовок */}
        <div className="space-y-4">
          
          <h1 className="text-5xl font-bold leading-tight">
            Создать аккаунт
          </h1>
          
          <p className="text-gray-400 text-lg">
            Уже есть аккаунт?{' '}
            <a href="#" className="text-[#ff5722] font-bold hover:underline">
              Войти
            </a>
          </p>
        </div>

        {/* Форма */}
        <form className="space-y-4 mt-8">
          
          {/* Ряд с именем и фамилией */}
          <div className="relative ">
              <input
                type="text"
                placeholder="Login"
                className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
              />
            </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
            />
          </div>

          {/* Пароль */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
            />
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-lg rounded-full py-4 mt-6 transition-colors shadow-lg shadow-orange-900/20"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}