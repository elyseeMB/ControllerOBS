type PropsHeaderLayout = {
  title: string;
  subtitle: string,
  iconEdit: string,
  menu: JSX.Element
}

export function HeaderLayout({title, subtitle, iconEdit, menu}: Partial<PropsHeaderLayout>) {
  
  return <div>
    je suis le header
    {title}
    {subtitle}
    {iconEdit}
    {menu}
  </div>;
}