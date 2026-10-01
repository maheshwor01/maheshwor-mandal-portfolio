import { EXPERIENCE } from '../data/experience'

function formatRange(start, end) {
  if (start && end) return `${start} — ${end}`
  return start || end || ''
}

// Turns **text** into <strong>text</strong>
function renderBold(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))
}

export default function Experience() {
  return (
    <section id="experience" className="section section-alt">
      <div className="wrap">
        <div className="eyebrow">// 04 experience</div>
        <h2 className="title">
          My <span className="accent">Experience</span>
        </h2>
        <p className="section-lead">
          Roles, internships, freelance work, and academic experience — the path I&apos;m building in AI, data, and
          software.
        </p>

        <div className="exp-timeline">
          {EXPERIENCE.map((item) => (
            <article key={item.id} className="exp-card">
              <div className="exp-when">
                {item.type && <span className="project-tag">{item.type}</span>}
                {formatRange(item.startDate, item.endDate) && (
                  <span className="exp-dates">{formatRange(item.startDate, item.endDate)}</span>
                )}
              </div>
              <div className="exp-body">
                <h3>{item.role}</h3>
                <p className="exp-company">{item.company}</p>
                <ul className="exp-bullets">
                  {item.bullets.map((b) => (
                    <li key={b}>{renderBold(b)}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
