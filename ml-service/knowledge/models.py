from dataclasses import dataclass, field


@dataclass(slots=True)
class Disease:

    code: str

    name: str

    symptoms: list[str]

    treatments: list[str]


@dataclass(slots=True)
class Symptom:

    name: str

    frequency: int = 0

    diseases: set[str] = field(default_factory=set)