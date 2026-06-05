#!/usr/bin/env python3
# files/generate_structure.py

import sys
import subprocess
import os
from pathlib import Path

# ================= НАСТРОЙКИ =================
# Какие расширения файлов обрабатывать при сборе структуры
ALLOWED_EXTENSIONS = {
    '.py', '.html', '.htm', '.css', '.js',
    # при необходимости добавьте другие расширения
}

# Папки, которые нужно пропустить целиком (и их содержимое)
IGNORED_DIRS = {
    '.git',
    '__pycache__',
    'build',
    'dist',
    'Output',
    '.venv',
    '.idea',
    'instance',
    # добавьте свои папки
}

# Файлы, которые нужно пропустить (по имени)
IGNORED_FILES = {
    'structure.txt',
    'part1.txt',
    'part2.txt',
    'build.spec',
    'ExcelFiller.spec',
    'generate_structure.py',
    '.gitignore',
    # добавьте свои файлы
}

# Расширения файлов, которые нужно пропустить (дополнительно)
IGNORED_EXTENSIONS = {
    '.pyc', '.log', '.spec', '.exe', '.dll', '.so', '.dylib',
    '.jpg', '.jpeg', '.png', '.gif', '.ico', '.pdf', '.zip', '.tar', '.gz',
    # добавьте свои
}
# =============================================

def open_file(file_path: Path):
    """Открывает файл в стандартном приложении операционной системы."""
    if not file_path.exists():
        print(f"Ошибка: файл '{file_path}' не существует.")
        return False
    try:
        if sys.platform == "win32":
            os.startfile(str(file_path))
        elif sys.platform == "darwin":  # macOS
            subprocess.run(["open", str(file_path)])
        else:  # Linux и другие Unix
            subprocess.run(["xdg-open", str(file_path)])
        print(f"Открыт: {file_path}")
        return True
    except Exception as e:
        print(f"Не удалось открыть файл: {e}")
        return False

def collect_files(base_dir: Path):
    """Собирает файлы с разрешёнными расширениями, игнорируя заданные папки/файлы."""
    blocks = []
    for file_path in base_dir.rglob('*'):
        if not file_path.is_file():
            continue

        # Относительный путь для вывода
        rel = file_path.relative_to(base_dir)

        # Пропускаем игнорируемые папки
        if any(part in IGNORED_DIRS for part in rel.parts):
            continue

        # Пропускаем по имени файла
        if file_path.name in IGNORED_FILES:
            continue

        # Пропускаем по расширению (игнорируемые)
        if file_path.suffix in IGNORED_EXTENSIONS:
            continue

        # Фильтр по разрешённым расширениям (если список не пуст)
        if ALLOWED_EXTENSIONS and file_path.suffix not in ALLOWED_EXTENSIONS:
            continue

        # Читаем содержимое (только текстовые файлы, для бинарных – предупреждение)
        try:
            content = file_path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            content = "[Бинарный файл – содержимое не отображается]"
        except Exception as e:
            content = f"[Ошибка чтения: {e}]"

        blocks.append((str(rel.as_posix()), content))
    return blocks

def generate_structure_files(blocks, files_dir: Path):
    """Записывает собранные блоки в structure.txt и part1/part2.txt."""
    output_txt = files_dir / 'structure.txt'
    split_dir = files_dir / 'дробление'

    # Запись полного файла
    with output_txt.open('w', encoding='utf-8') as f:
        for fname, cont in blocks:
            f.write(f'===\n{fname}\n===\n{cont}\n')
    print(f'Создан {output_txt} — {len(blocks)} файлов.')

    # Разбиение на две части
    split_dir.mkdir(exist_ok=True)
    total = len(blocks)
    half = total // 2 + (total % 2)   # первая половина может быть длиннее

    for part_name, part_blocks in [('part1.txt', blocks[:half]),
                                   ('part2.txt', blocks[half:])]:
        part_path = split_dir / part_name
        with part_path.open('w', encoding='utf-8') as f:
            for fname, cont in part_blocks:
                f.write(f'===\n{fname}\n===\n{cont}\n')
        print(f'Создан {part_path} — {len(part_blocks)} блоков.')

def main():
    # Определяем пути
    base_dir = Path(__file__).resolve().parent.parent   # корень проекта
    files_dir = Path(__file__).resolve().parent         # папка files

    # Разбор аргументов командной строки
    if len(sys.argv) > 1 and sys.argv[1] == '--open':
        if len(sys.argv) < 3:
            print("Использование: generate_structure.py --open <путь_к_файлу>")
            sys.exit(1)
        file_to_open = Path(sys.argv[2])
        # Если путь относительный – пробуем относительно корня проекта
        if not file_to_open.is_absolute():
            file_to_open = base_dir / file_to_open
        open_file(file_to_open)
        return

    # Обычный режим: сбор структуры
    blocks = collect_files(base_dir)
    if not blocks:
        print("Не найдено подходящих файлов для обработки.")
        # Создаём пустые файлы, чтобы сохранить структуру
        (files_dir / 'structure.txt').write_text('', encoding='utf-8')
        split_dir = files_dir / 'дробление'
        split_dir.mkdir(exist_ok=True)
        (split_dir / 'part1.txt').write_text('', encoding='utf-8')
        (split_dir / 'part2.txt').write_text('', encoding='utf-8')
        return

    generate_structure_files(blocks, files_dir)

if __name__ == '__main__':
    main()