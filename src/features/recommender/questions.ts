// "¿Qué vemos?": the questions, their answers, and how they live in the URL
// (/que-vemos?con=pareja&tipo=pelicula&tiempo=normal&animo=reir,tension&epoca=igual&donde=8,1899).

import { SERVICES } from "@/features/services/myServices";

export type Company = "solo" | "pareja" | "amigos" | "familia";
export type Kind = "pelicula" | "serie" | "igual";
export type Time = "corto" | "normal" | "largo";
export type Mood =
  "reir" | "emocion" | "tension" | "accion" | "miedo" | "pensar" | "liviano" | "aprender";
export type Era = "nueva" | "siglo" | "clasica" | "igual";

export interface Answers {
  con?: Company;
  tipo?: Kind;
  tiempo?: Time;
  animo?: Mood[];
  epoca?: Era;
  /** TMDB provider ids; empty = anywhere. */
  donde?: number[];
}

export type Complete = Required<Answers>;

export interface Option<V extends string> {
  value: V;
  label: string;
  hint: string;
}

export const COMPANY: Option<Company>[] = [
  { value: "solo", label: "Solo", hint: "Elegís vos, sin negociar" },
  { value: "pareja", label: "En pareja", hint: "Algo que enganche a los dos" },
  { value: "amigos", label: "Con amigos", hint: "Para comentarla en voz alta" },
  { value: "familia", label: "En familia", hint: "Apta para todas las edades" },
];

export const KIND: Option<Kind>[] = [
  { value: "pelicula", label: "Una película", hint: "Empieza y termina hoy" },
  { value: "serie", label: "Una serie", hint: "Para engancharse varios días" },
  { value: "igual", label: "Me da igual", hint: "Lo mejor de las dos" },
];

export const TIME: Option<Time>[] = [
  { value: "corto", label: "Poco", hint: "Hasta 1 h 40, o capítulos de media hora" },
  { value: "normal", label: "Lo normal", hint: "Hasta 2 h 15, o capítulos de una hora" },
  { value: "largo", label: "Toda la noche", hint: "Sin límite de duración" },
];

export const MOOD: Option<Mood>[] = [
  { value: "reir", label: "Reírme", hint: "Comedia, nada de dramas" },
  { value: "emocion", label: "Emocionarme", hint: "Historias que te tocan" },
  { value: "tension", label: "Intriga y suspenso", hint: "Misterio, crimen, giros" },
  { value: "accion", label: "Adrenalina", hint: "Acción y aventura" },
  { value: "miedo", label: "Pasar miedo", hint: "Terror de verdad" },
  { value: "pensar", label: "Que me vuele la cabeza", hint: "Ciencia ficción, mundos raros" },
  { value: "liviano", label: "Algo liviano", hint: "Para no pensar demasiado" },
  { value: "aprender", label: "Aprender algo", hint: "Documentales e historia real" },
];

export const ERA: Option<Era>[] = [
  { value: "nueva", label: "Lo más nuevo", hint: "De los últimos tres años" },
  { value: "siglo", label: "De este siglo", hint: "Del 2000 para acá" },
  { value: "clasica", label: "Un clásico", hint: "Antes del 2000" },
  { value: "igual", label: "Me da igual", hint: "Cualquier época" },
];

export const MAX_MOODS = 2;

export type QuestionKey = keyof Answers;

/** Order of the questions; "Para ver en familia" hides "Pasar miedo". */
export const STEPS: QuestionKey[] = ["con", "tipo", "tiempo", "animo", "epoca", "donde"];

export const moodOptions = (company?: Company) =>
  company === "familia" ? MOOD.filter((m) => m.value !== "miedo") : MOOD;

const pick = <V extends string>(options: Option<V>[], value: string | null) =>
  options.find((o) => o.value === value)?.value;

/** Reads answers from the URL, dropping anything unknown or inconsistent. */
export const parseAnswers = (params: URLSearchParams): Answers => {
  const con = pick(COMPANY, params.get("con"));
  const moods = (params.get("animo") ?? "")
    .split(",")
    .map((value) => pick(moodOptions(con), value))
    .filter((value): value is Mood => Boolean(value));
  const donde = params.get("donde");
  return {
    con,
    tipo: pick(KIND, params.get("tipo")),
    tiempo: pick(TIME, params.get("tiempo")),
    animo:
      params.has("animo") && moods.length > 0 ? [...new Set(moods)].slice(0, MAX_MOODS) : undefined,
    epoca: pick(ERA, params.get("epoca")),
    donde:
      donde === null
        ? undefined
        : donde === "todas"
          ? []
          : donde
              .split(",")
              .map(Number)
              .filter((id) => (SERVICES as readonly number[]).includes(id)),
  };
};

export const writeAnswers = (answers: Answers) => {
  const params = new URLSearchParams();
  if (answers.con) params.set("con", answers.con);
  if (answers.tipo) params.set("tipo", answers.tipo);
  if (answers.tiempo) params.set("tiempo", answers.tiempo);
  if (answers.animo?.length) params.set("animo", answers.animo.join(","));
  if (answers.epoca) params.set("epoca", answers.epoca);
  if (answers.donde) params.set("donde", answers.donde.length ? answers.donde.join(",") : "todas");
  return params;
};

/** The first question without an answer, or null when the questionnaire is done. */
export const currentStep = (answers: Answers) =>
  STEPS.find((key) => answers[key] === undefined) ?? null;

export const isComplete = (answers: Answers): answers is Complete => currentStep(answers) === null;

/** Answers up to (not including) a question: going back to it clears it and what follows. */
export const answersBefore = (answers: Answers, key: QuestionKey): Answers => {
  const kept: Answers = {};
  for (const step of STEPS) {
    if (step === key) break;
    Object.assign(kept, { [step]: answers[step] });
  }
  return kept;
};

const labelOf = <V extends string>(options: Option<V>[], value: V) =>
  options.find((o) => o.value === value)?.label ?? value;

/** One line per answer, for the summary above the results. */
export const describeAnswers = (answers: Complete, serviceNames: Map<number, string>) => [
  labelOf(COMPANY, answers.con),
  labelOf(KIND, answers.tipo),
  labelOf(TIME, answers.tiempo),
  answers.animo.map((mood) => labelOf(MOOD, mood)).join(" + "),
  labelOf(ERA, answers.epoca),
  answers.donde.length
    ? answers.donde
        .map((id) => serviceNames.get(id) ?? "")
        .filter(Boolean)
        .join(", ")
    : "En cualquier lado",
];
