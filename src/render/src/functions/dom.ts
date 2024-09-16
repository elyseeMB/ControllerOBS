export function classNames(...classnames: (string | null | boolean)[]) {
  return classnames.filter((classname) => classname !== false && classname !== null).join(" ");
}