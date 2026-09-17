/**
 * Masked word reveal: each word sits in an overflow-hidden box and slides up
 * from below on entry. Used for display headings, where a plain fade would
 * look flat at that size.
 *
 * `stagger` is per-word ms; `delay` offsets the whole line.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  stagger = 55,
  delay = 0,
  className = '',
}) {
  const words = String(text).split(' ').filter(Boolean)

  return (
    <Tag className={`split ${className}`}>
      {words.map((word, i) => (
        <span className="split__line" key={`${word}-${i}`}>
          <span className="split__inner" style={{ '--delay': `${delay + i * stagger}ms` }}>
            {word}
          </span>
          {i < words.length - 1 && <span className="split__space"> </span>}
        </span>
      ))}
    </Tag>
  )
}
