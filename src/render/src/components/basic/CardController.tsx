import { useNavigate } from "react-router-dom";
import { classNames } from "../../functions/dom.ts";

type Params = {
  name: string
  description: string
  isValid: boolean
  onClick: (e: any) => void
}

export function CardController({name, description, onClick, isValid}: Params) {
  const navigation = useNavigate();
  const handleClick = (e: any) => {
    onClick(e);
    const element = e.currentTarget;
    const title = element.querySelector(".card__controller-name").innerText;
    if (name.includes(title)) {
      const parsePath = title.split(" ")[0].trim().toLowerCase();
      const path = parsePath.concat("/connection");
      navigation(`/${path}`);
    }
  };
  let className = classNames("card__controller", isValid && "card__controller-valid");
  return <div onClick={handleClick} className={className} aria-disabled={!isValid}>
    <span className="card__controller-name">{name}</span>
    <div className="card__controller-description">
      <p>
        {description}
      </p>
    </div>
  </div>;
}