import React from "react";

const DetailVideos = ({ dataVideos }) => {
  return (
    <div className="w-full 2xl:w-3/5">
      <span className="text-lg font-semibold underline font-cineFontFamily">
        Trailers y videos
      </span>
      {dataVideos.results && dataVideos.results.length > 0 ? (
        dataVideos.results.map((e) => {
          return (
            <div key={e.key}>
              <VideoAccordion videoData={e} />
            </div>
          );
        })
      ) : (
        <p>No hay trailer ni video de esta película</p>
      )}
    </div>
  );
};

const VideoAccordion = ({ videoData }) => {
  return (
    <div className="accordion accordion-flush" id="accordionFlushExample">
      <div className="accordion-item">
        <span className="accordion-header" id={`flush-heading${videoData.id}`}>
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#flush-${videoData.id}`}
            aria-expanded="false"
            aria-controls={`flush-${videoData.id}`}
          >
            {videoData.type} / {videoData.name}
          </button>
        </span>
        <div
          id={`flush-${videoData.id}`}
          className="accordion-collapse collapse"
          aria-labelledby={`flush-heading${videoData.id}`}
          data-bs-parent="#accordionFlushExample"
        >
          <div className="accordion-body">
            <VideoPlayer videoKey={videoData.key} />
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoPlayer = ({ videoKey }) => {
  return (
    <div>
      <iframe
        className="w-full h-128 580:h-80"
        src={`https://www.youtube.com/embed/${videoKey}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default DetailVideos;
