import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import { Block, Col, Row } from 'jsxstyle';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import App from '../components/App';
import { Featured } from '../components/Featured';
import { Footer } from '../components/Footer';
import { Search } from '../components/Search';
import '../css/Main.css';
import cpntentfulLogo from '../images/contentful-logo.png';
import glbthsLogo from '../images/glbths-logo.png';
import logo from '../images/logo-invert.svg';

export const Home = props => {
  return (
    <App>
      <div>
        <Col alignItems="center" justifyContent="center" className="header">
          <Block
            backgroundImage={`url(${logo})`}
            backgroundPosition="center center"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
            width="100%"
            maxWidth={500}
            height={200}
          />
          <h1>We remember.</h1>
          <Block fontStyle="italic" marginTop={32}>
            In partnership with
          </Block>
          <br />
          <Row alignItems="center" justifyContent="center" marginBottom={16}>
            <a href="https://www.glbthistory.org/" target="_blank">
              <Block
                component="img"
                height={75}
                props={{ src: glbthsLogo, alt: 'GLBT Historical Society' }}
              />
            </a>
            <Block fontStyle="italic" margin={16}>
              and
            </Block>
            <a href="https://www.contentful.com/" target="_blank">
              <Block
                component="img"
                height={30}
                props={{ src: cpntentfulLogo, alt: 'Contentful' }}
              />
            </a>
          </Row>
          <Block component="p" width="100%" maxWidth={750}>
            An online portal for the rich history of the <br />
            San Francisco Gay Men's Chorus, <br />
            with the photos, videos, and stories that make us who we are.
          </Block>
        </Col>
        <div id="main">
          <header className="major container medium">
            <h2>
              I just want to get people together
              <br />
              to have fun making music.
              <br />
            </h2>
            <p>
              Jon Reed Sims
              <br />
              SFGMC Founder
            </p>
          </header>
          <Featured />
          <Search />
          <footer className="major container medium">
            <h3>We need your help</h3>
            <p>
              The SFGMC Archive is an ongoing volunteer effort to chronicle the
              history and stories of our community. As such, our work is never
              done, with new media and content being delivered to us regularly,
              and we need all the help we can get! If you're willing to
              contribute to the archive, either with tagging and uploading or by
              sharing your memories, please reach out.
            </p>
            <ul className="actions special">
              <li>
                <a href="#" className="button">
                  Contribute to the Archive
                </a>
              </li>
            </ul>
          </footer>
        </div>

        <Footer />
      </div>
    </App>
  );
};

export default Home;
