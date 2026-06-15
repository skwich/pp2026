from GUI.main_GUI import App

import Core.consts as consts
import argparse

import argparse


def apply_args():
    parser = argparse.ArgumentParser(description="Описание вашей программы")

    # 1. Обязательные позиционные аргументы (передаются строго по порядку)
    parser.add_argument("floors", help="Количество этажей")
    parser.add_argument("username", help="Имя пользователя")
    parser.add_argument("project_id", help="ID проекта")
    parser.add_argument("pdf_name", help="Название PDF")

    # 2. Именованные необязательные аргументы (передаются в любом порядке через --)
    # Указываем правильные типы (int, float), так как из терминала всё идет строками (str)
    parser.add_argument(
        "--raw-headers", default=consts.raw_headers, help="Сырые заголовки"
    )
    parser.add_argument(
        "--break-words", default=consts.break_words, help="Разделительные слова"
    )
    parser.add_argument(
        "--max-index",
        type=int,
        default=consts.max_index_to_search_header_words_by,
        help="Макс. индекс для поиска",
    )
    parser.add_argument(
        "--max-dist-snap",
        type=float,
        default=consts.max_distance_to_snap_words_together,
        help="Макс. дистанция соединения",
    )
    parser.add_argument(
        "--max-dist-stop",
        type=float,
        default=consts.max_distance_to_stop_forming_table,
        help="Макс. дистанция остановки",
    )
    parser.add_argument(
        "--min-font",
        type=float,
        default=consts.min_explication_font_size,
        help="Мин. размер шрифта",
    )

    # 3. Флаг (True/False). Передача `--should-warn` сделает его True. По умолчанию — False.
    # Если в consts значение динамическое, используем action='store_true' / 'store_false'
    # ВНИМАНИЕ: type=bool в argparse работает некорректно (любая строка, даже "False", станет True)
    parser.add_argument(
        "--should-warn",
        action="store_true",
        default=consts.should_warn,
        help="Включить предупреждения",
    )

    # Автоматически парсим аргументы
    args = parser.parse_args()

    # Присваиваем значения глобальным константам (заменяем дефисы на нижние подчеркивания)
    consts.raw_headers = args.raw_headers
    consts.break_words = args.break_words
    consts.max_index_to_search_header_words_by = args.max_index
    consts.max_distance_to_snap_words_together = args.max_dist_snap
    consts.max_distance_to_stop_forming_table = args.max_dist_stop
    consts.min_explication_font_size = args.min_font
    consts.should_warn = args.should_warn

    # Возвращаем кортеж из обязательных параметров
    return args.floors, args.username, args.project_id, args.pdf_name


if __name__ == "__main__":
    floors, username, project_id, pdf_name = apply_args()
    pdf_path = f"../userdata/{username}/{project_id}/{pdf_name}.pdf"
    output_path = f"../userdata/{username}/{project_id}/Результат.xlsx"
    app = App(floors, pdf_path, output_path)
