import loadingImg from "../../images/pororoLoad.gif";

const Loading = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white">
      <img className="" src={loadingImg} alt="Cargando.." />;
    </div>
  );
};

export default Loading;
