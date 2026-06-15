import threading
import traceback
from Core.data_collector import collect_data_from_pdf
from Core.excel_writer import create_excel


class App:
    def __init__(self, floors, pdf_path, output_path):
        self.pdf_path = pdf_path
        self.floors = floors
        self.output_path = output_path

        self.run(self)


    def run(self):
        print("Запуск обработки...")
        threading.Thread(target=self.process, daemon=True).start()


    def process(self):
        try:
            pdf_path = self.pdf_path.strip()

            if not pdf_path:
                print("Ошибка: PDF не выбран")
                return

            print("Старт обработки PDF...")

            data = collect_data_from_pdf(pdf_path, self.floors)

            if not data:
                print("Результат: данных нет")
                print("Результат: Ничего не найдено в PDF")
                return

            output_path = self.output_path.strip()
            if not output_path:
                print("Нет пути для выходных данных")
                return

            print("Создание Excel...")
            create_excel(data, output_path=output_path)
            print("Готово")
            print(f"Готово: Excel файл создан по адресу: {self.output_path}")


        except Exception as e:
            err = traceback.format_exc()
            print(err)