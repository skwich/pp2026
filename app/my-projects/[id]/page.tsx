"use client";

import { redirect, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Project {
  id: number;
  title: string;
  pdfName: string;
  excelName: string;
  description: string;
  floors: string | null;
  rawHeaders: string | null;
  breakWords: string | null;
  maxIndex: string | null;
  maxDistSnap: string | null;
  maxDistStop: string | null;
  minFont: string | null;
  shouldWarn: string | null;
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isExcelFileExist, setExcelFileExist] = useState(false);

  const [floors, setFloors] = useState("");
  const [rawHeaders, setRawHeaders] = useState("");
  const [breakWords, setBreakWords] = useState("");
  const [maxIndex, setMaxIndex] = useState("");
  const [maxDistSnap, setMaxDistSnap] = useState("");
  const [maxDistStop, setMaxDistStop] = useState("");
  const [minFont, setMinFont] = useState("");
  const [shouldWarn, setShouldWarn] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setFloors(data.floors ?? "");
        setRawHeaders(data.rawHeaders ?? "");
        setBreakWords(data.breakWords ?? "");
        setMaxIndex(data.maxIndex ?? "");
        setMaxDistSnap(data.maxDistSnap ?? "");
        setMaxDistStop(data.maxDistStop ?? "");
        setMinFont(data.minFont ?? "");
        setShouldWarn(data.shouldWarn === "true");
        setLoading(false);

        fetch(`/api/projects/${id}/check-pdf?type=excel`)
          .then((r) => r.json())
          .then(({ exists }) => setExcelFileExist(exists));
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center">Загрузка проекта...</div>;
  }

  if (!project) {
    redirect("/my-projects");
  }

  const handleChangeInputText = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setButtonDisabled(true);
      const file = e.target.files[0];
      setFile(file);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/projects/${id}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error(response.statusText);
        return;
      }

      project.pdfName = file.name;
      const excelName = file.name.substring(0, file.name.lastIndexOf("."));
      project.excelName = `${excelName}.xlsx`;
      setExcelFileExist(false);
      setButtonDisabled(false);
    }
  };

  const handleParse = async () => {
    setButtonDisabled(true);
    setLogs([]);
    let success = false;
    try {
      const saveRes = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          floors,
          rawHeaders,
          breakWords,
          maxIndex,
          maxDistSnap,
          maxDistStop,
          minFont,
          shouldWarn: String(shouldWarn),
        }),
      });
      if (!saveRes.ok) {
        setLogs((prev) => [...prev, "[ERROR] Failed to save settings"]);
        return;
      }
      const saved = await saveRes.json();
      setProject(saved);

      const checkRes = await fetch(`/api/projects/${id}/check-pdf`);
      if (!checkRes.ok) {
        setLogs((prev) => [...prev, "[ERROR] Failed to check PDF file"]);
        return;
      }
      const { exists, pdfName } = await checkRes.json();
      if (!exists) {
        setLogs((prev) => [
          ...prev,
          `[ERROR] PDF-файл не найден на сервере: ${pdfName}. Загрузите файл заново.`,
        ]);
        setButtonDisabled(false);
        return;
      }

      const res = await fetch("/api/projects/run_script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id }),
      });

      if (!res.ok) {
        setLogs((prev) => [...prev, `[ERROR] Server returned ${res.status}`]);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "stdout" || event.type === "stderr") {
              setLogs((prev) => [...prev, event.text.trim()]);
            } else if (event.type === "done") {
              if (!event.success) {
                setLogs((prev) => [...prev, `[ERROR] Скрипт завершился с кодом ${event.exitCode}`]);
              }
              success = event.success;
            } else if (event.type === "error") {
              setLogs((prev) => [...prev, `[ERROR] ${event.text}`]);
              success = false;
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      setLogs((prev) => [...prev, `[ERROR] ${err}`]);
    } finally {
      setButtonDisabled(false);
      if (success) {
        setExcelFileExist(true);
        const saveRes = await fetch(`/api/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            excelName: "Результат.xlsx"
          }),
        });
        if (!saveRes.ok) {
          setLogs((prev) => [...prev, "[ERROR] Failed to save settings"]);
          return;
        }
        const saved = await saveRes.json();
        setProject(saved);
      }
    }
  };

  const handleDownload = async () => {
    setButtonDisabled(true);
    try {
      const response = await fetch(`/api/projects/${id}/download`, {
        method: "POST",
      });
      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Ошибка при скачивании");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Результат.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setButtonDisabled(false);
    }
  };

  async function handleSaveTitle() {
    if (!editTitle.trim()) return;
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle.trim() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProject(updated);
    }
    setIsEditingTitle(false);
  }

  return (
    <div className="bg-white mx-auto">
      <div className="max-w-[1100px] mx-auto mt-[50px] flex justify-between items-center">
        {isEditingTitle ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") setIsEditingTitle(false);
            }}
            className="text-[36px] font-bold uppercase border-b-2 outline-none"
          />
        ) : (
          <h1
            className="text-[36px] font-bold uppercase cursor-pointer hover:opacity-70"
            onClick={() => {
              setEditTitle(project.title);
              setIsEditingTitle(true);
            }}
          >
            {project.title}
          </h1>
        )}
        <a
          href="/my-projects"
          className="text-[20px] font-normal uppercase bg-[url('/angle_bracket_left.svg')] bg-left bg-no-repeat pl-4 hover:cursor-pointer"
        >
          Мои проекты
        </a>
      </div>
      <div className="max-w-[1100px] mx-auto mt-[30px] mb-[50px] flex gap-x-[50px]">
        <div className="w-full px-[40px] py-[20px] border-2 rounded-[5px]">
          <div className="flex flex-col gap-y-[5px]">
            <p>Загрузите PDF-файл</p>
            <input
              className="sr-only"
              type="file"
              id="upload"
              name="upload"
              accept=".pdf"
              onChange={handleChangeInputText}
            />
            <label
              className="w-full py-[25px] border-2 rounded-[3px] border-dashed text-center"
              htmlFor="upload"
            >
              {file
                ? file.name
                : project.pdfName && project.pdfName !== "не загружен"
                  ? `${project.pdfName}`
                  : "Выбрать файл"}
            </label>
            <button
              className="w-full text-[14px] font-bold uppercase text-left flex gap-x-[8px] cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img
                className={isOpen ? "-rotate-90" : "rotate-180"}
                src="/angle_bracket_left.svg"
                width="8px"
              />
              Дополнительно
            </button>
            <div
              hidden={!isOpen}
              className="mt-[10px] flex flex-col gap-y-[10px]"
            >
              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">Введите количество этажей</label>
                <input
                  type="text"
                  placeholder="Например: 1, 2, 15 или “без”"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Заголовки по которым определяется таблица
                </label>
                <div className="flex gap-x-[10px]">
                  <textarea
                    rows={1}
                    value={rawHeaders}
                    onChange={(e) => setRawHeaders(e.target.value)}
                    placeholder="Например: Номер, число, площадь, м2"
                    className="w-full min-h-[90px] border-2 rounded-[3px] px-[8px] py-[5px]"
                  />
                  <div className="flex flex-col gap-y-[20px] my-[2px]">
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Добавить
                    </button>
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Слова разделители которые прерывают таблицу
                </label>
                <div className="flex gap-x-[10px]">
                  <textarea
                    rows={4}
                    value={breakWords}
                    onChange={(e) => setBreakWords(e.target.value)}
                    placeholder={"Например:\nэкспликация\nусловные\nсхема"}
                    className="w-full min-h-[110px] border-2 rounded-[3px] px-[8px] py-[5px]"
                  />
                  <div className="flex flex-col gap-y-[20px] my-[2px]">
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Добавить
                    </button>
                    <button className="w-[120px] h-[32px] bg-black rounded-[3px] text-white font-bold text-[14px] uppercase flex justify-center py-[5px] cursor-pointer">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  До какого слова проверять заголовок
                </label>
                <input
                  type="text"
                  placeholder="Например: 30"
                  value={maxIndex}
                  onChange={(e) => setMaxIndex(e.target.value)}
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Расстояние между словами, меньше которого они считаются в
                  одном ряду
                </label>
                <input
                  type="text"
                  placeholder="Например: 3"
                  value={maxDistSnap}
                  onChange={(e) => setMaxDistSnap(e.target.value)}
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Расстояние между словами, больше которого таблица считается
                  завершенной
                </label>
                <input
                  type="text"
                  placeholder="Например: 45"
                  value={maxDistStop}
                  onChange={(e) => setMaxDistStop(e.target.value)}
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex flex-col gap-y-[5px]">
                <label className="text-[16px]">
                  Размер шрифта, ниже которого слово “Экспликация” не
                  рассматривается, как указывающее на таблицу
                </label>
                <input
                  type="text"
                  placeholder="Например: 10"
                  value={minFont}
                  onChange={(e) => setMinFont(e.target.value)}
                  className="w-full min-h-[30px] border-2 rounded-[3px] px-[8px] py-[5px]"
                />
              </div>

              <div className="flex justify-between items-center pr-[140px]">
                <label className="text-[16px]">
                  Предупреждать, если количество таблиц не сходится с
                  количеством найденных слов “Экспликация”
                </label>
                <input
                  type="checkbox"
                  checked={shouldWarn}
                  onChange={(e) => setShouldWarn(e.target.checked)}
                  className="w-[40px] h-[40px] rounded-[3px] px-[8px] py-[5px] cursor-pointer"
                />
              </div>
            </div>
            <button
              disabled={isButtonDisabled}
              onClick={isExcelFileExist ? handleDownload : handleParse}
              className="w-[250px] h-[50px] mx-auto mt-[20px] mb-[10px] bg-black text-white text-[14px] font-bold uppercase rounded-[3px] cursor-pointer disabled:cursor-default disabled:bg-gray-400"
            >
              {isButtonDisabled
                ? "Обрабатывается..."
                : isExcelFileExist
                  ? "Скачать результат"
                  : "Запустить обработку"}
            </button>
          </div>
        </div>
        <div className="w-full max-w-[330px] h-[330px] border-2 rounded-[5px] px-[24px] flex flex-col">
          <h1 className="mt-[15px] text-[24px] font-bold uppercase">
            Лог обработки
          </h1>
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto text-[12px] font-mono whitespace-pre-wrap mt-[10px]"
          >
            {logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <button
            onClick={() => setLogs([])}
            className="w-[150px] h-[50px] mb-[44px] flex mx-auto justify-center items-center bg-black rounded-[3px] text-white text-[14px] font-bold uppercase break-words"
          >
            Очистить лог
          </button>
        </div>
      </div>
    </div>
  );
}
