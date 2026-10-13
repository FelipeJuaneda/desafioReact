import {
  RiArrowLeftLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiCheckLine,
  RiCupLine,
  RiEmotionLaughLine,
  RiFilmLine,
  RiFlashlightLine,
  RiGhostLine,
  RiGlobalLine,
  RiGroupLine,
  RiHeartPulseLine,
  RiMoonClearLine,
  RiParentLine,
  RiPlanetLine,
  RiShuffleLine,
  RiSparklingLine,
  RiSpyLine,
  RiTimeLine,
  RiTimerFlashLine,
  RiTv2Line,
  RiUserHeartLine,
  RiUserLine,
  RiVidiconLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { tmdbImage } from "@/services/tmdb/images";
import { servicesQuery } from "./queries";
import {
  COMPANY,
  ERA,
  KIND,
  MAX_MOODS,
  moodOptions,
  STEPS,
  TIME,
  type Answers,
  type Mood,
  type Option,
  type QuestionKey,
} from "./questions";

const ICONS: Record<string, RemixiconComponentType> = {
  solo: RiUserLine,
  pareja: RiUserHeartLine,
  amigos: RiGroupLine,
  familia: RiParentLine,
  pelicula: RiFilmLine,
  serie: RiTv2Line,
  corto: RiTimerFlashLine,
  normal: RiTimeLine,
  largo: RiMoonClearLine,
  reir: RiEmotionLaughLine,
  emocion: RiHeartPulseLine,
  tension: RiSpyLine,
  accion: RiFlashlightLine,
  miedo: RiGhostLine,
  pensar: RiPlanetLine,
  liviano: RiCupLine,
  aprender: RiBookOpenLine,
  nueva: RiSparklingLine,
  siglo: RiCalendarLine,
  clasica: RiVidiconLine,
  igual: RiShuffleLine,
};

const QUESTIONS: Record<QuestionKey, { title: string; lead: string }> = {
  con: {
    title: "¿Con quién la vas a ver?",
    lead: "Cambia todo: no es lo mismo solo que en familia.",
  },
  tipo: { title: "¿Película o serie?", lead: "Si te da igual, mezclamos las dos." },
  tiempo: { title: "¿Cuánto tiempo tenés?", lead: "Para que no te agarre el sueño a la mitad." },
  animo: { title: "¿Qué tenés ganas de sentir?", lead: `Elegí hasta ${MAX_MOODS}.` },
  epoca: { title: "¿Algo nuevo o un clásico?", lead: "La época también es un gusto." },
  donde: {
    title: "¿Dónde la querés ver?",
    lead: "Marcá las plataformas que tenés y te mostramos solo lo que está ahí.",
  },
};

/** On phones the way forward stays in reach above the tab bar while the options scroll. */
const CONTINUE_BAR =
  "sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-(--z-raised) -mx-(--spacing-gutter) flex flex-wrap items-center gap-3 border-t border-frameline bg-leader px-(--spacing-gutter) py-3 " +
  "md:static md:mx-0 md:border-0 md:bg-transparent md:p-0";

const tileClasses =
  "group grid min-h-20 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 rounded-aperture border px-4 py-3.5 text-left " +
  "transition-colors duration-(--duration-fast) ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge " +
  "border-control-line bg-acetate hover:border-emulsion-muted aria-pressed:border-edge aria-pressed:bg-acetate-raised";

/** One answer, as a tile: icon in a projector-aperture frame, label, and what it means. */
const Tile = ({
  pressed,
  onClick,
  icon,
  label,
  hint,
}: {
  pressed: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  hint?: string;
}) => (
  <button type="button" aria-pressed={pressed} onClick={onClick} className={tileClasses}>
    <span
      aria-hidden
      className={cn(
        "grid size-12 place-items-center rounded-aperture bg-leader outline outline-1 -outline-offset-1 [&_svg]:size-6",
        pressed ? "text-edge outline-edge" : "text-emulsion-muted outline-frameline",
      )}
    >
      {pressed ? <RiCheckLine /> : icon}
    </span>
    <span className="grid gap-0.5">
      <span className="text-title font-bold text-emulsion">{label}</span>
      {hint && <span className="text-small text-emulsion-muted">{hint}</span>}
    </span>
  </button>
);

const SingleChoice = <V extends string>({
  options,
  value,
  onChoose,
}: {
  options: Option<V>[];
  value?: V;
  onChoose: (value: V) => void;
}) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {options.map((option) => {
      const Icon = ICONS[option.value] ?? RiShuffleLine;
      return (
        <Tile
          key={option.value}
          pressed={value === option.value}
          onClick={() => onChoose(option.value)}
          icon={<Icon />}
          label={option.label}
          hint={option.hint}
        />
      );
    })}
  </div>
);

