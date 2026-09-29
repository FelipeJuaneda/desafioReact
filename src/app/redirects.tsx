import { Navigate, useParams } from "react-router";

/** Keeps links shared with the old English URLs working (/film/550, /genre/28…). */
export const RedirectWithId = ({ to }: { to: (id: string) => string }) => {
  const { id = "" } = useParams();
  return <Navigate to={to(id)} replace />;
};
