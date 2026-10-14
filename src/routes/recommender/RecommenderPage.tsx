import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, m } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/Button";
import { StatePanel } from "@/components/ui/StatePanel";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { recommend } from "@/features/recommender/engine";
import { LeaderCountdown } from "@/features/recommender/LeaderCountdown";
import { candidatesQuery } from "@/features/recommender/queries";
import { QuestionStep } from "@/features/recommender/QuestionStep";
import {
  currentStep,
  describeAnswers,
  isComplete,
  parseAnswers,
  STEPS,
  writeAnswers,
  type Answers,
  type Complete,
  type QuestionKey,
} from "@/features/recommender/questions";
import { Results } from "@/features/recommender/Results";
import { todayIso } from "@/lib/dates";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { servicesQuery } from "@/features/services/catalog";
import { genresQuery } from "@/services/tmdb/queries";

const ResultsView = ({
  answers,
  onEdit,
  onRestart,
}: {
  answers: Complete;
  onEdit: () => void;
  onRestart: () => void;
}) => {
  const candidates = useQuery(candidatesQuery(answers));
  const services = useQuery(servicesQuery());
  const movieGenres = useQuery(genresQuery("movie"));
  const tvGenres = useQuery(genresQuery("tv"));
  const { favorites } = useFavoriteContext();

  if (candidates.isPending) return <LeaderCountdown />;
  if (candidates.isError) {
    return (
      <StatePanel
        role="alert"
        title="Se cortó la proyección"
        action={<Button onClick={() => void candidates.refetch()}>Reintentar</Button>}
      >
        No pudimos buscar títulos. Revisá tu conexión y volvé a intentar.
      </StatePanel>
    );
  }

  const genreNames = new Map(
    [...(movieGenres.data ?? []), ...(tvGenres.data ?? [])].map((g) => [g.id, g.name]),
  );
  const results = recommend(candidates.data, answers, {
    today: todayIso(),
    saved: new Set(favorites.map((f) => `${f.mediaType}-${f.tmdbId}`)),
    genreNames,
  });
  const serviceList = services.data ?? [];
  return (
    <Results
      results={results}
      summary={describeAnswers(answers, new Map(serviceList.map((s) => [s.id, s.name])))}
      services={serviceList.filter((s) => answers.donde.includes(s.id))}
      onEdit={onEdit}
      onRestart={onRestart}
    />
  );
};

/**
 * "¿Qué vemos?": six questions, then the ten best picks for tonight, ranked and explained.
 * Everything lives in the URL: answers (shareable results) and, while editing, the question
 * being changed (?paso=animo).
 */
const RecommenderPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const answers = parseAnswers(params);
  const editing = params.get("paso") as QuestionKey | null;
  const step = editing && STEPS.includes(editing) ? editing : currentStep(answers);
  const index = step ? STEPS.indexOf(step) : -1;

  const go = (next: Answers, paso?: QuestionKey) => {
    const search = writeAnswers(next);
    if (paso) search.set("paso", paso);
    // Each answer is a history entry: the browser's back button walks the questions back.
    setParams(search, { preventScrollReset: true });
    window.scrollTo({ top: 0 });
  };

  const answer = (patch: Answers) => {
    const next = { ...answers, ...patch };
    // Families never get horror, even if it was picked before switching company.
    if (next.con === "familia" && next.animo?.includes("miedo")) {
      next.animo = next.animo.filter((mood) => mood !== "miedo");
      if (next.animo.length === 0) delete next.animo;
    }
    // Revisiting (after "Atrás" or "Cambiar respuestas"): walk forward one question at a time,
    // with the earlier choices marked, until the last one shows the results again.
    const following = editing ? STEPS[index + 1] : undefined;
    go(next, following);
  };
  const back = index > 0 ? () => go(answers, STEPS[index - 1]) : undefined;

  return (
    <div className="mx-auto grid max-w-(--container-reel) gap-10 px-(--spacing-gutter) pt-8 pb-6 lg:pt-12">
      <title>¿Qué vemos? · PelicuLed</title>
      <meta
        name="description"
        content="Seis preguntas y te recomendamos diez películas o series para hoy, ordenadas y explicadas, según con quién la ves, cuánto tiempo tenés y dónde."
      />
      <header className="grid max-w-[60rem] gap-3">
        <h1 className="font-display text-display-xl font-extrabold text-balance text-emulsion uppercase">
          {step ? "¿Qué vemos hoy?" : "Tu función de hoy"}
        </h1>
        {step && (
          <p className="max-w-[60ch] text-body-lg text-emulsion-muted">
            Seis preguntas y te damos diez títulos ordenados de la mejor opción para abajo, con el
            porqué de cada uno.
          </p>
        )}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={step ?? "results"}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className={step ? "max-w-[60rem]" : "max-w-[76rem]"}
        >
          {step ? (
            <QuestionStep step={step} answers={answers} onAnswer={answer} onBack={back} />
          ) : isComplete(answers) ? (
            <ResultsView
              answers={answers}
              onEdit={() => go(answers, STEPS[0])}
              onRestart={() => navigate({ search: "" })}
            />
          ) : null}
        </m.div>
      </AnimatePresence>
    </div>
  );
};

export default RecommenderPage;
