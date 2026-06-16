import sys
import traceback
from Core.data_collector import collect_data_from_pdf
from Core.excel_writer import create_excel


class App:
    def __init__(self, floors, pdf_path, output_path):
        self.pdf_path = pdf_path
        self.floors = floors
        self.output_path = output_path

        self.run()


    def run(self):
        print("Запуск обработки...", flush=True)
        ok = self.process()
        if ok:
            print("Обработка закончена", flush=True)


    def process(self):
        try:
            pdf_path = self.pdf_path.strip()

            if not pdf_path:
                print("Ошибка: PDF не выбран", flush=True)
                sys.exit(1)

            print("Старт обработки PDF...", flush=True)

            data = collect_data_from_pdf(pdf_path, self.floors)

            if not data:
                print("Результат: данных нет", flush=True)
                print("Результат: Ничего не найдено в PDF", flush=True)
                sys.exit(1)

            output_path = self.output_path.strip()
            if not output_path:
                print("Нет пути для выходных данных", flush=True)
                sys.exit(1)

            print("Создание Excel...", flush=True)
            create_excel(data, output_path=output_path)
            print("Готово", flush=True)
            return True

        except Exception as e:
            err = traceback.format_exc()
            print(err, flush=True)
            sys.exit(1)