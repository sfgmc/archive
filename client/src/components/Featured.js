import React from 'react';
import { Link } from 'react-scroll';
import decade00s from '../images/decades/00s.jpg';
import decade10s from '../images/decades/10s.jpg';
import decade70s from '../images/decades/70s.jpg';
import decade80s from '../images/decades/80s.jpg';
import decade90s from '../images/decades/90s.jpg';

// import { useArchiveStore } from '../lib/ArchiveStore';
const archive = null;
const filterRange = (range, archive) => {
  const date1 = new Date(`January 01, ${range[0]} 00:00:00`);
  const date2 =
    range[1] === 'now'
      ? new Date()
      : new Date(`December 31, ${range[1]} 00:00:00`);
  archive.methods.setFilter('dateRange', [date1, date2]);
};
export const Featured = props => {
  const { setShouldFilterByDate, setFilterByDateRange, updateResults } = props;
  // const archive = useArchiveStore();

  return (
    <div className="box alt container">
      <Link
        activeClass="active"
        to="searchResults"
        smooth={true}
        offset={-70}
        duration={1000}
      >
        <section
          className="feature left"
          onClick={() => filterRange([1978, 1979], archive)}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="image icon"
            style={{
              background: `url(${decade70s})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="content">
            <h3>Where we started</h3>
            <p>
              From the first performance on the steps of City Hall in 1978, The
              San Francisco Gay Men's Chorus has been a beacon of hope to the
              gay community both locally and abroad.
            </p>
          </div>
        </section>
      </Link>
      <Link
        activeClass="active"
        to="searchResults"
        smooth={true}
        offset={-70}
        duration={1000}
      >
        <section
          className="feature right"
          onClick={() => filterRange([1980, 1989], archive)}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="image icon"
            style={{
              background: `url(${decade80s})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="content">
            <h3>The 1980s</h3>
            <p>
              A short blurb about what the chorus went through in the 80s. Click
              here to see archival pieces from this era.
            </p>
          </div>
        </section>
      </Link>
      <Link
        activeClass="active"
        to="searchResults"
        smooth={true}
        offset={-70}
        duration={1000}
      >
        <section
          className="feature left"
          onClick={() => filterRange([1990, 1999], archive)}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="image icon"
            style={{
              background: `url(${decade90s})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="content">
            <h3>The 1990s</h3>
            <p>
              A short blurb about what the chorus went through in the 90s. Click
              here to see archival pieces from this era.
            </p>
          </div>
        </section>
      </Link>
      <Link
        activeClass="active"
        to="searchResults"
        smooth={true}
        offset={-70}
        duration={1000}
      >
        <section
          className="feature right"
          onClick={() => filterRange([2000, 2009], archive)}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="image icon"
            style={{
              background: `url(${decade00s})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="content">
            <h3>The 2000s</h3>
            <p>
              A short blurb about what the chorus went through in the 00s. Click
              here to see archival pieces from this era.
            </p>
          </div>
        </section>
      </Link>
      <Link
        activeClass="active"
        to="searchResults"
        smooth={true}
        offset={-70}
        duration={1000}
      >
        <section
          className="feature left"
          onClick={() => filterRange([2010, 'now'], archive)}
          style={{ cursor: 'pointer' }}
        >
          <span
            className="image icon"
            style={{
              background: `url(${decade10s})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="content">
            <h3>2010 to Now</h3>
            <p>
              A short blurb about where we are now. Click here to see archival
              pieces from this era.
            </p>
          </div>
        </section>
      </Link>
    </div>
  );
};
