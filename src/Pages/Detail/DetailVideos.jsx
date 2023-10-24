import React from "react";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";

const DetailVideos = ({ dataVideos }) => {
  return (
    <div className="w-full lg:w-9/12 lg:m-auto">
      <span className="text-lg font-semibold underline font-cineFontFamily">
        Trailers y videos
      </span>
      {dataVideos.results && dataVideos.results.length > 0 ? (
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

const VideoAccordion = ({ videoData }) => {
  return (
    <AccordionItem header={`${videoData.type} / ${videoData.name}`}>
      <VideoPlayer videoKey={videoData.key} />
    </AccordionItem>
  );
};

const VideoPlayer = ({ videoKey }) => {
  return (
    <div>
      <iframe
        loading="lazy"
        className="w-full h-128 580:h-80"
        src={`https://www.youtube.com/embed/${videoKey}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const AccordionItem = ({ header, ...children }) => (
  <Item
    {...children}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <i
          className={`ri-arrow-up-s-line text-xl ml-auto transition-transform duration-200 ease-out ${
            isEnter && "rotate-180"
          }`}
          alt="Chevron"
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
