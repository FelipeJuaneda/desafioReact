import React from "react";

const VideosTv = ({ videosTv }) => {
  return (
    <div className="w-full 2xl:w-3/5">
      <span className="text-lg font-semibold underline font-cineFontFamily ">
        Trailers y videos
      </span>
      {videosTv.length > 0 ? (
        videosTv.map((e) => {
          return (
            <div
              key={e.key}
              className="accordion accordion-flush"
              id="accordionFlushExample"
            >
              <div className="accordion-item">
                <span className="accordion-header" id={`flush-heading${e.id}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#flush-${e.id}`}
                    aria-expanded="false"
                    aria-controls={`flush-${e.id}`}
                  >
                    {e.type} / {e.name}
                  </button>
                </span>
                <div
                  id={`flush-${e.id}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`flush-heading${e.id}`}
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    <div>
                      <iframe
                        className="w-full h-128 580:h-80"
                        src={`https://www.youtube.com/embed/${e.key}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No hay trailer ni video de esta serie</p>
      )}
    </div>
  );
};

export default VideosTv;
