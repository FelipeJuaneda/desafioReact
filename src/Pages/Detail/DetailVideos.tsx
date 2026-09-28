import { Accordion, AccordionItem as Item, type AccordionItemProps } from "@szhsin/react-accordion";
import type { Video, Videos } from "../../types/tmdb";

const DetailVideos = ({ dataVideos }: { dataVideos: Videos | null }) => {
  return (
    <div className="w-full lg:m-auto lg:w-9/12">
      <span className="font-cineFontFamily text-lg font-semibold underline">Trailers y videos</span>
      {dataVideos?.results && dataVideos.results.length > 0 ? (
        <Accordion transition transitionTimeout={200}>
          {dataVideos.results.map((e) => (
            <VideoAccordion key={e.id} videoData={e} />
          ))}
        </Accordion>
      ) : (
        <p>No hay trailer ni video de esta película</p>
      )}
    </div>
  );
};

const VideoAccordion = ({ videoData }: { videoData: Video }) => {
  return (
    <AccordionItem header={`${videoData.type} / ${videoData.name}`}>
      <VideoPlayer videoKey={videoData.key} />
    </AccordionItem>
  );
};

const VideoPlayer = ({ videoKey }: { videoKey: string }) => {
  return (
    <div>
      <iframe
        loading="lazy"
        className="h-128 w-full 580:h-80"
        src={`https://www.youtube.com/embed/${videoKey}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

type StyledAccordionItemProps = Omit<AccordionItemProps, "header"> & { header: string };

const AccordionItem = ({ header, ...children }: StyledAccordionItemProps) => (
  <Item
    {...children}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <i
          className={`ri-arrow-up-s-line ml-auto text-xl transition-transform duration-200 ease-out ${
            isEnter && "rotate-180"
          }`}
        />
      </>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full p-4 text-left hover:bg-verde-principal-500 ${
          isEnter && "bg-verde-principal-600"
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-4" }}
  />
);

export default DetailVideos;
