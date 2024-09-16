import { HeaderLayout } from "./HeaderLayout.tsx";
import { ComponentProps } from "react";
import { Outlet } from "react-router-dom";
import { FooterLayout } from "./FooterLayout.tsx";
import { SidebarLayout } from "./SidebarLayout.tsx";


type Params = ComponentProps<typeof HeaderLayout>

export function GlobalLayout(props: Params) {
  
  
  return <>
    <div className="grid-layout">
      <div className="sidebar__element">
        <SidebarLayout/>
      </div>
      
      <div className="header__element">
        <HeaderLayout title={props.title}
                      subtitle={props.subtitle}
                      iconEdit={props.iconEdit}
                      menu={props.menu}/>
      </div>
      
      <div id="body" className="content__element">
        <Outlet/>
      </div>
      
      <div className="footer__element">
        <FooterLayout/>
      </div>
    </div>
  
  </>;
}