'use client';

export default function RegistrationPage() {
  return (
    // Основной контейнер на весь экран
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center p-6 font-sans">
      
      {/* Контейнер для контента (ограничиваем ширину) */}
      <div className="w-full max-w-[420px] space-y-8">
        
        {/* Заголовок и подзаголовок */}
        <div className="space-y-4">
          <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">
            Start for free
          </p>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Create <br />
            your account
          </h1>
          
          <p className="text-gray-400 text-lg">
            Already a member?{' '}
            <a href="#" className="text-[#ff5722] font-bold hover:underline">
              Log in
            </a>
          </p>
        </div>

        {/* Форма */}
        <form className="space-y-4 mt-8">
          
          {/* Ряд с именем и фамилией */}
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="First name"
                defaultValue="John"
                className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
              />
            </div>
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Last name"
                defaultValue="Cooper"
                className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="E-mail"
              defaultValue="JCoop@company.com"
              className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
            />
          </div>

          {/* Пароль */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              defaultValue=".........."
              className="w-full bg-[#262626] text-white placeholder-gray-500 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#ff5722] transition-all"
            />
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-lg rounded-full py-4 mt-6 transition-colors shadow-lg shadow-orange-900/20"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}