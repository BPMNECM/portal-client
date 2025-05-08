import clsx from "clsx";
import Link from "next/link";

export default function UnstyledLink({
                                       children,
                                       href,
                                       openNewTab = undefined,
                                       className,
                                       ...rest
                                     }) {
  const isNewTab =
    openNewTab !== undefined
      ? openNewTab
      : href && !href.startsWith("/") && !href.startsWith("#");
  
  if (!isNewTab) {
    return (
      <Link href={href}>
        <div {...rest} className={className}>
          {children}
        </div>
      </Link>
    );
  }
  
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
      className={clsx(className, "cursor-[ne-resize]")}
    >
      {children}
    </a>
  );
}
