from GUI.main_GUI import App

import Core.consts as consts
import argparse
from pathlib import Path


def apply_args():
    parser = argparse.ArgumentParser(description="Описание вашей программы")

    parser.add_argument("floors", help="Количество этажей")
    parser.add_argument("username", help="Имя пользователя")
    parser.add_argument("project_id", help="ID проекта")
    parser.add_argument("pdf_name", help="Название PDF")

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

    parser.add_argument(
        "--should-warn",
        action="store_true",
        default=consts.should_warn,
        help="Включить предупреждения",
    )

    args = parser.parse_args()

    try:
        consts.raw_headers = [line.split() for line in args.raw_headers.splitlines()]
    except Exception:
        consts.raw_headers = args.raw_headers

    try:
        consts.break_words = args.break_words.split()
    except Exception:
        consts.break_words = args.break_words
        
    consts.max_index_to_search_header_words_by = args.max_index
    consts.max_distance_to_snap_words_together = args.max_dist_snap
    consts.max_distance_to_stop_forming_table = args.max_dist_stop
    consts.min_explication_font_size = args.min_font
    consts.should_warn = args.should_warn

    return args.floors, args.username, args.project_id, args.pdf_name


if __name__ == "__main__":

    floors, username, project_id, pdf_name = apply_args()

    ROOT_DIR = Path(__file__).resolve().parent.parent
    pdf_path = ROOT_DIR / "userdata" / username / project_id / pdf_name
    output_path = ROOT_DIR / "userdata" / username / project_id / "Результат.xlsx"

    app = App(floors, str(pdf_path), str(output_path))
