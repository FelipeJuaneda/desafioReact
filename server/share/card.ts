// The 1200×630 card chat apps show for a shared title, drawn as a strip of 35 mm film: amber
// perforations top and bottom, the backdrop as the frame, poster, title in extra condensed caps
// and the edge-code line, like the title page. Built as plain element objects (what satori
// reads), so the server needs no JSX setup.
import type { ShareTitle } from "./title.js";

export const CARD = { width: 1200, height: 630 } as const;

const COLOR = {
  leader: "#0e0d0b",
  base: "#060504",
  emulsion: "#ede6d6",
  muted: "#a89f8c",
  edge: "#eaa53c",
  frameline: "#3a352d",
  controlLine: "#756c5b",
};

type Style = Record<string, string | number>;
interface CardNode {
  type: string;
  props: { style?: Style; children?: CardChild | CardChild[]; [key: string]: unknown };
}
type CardChild = CardNode | string | null | false;

const el = (type: string, props: CardNode["props"], ...children: CardChild[]): CardNode => ({
  type,
  props: { ...props, children: children.length > 1 ? children : children[0] },
});

const BAND = 46;
const PERF_COUNT = 24;

const perforations = () =>
  el(
    "div",
    {
      style: {
        display: "flex",
        height: BAND,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        backgroundColor: COLOR.base,
      },
    },
    ...Array.from({ length: PERF_COUNT }, () =>
      el("div", {
        style: {
          width: 24,
          height: 15,
          borderRadius: 3,
          backgroundColor: COLOR.edge,
          opacity: 0.88,
        },
      }),
    ),
  );

/** Long titles step down so they fit in three lines at most. */
const titleSize = (name: string) => {
  const length = name.length;
  if (length <= 12) return 128;
  if (length <= 20) return 108;
  if (length <= 32) return 90;
  if (length <= 48) return 74;
  return 62;
};

const LOGO = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="18" y="13" width="28" height="38" rx="3" fill="none" stroke="${COLOR.emulsion}" stroke-width="5"/><g fill="${COLOR.edge}"><rect x="6" y="13" width="6" height="8" rx="1.5"/><rect x="6" y="28" width="6" height="8" rx="1.5"/><rect x="6" y="43" width="6" height="8" rx="1.5"/><rect x="52" y="13" width="6" height="8" rx="1.5"/><rect x="52" y="28" width="6" height="8" rx="1.5"/><rect x="52" y="43" width="6" height="8" rx="1.5"/></g></svg>`,
).toString("base64")}`;

export interface CardImages {
  poster: string | null;
  backdrop: string | null;
}

export const titleCard = (title: ShareTitle, images: CardImages): CardNode => {
  const frameHeight = CARD.height - BAND * 2;
  const posterHeight = 438;
  const posterWidth = posterHeight * (2 / 3);
  const edgeCode = [
    title.kind === "movie" ? "Película" : "Serie",
    title.year,
    title.length,
    title.rating,
  ].filter(Boolean) as string[];
  const tagline = title.tagline && title.tagline.length <= 70 ? title.tagline : null;
  const name = title.name.length > 70 ? `${title.name.slice(0, 68).trimEnd()}…` : title.name;

  return el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: CARD.width,
        height: CARD.height,
        backgroundColor: COLOR.leader,
        fontFamily: "Sofia Sans",
      },
    },
    perforations(),
    el(
      "div",
      { style: { display: "flex", position: "relative", height: frameHeight, overflow: "hidden" } },
      images.backdrop &&
        el("img", {
          src: images.backdrop,
          width: CARD.width,
          height: frameHeight,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: CARD.width,
            height: frameHeight,
            objectFit: "cover",
          },
        }),
      el("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: CARD.width,
          height: frameHeight,
          backgroundImage: images.backdrop
            ? "linear-gradient(90deg, rgba(14,13,11,0.97) 0%, rgba(14,13,11,0.9) 38%, rgba(14,13,11,0.55) 70%, rgba(14,13,11,0.3) 100%)"
            : `linear-gradient(135deg, ${COLOR.leader} 0%, #171511 100%)`,
        },
      }),
      el(
        "div",
        {
          style: {
            position: "absolute",
            top: 30,
            right: 38,
            display: "flex",
            alignItems: "center",
            gap: 12,
          },
        },
        el("img", { src: LOGO, width: 44, height: 44 }),
        el(
          "div",
          {
            style: {
              fontFamily: "Sofia Sans Extra Condensed",
              fontSize: 38,
              color: COLOR.emulsion,
              letterSpacing: 0.5,
            },
          },
          "PelicuLed",
        ),
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 48,
            width: "100%",
            height: "100%",
            padding: "0 56px",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              flexShrink: 0,
              width: posterWidth,
              height: posterHeight,
              borderRadius: 4,
              overflow: "hidden",
              border: `2px solid ${images.poster ? "rgba(237,230,214,0.2)" : COLOR.frameline}`,
              backgroundColor: "#171511",
              // No box-shadow: resvg blurs in software (+1.7 s per card) and the ground is near black.
            },
          },
          images.poster
            ? el("img", {
                src: images.poster,
                width: posterWidth,
                height: posterHeight,
                style: { width: "100%", height: "100%", objectFit: "cover" },
              })
            : null,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexShrink: 1,
              gap: 20,
              paddingTop: 34,
            },
          },
          el(
            "div",
            {
              style: {
                display: "flex",
                gap: 14,
                fontFamily: "Martian Mono",
                fontSize: 19,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: COLOR.muted,
              },
            },
            ...edgeCode.flatMap((item, index) => [
              index > 0 ? el("span", { style: { color: COLOR.controlLine } }, "·") : null,
              el(
                "span",
                {
                  style: {
                    color: index === 0 || item === title.rating ? COLOR.edge : COLOR.muted,
                  },
                },
                item,
              ),
            ]),
          ),
          el(
            "div",
            {
              style: {
                fontFamily: "Sofia Sans Extra Condensed",
                fontSize: titleSize(name),
                lineHeight: 0.9,
                textTransform: "uppercase",
                color: COLOR.emulsion,
              },
            },
            name,
          ),
          tagline &&
            el(
              "div",
              {
                style: {
                  fontFamily: "Sofia Sans Extra Condensed",
                  fontSize: 32,
                  lineHeight: 1.05,
                  textTransform: "uppercase",
                  color: COLOR.muted,
                },
              },
              tagline,
            ),
          title.genres.length > 0 &&
            el(
              "div",
              { style: { display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 } },
              ...title.genres.slice(0, 3).map((genre) =>
                el(
                  "div",
                  {
                    style: {
                      display: "flex",
                      padding: "7px 14px",
                      borderRadius: 2,
                      border: `1.5px solid ${COLOR.frameline}`,
                      backgroundColor: "rgba(23,21,17,0.85)",
                      fontSize: 22,
                      color: COLOR.muted,
                    },
                  },
                  genre,
                ),
              ),
            ),
        ),
      ),
    ),
    perforations(),
  );
};
