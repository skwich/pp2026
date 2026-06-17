const errorMap: Record<string, string> = {
  "Invalid password": "Неверный пароль",
  "Invalid email or password": "Неверный email или пароль",
  "Invalid username or password": "Неверный логин или пароль",
  "User not found": "Пользователь не найден",
  "User already exists.": "Пользователь уже существует",
  "Password too short": "Слишком короткий пароль",
  "Password too long": "Слишком длинный пароль",
  "Invalid email": "Неверный email",
  "Invalid origin": "Недопустимый источник запроса",
  "Invalid user": "Неверный пользователь",
  "Invalid token": "Неверный токен",
  "Token expired": "Срок действия токена истёк",
  "Email not verified": "Email не подтверждён",
  "Session expired. Re-authenticate to perform this action.": "Сессия истекла. Войдите снова.",
  "Field is required": "Обязательное поле",
  "Validation Error": "Ошибка валидации",
  "Username is already taken. Please try another.": "Имя пользователя уже занято",
  "Username is too short": "Слишком короткое имя пользователя",
  "Username is too long": "Слишком длинное имя пользователя",
  "Username is invalid": "Недопустимое имя пользователя",
  "Display username is invalid": "Недопустимое отображаемое имя",
};

export function translateError(msg: string | undefined): string {
  if (!msg) return "Неизвестная ошибка";
  return errorMap[msg] ?? msg;
}
