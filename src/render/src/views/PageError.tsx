import { useRouteError } from "react-router-dom";

export function PageError() {
  const error = useRouteError();
  return <>
    <div>Error page not find</div>
    <p>
      {error?.toString()}
    </p>
  </>;
}