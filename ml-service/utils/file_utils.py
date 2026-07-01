from pathlib import Path


def ensure_directory(path: str | Path):

    Path(path).mkdir(
        parents=True,
        exist_ok=True,
    )


def file_exists(path: str | Path):

    return Path(path).exists()


def write_text(path: str | Path, content: str):

    path = Path(path)

    ensure_directory(path.parent)

    path.write_text(
        content,
        encoding="utf-8",
    )