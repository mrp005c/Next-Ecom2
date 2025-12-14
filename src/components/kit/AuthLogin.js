"use client";

export default function AuthLink({ href, className, children }) {
  const handleClick = (e) => {
    e.preventDefault();

    window.open(
    "/login",
    "login",
    "width=500,height=600"
  );
  };

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
