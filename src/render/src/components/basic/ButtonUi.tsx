import { classNames } from "../../functions/dom.ts";
import * as React from "react";
import { Profile } from "../../../../types/types.ts";

type ParamsButtonUi = {
  disabled?: boolean
  active?: boolean
  loading?: boolean
  href?: boolean
  onClick?: any
}


export function ButtonUi(props: ParamsButtonUi & Profile) {
  
  
  return <button
    onClick={props.onClick}
    className={classNames("profile__btn", props.disabled || props.loading! && "disabled", props.active! && "btn-primary", props.loading! && "loading")}>
    <span>{props.name}</span>
  </button>;
  
}