// Button — small primitive with three variants.
// Variants:
//   primary — solid accent, dark text. Use for the single most important action in a view.
//   ghost   — bordered, transparent. Use for secondary actions.
//   icon    — square, bordered. Use in nav/footer for icon-only links.
// All variants render as <a> when `href` is provided, <button> otherwise.

import cn from "../../utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight " +
  "transition-[transform,background-color,border-color,color] duration-200 " +
  "will-change-transform select-none";

const sizes = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-11 px-5 text-[15px] rounded-lg",
  lg: "h-12 px-6 text-base rounded-lg",
};

const variants = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] hover:-translate-y-[1px] " +
    "hover:shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--accent)_70%,transparent)]",
  ghost:
    "border border-[var(--border-subtle)] text-[var(--text-primary)] " +
    "bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]",
  icon:
    "h-10 w-10 rounded-lg border border-[var(--border-subtle)] " +
    "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  className = "",
  ...rest
}) {
  const cls = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
