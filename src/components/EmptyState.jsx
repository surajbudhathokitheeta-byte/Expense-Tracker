/**
 * Shown wherever a list or chart has nothing to display, so the user always
 * gets an explanation instead of a blank box.
 */
export function EmptyState({ icon = '◍', title, description, action }) {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty__title">{title}</p>
      {description ? <p className="empty__text">{description}</p> : null}
      {action}
    </div>
  )
}
