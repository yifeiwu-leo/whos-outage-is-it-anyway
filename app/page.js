import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://status.bfl.ml/history.rss';

async function fetchIncidents() {
  const res = await fetch(FEED_URL, {
    // Cache for 5 minutes on the server; good default for a status page.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch status feed: ${res.status}`);
  }

  const text = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  const data = parser.parse(text);
  const items = data?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => {
    const rawDescription =
      typeof item.description === 'string' ? item.description : '';

    // The RSS feed encodes HTML tags as entities (&lt;p&gt; etc).
    const htmlDecoded = rawDescription
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    // Strip HTML tags and collapse whitespace for a simple text summary.
    const cleanDescription = htmlDecoded
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      title: item.title ?? 'Untitled Incident',
      link: item.link,
      pubDate: item.pubDate,
      description: cleanDescription,
    };
  });
}

export default async function Page() {
  let incidents = [];
  let error = null;

  try {
    incidents = await fetchIncidents();
  } catch (err) {
    console.error(err);
    error = 'Unable to load status feed right now.';
  }

  return (
    <main className="page">
      <header className="header">
        <h1>Who&apos;s Outage Is It Anyway?</h1>
        <p>A tiny dashboard showing recent incidents for services we depend on.</p>
        <p className="subtitle">
          Currently showing history for{' '}
          <a href="https://status.bfl.ml" target="_blank" rel="noreferrer">
            Black Forest Labs
          </a>
          {' '}via their{' '}
          <a
            href="https://status.bfl.ml/history.rss"
            target="_blank"
            rel="noreferrer"
          >
            status RSS feed
          </a>
          .
        </p>
      </header>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        <section className="incidents">
          {incidents.length === 0 ? (
            <p>No incidents found in the feed.</p>
          ) : (
            incidents.map((incident) => (
              <article
                key={`${incident.pubDate}-${incident.title}`}
                className="incident"
              >
                <h2>{incident.title}</h2>
                {incident.pubDate && (
                  <p className="meta">
                    {new Date(incident.pubDate).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                )}
                {incident.description && (
                  <p className="description">{incident.description}</p>
                )}
                {incident.link && (
                  <a
                    href={incident.link}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    View details
                  </a>
                )}
              </article>
            ))
          )}
        </section>
      )}

      <footer className="footer">
        <p>
          This is intentionally minimal. Add more providers later by fetching
          additional status feeds and merging their incidents.
        </p>
      </footer>
    </main>
  );
}


