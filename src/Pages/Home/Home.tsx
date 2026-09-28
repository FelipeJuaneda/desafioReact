import { Link } from "react-router";
import Header from "../../Layouts/Header/Header";
import { useAuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading/Loading";
export default function Home() {
  const { loading } = useAuthContext();

  const buttonsHome = [
    {
      id: 1,
      title: "Peliculas Populares",
      divFather: "mt-3 shadow",
      to: "/popularFilms",
      linkClass:
        "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-verde-principal-700 hover:bg-verde-principal-600 md:py-4 md:text-lg md:px-10",
    },
    {
      id: 2,
      title: "Series Populares",
      divFather: "mt-3 sm:mt-0 sm:ml-3",
      to: "/popularTv",
      linkClass:
        "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-verde-principal-700 bg-indigo-100 hover:bg-verde-principal-50  md:py-4 md:text-lg md:px-10",
    },
  ];

  if (loading) return <Loading />;
  return (
    <div className="relative overflow-hidden bg-white lg:h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:h-screen lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <svg
            className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <Header />

          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">PELICULED</span>{" "}
                <span className="block text-verde-principal-700 xl:inline">Bienvenidos.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Millones de películas, programas de televisión y personas por descubrir. Explora
                ahora.
              </p>
              <div className="mt-5 items-baseline sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                {buttonsHome.map((boton) => {
                  return (
                    <div key={boton.id} className={boton.divFather}>
                      <Link to={boton.to} className={boton.linkClass}>
                        {boton.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src={
            "https://images.pexels.com/photos/7234226/pexels-photo-7234226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          alt="fotos home de peliculed"
        />
      </div>
    </div>
  );
}
