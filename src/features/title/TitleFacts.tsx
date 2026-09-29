import { formatCount, formatDate, formatRating } from "@/lib/format";
import type { Credits, TitleDetail } from "@/types/tmdb";

const LANGUAGES = new Intl.DisplayNames(["es"], { type: "language" });

/** The technical sheet: who made it and the numbers, as a definition list. */
export const TitleFacts = ({ title, credits }: { title: TitleDetail; credits?: Credits }) => {
  const isMovie = "runtime" in title;
  const directors = isMovie
    ? credits?.crew.filter((member) => member.job === "Director").map((member) => member.name)
    : title.created_by?.map((person) => person.name);
  const original = isMovie ? title.original_title : title.original_name;
  const name = isMovie ? title.title : title.name;

  const facts: Array<[string, string | null | undefined]> = [
    [isMovie ? "Dirección" : "Creación", directors?.join(", ")],
    ["Título original", original !== name ? original : null],
    [
      isMovie ? "Estreno" : "Primera emisión",
      formatDate(isMovie ? title.release_date : title.first_air_date),
    ],
    ["Episodios", !isMovie && title.number_of_episodes ? String(title.number_of_episodes) : null],
    ["Idioma original", title.original_language ? LANGUAGES.of(title.original_language) : null],
    [
      "Puntaje",
      title.vote_count
        ? `${formatRating(title.vote_average)} (${formatCount(title.vote_count)} votos)`
        : null,
    ],
  ];

  const visible = facts.filter((fact): fact is [string, string] => Boolean(fact[1]));
  if (visible.length === 0) return null;

  return (
    <section aria-labelledby="title-facts">
      <h2 id="title-facts" className="font-display text-display-lg font-extrabold uppercase">
        Ficha
      </h2>
      <dl className="mt-4 grid gap-x-8 border-t border-frameline sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(([label, value]) => (
          <div key={label} className="grid gap-1 border-b border-frameline py-3.5">
            <dt className="font-code text-code text-emulsion-muted uppercase [font-stretch:75%]">
              {label}
            </dt>
            <dd className="text-body text-emulsion first-letter:uppercase">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
