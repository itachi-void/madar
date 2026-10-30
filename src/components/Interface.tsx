import {
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react"
import { Link } from "react-router"

export function SelectField({
  id,
  label,
  hideLabel = false,
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  id: string
  label: string
  hideLabel?: boolean
  options: {
    value: string
    label: string
    lang?: string
  }[]
}) {
  return (
    <>
      <label
        className={hideLabel ? "screen-reader-text" : undefined}
        htmlFor={id}
      >
        {label}
      </label>
      <select id={id} {...props}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            lang={option.lang}
            translate="no"
          >
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

// Small extensions of Madar's existing button, typography, and form patterns.
export function Button({
  className = "",
  variant = "solid",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "text" }) {
  return (
    <button
      type="button"
      className={`${variant === "solid" ? "mdr-btn" : "mdr-link"} ${className}`}
      {...props}
    />
  )
}

export function Heading({
  children,
  level = 2,
  id,
  className = "",
  ref,
  tabIndex,
}: {
  children: ReactNode
  level?: 1 | 2 | 3
  id?: string
  className?: string
  ref?: Ref<HTMLHeadingElement>
  tabIndex?: number
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3"
  return (
    <Tag
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      className={`${level === 1 ? "mdr-display" : "mdr-title"} ${className}`}
    >
      {children}
    </Tag>
  )
}

export function Notice({
  children,
  error = false,
}: {
  children: ReactNode
  error?: boolean
}) {
  return (
    <div
      className={`mdr-form-notice${error ? " is-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  )
}

export function Field({
  label,
  error,
  hint,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
  hint?: string
}) {
  const [visible, setVisible] = useState(false)
  const password = props.type === "password"
  return (
    <div className={`mdr-field ${className}`}>
      <label htmlFor={props.id}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="mdr-field__control">
        <input
          {...props}
          type={password && visible ? "text" : props.type}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
          }
        />
        {password && (
          <Button
            variant="text"
            className="mdr-password-toggle"
            aria-controls={props.id}
            aria-pressed={visible}
            aria-label={`${visible ? "إخفاء" : "إظهار"} ${label}`}
            onClick={() => setVisible(!visible)}
          >
            {visible ? "إخفاء" : "إظهار"}
          </Button>
        )}
      </div>
      {error ? (
        <p className="mdr-field__error" id={`${props.id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="mdr-field__hint" id={`${props.id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Choice({
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label className={`mdr-choice${props.checked ? " is-selected" : ""}`}>
      <input {...props} />
      <span>{children}</span>
    </label>
  )
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="mdr-page__head">
      <p className="mdr-eyebrow" dir="ltr">
        {eyebrow}
      </p>
      <Heading level={1}>{title}</Heading>
      {children && <div className="mdr-lead">{children}</div>}
    </header>
  )
}

export function EmptyState({
  title,
  children,
  to = "/shop/",
  action = "اكتشف التشكيلة",
}: {
  title: string
  children: ReactNode
  to?: string
  action?: string
}) {
  return (
    <section className="mdr-empty">
      <span className="mdr-empty__mark" aria-hidden="true">
        M / مدار
      </span>
      <Heading>{title}</Heading>
      <p className="mdr-lead">{children}</p>
      <Link className="mdr-btn" to={to}>
        {action}
        <span aria-hidden="true">←</span>
      </Link>
    </section>
  )
}