const MoodChoice = ({ answers, onDone }: { answers: Answers; onDone: (moods: Mood[]) => void }) => {
  const [moods, setMoods] = useState<Mood[]>(answers.animo ?? []);
  const toggle = (mood: Mood) =>
    setMoods((current) =>
      current.includes(mood)
        ? current.filter((m) => m !== mood)
        : // At the limit, the newest choice replaces the oldest.
          [...current, mood].slice(-MAX_MOODS),
    );
  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {moodOptions(answers.con).map((option) => {
          const Icon = ICONS[option.value] ?? RiShuffleLine;
          return (
            <Tile
              key={option.value}
              pressed={moods.includes(option.value)}
              onClick={() => toggle(option.value)}
              icon={<Icon />}
              label={option.label}
              hint={option.hint}
            />
          );
        })}
      </div>
      <div className={CONTINUE_BAR}>
        <Button disabled={moods.length === 0} onClick={() => onDone(moods)}>
          Seguir
        </Button>
        <p aria-live="polite" className="text-small text-emulsion-muted">
          {moods.length === 0 ? "Elegí al menos una." : `Elegiste ${moods.length} de ${MAX_MOODS}.`}
        </p>
      </div>
    </div>
  );
};

const ServiceChoice = ({
  answers,
  onDone,
}: {
  answers: Answers;
  onDone: (services: number[]) => void;
}) => {
  const { data: services = [], isPending } = useQuery(servicesQuery());
  const [chosen, setChosen] = useState<number[]>(answers.donde ?? []);
  const toggle = (id: number) =>
    setChosen((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-busy={isPending}>
        {isPending
          ? Array.from({ length: 8 }, (_, i) => (
              <div key={i} aria-hidden className="h-20 rounded-aperture bg-acetate-raised" />
            ))
          : services.map((service) => (
              <Tile
                key={service.id}
                pressed={chosen.includes(service.id)}
                onClick={() => toggle(service.id)}
                icon={
                  service.logoPath ? (
                    <img
                      src={tmdbImage(service.logoPath, 92)}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 rounded-aperture"
                    />
                  ) : (
                    <RiGlobalLine />
                  )
                }
                label={service.name}
              />
            ))}
      </div>
      <div className={CONTINUE_BAR}>
        <Button disabled={chosen.length === 0} onClick={() => onDone(chosen)}>
          {chosen.length === 0
            ? "Elegí tus plataformas"
            : `Buscar en ${chosen.length === 1 ? "esa plataforma" : `esas ${chosen.length}`}`}
        </Button>
        <Button variant="secondary" onClick={() => onDone([])}>
          <RiGlobalLine aria-hidden />
          En cualquier lado
        </Button>
      </div>
    </div>
  );
};

interface QuestionStepProps {
  step: QuestionKey;
  answers: Answers;
  onAnswer: (patch: Answers) => void;
  onBack?: () => void;
}

/** One question of "¿Qué vemos?", with its progress printed like a frame counter. */
export const QuestionStep = ({ step, answers, onAnswer, onBack }: QuestionStepProps) => {
  const index = STEPS.indexOf(step);
  const question = QUESTIONS[step];
  const heading = useRef<HTMLHeadingElement>(null);

  // A new question takes focus, so screen readers and keyboards land on it.
  useEffect(() => {
    if (index > 0) heading.current?.focus({ preventScroll: true });
  }, [index]);

  return (
    <section aria-labelledby="question" className="grid gap-7">
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-4">
          <p className="font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%] tabular-nums">
            <span className="text-edge">Pregunta {String(index + 1).padStart(2, "0")}</span> /{" "}
            {String(STEPS.length).padStart(2, "0")}
          </p>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <RiArrowLeftLine aria-hidden />
              Atrás
            </Button>
          )}
        </div>
        {/* The reel so far: one segment per question, lit up to this one. */}
        <div aria-hidden className="grid grid-cols-6 gap-1.5">
          {STEPS.map((key, i) => (
            <span
              key={key}
              className={cn(
                "h-1 rounded-perf transition-colors duration-(--duration-base)",
                i <= index ? "bg-edge" : "bg-frameline",
              )}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <h2
          id="question"
          ref={heading}
          tabIndex={-1}
          className="font-display text-display-lg font-extrabold text-balance text-emulsion uppercase focus:outline-none"
        >
          {question.title}
        </h2>
        <p className="text-body-lg text-emulsion-muted">{question.lead}</p>
      </div>

      {step === "con" && (
        <SingleChoice options={COMPANY} value={answers.con} onChoose={(con) => onAnswer({ con })} />
      )}
      {step === "tipo" && (
        <SingleChoice options={KIND} value={answers.tipo} onChoose={(tipo) => onAnswer({ tipo })} />
      )}
      {step === "tiempo" && (
        <SingleChoice
          options={TIME}
          value={answers.tiempo}
          onChoose={(tiempo) => onAnswer({ tiempo })}
        />
      )}
      {step === "animo" && <MoodChoice answers={answers} onDone={(animo) => onAnswer({ animo })} />}
      {step === "epoca" && (
        <SingleChoice
          options={ERA}
          value={answers.epoca}
          onChoose={(epoca) => onAnswer({ epoca })}
        />
      )}
      {step === "donde" && (
        <ServiceChoice answers={answers} onDone={(donde) => onAnswer({ donde })} />
      )}
    </section>
  );
};
