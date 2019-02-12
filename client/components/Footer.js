import React from 'react';

import { TextInput } from 'evergreen-ui';

export const Footer = (props) => {
  return (
    <div id="footer">
      <div className="container medium">
        <header className="major last">
          <h2>Got a story? Got an edit?</h2>
        </header>

        <p>
          Let us know here if you have a story you would like to add to the archive,
          or if anything you've found here is in error.
            </p>

        <form method="post" action="#">
          <div className="row">
            <div className="col-6 col-12-mobilep">
              <TextInput name="name" placeholder="Name" />
            </div>
            <div className="col-6 col-12-mobilep">
              <TextInput name="email" placeholder="Email" />
            </div>
            <div className="col-12">
              <textarea name="message" placeholder="Message" rows="6" />
            </div>
            <div className="col-12">
              <ul className="actions special">
                <li>
                  <input type="submit" value="Send Message" />
                </li>
              </ul>
            </div>
          </div>
        </form>

        <ul className="icons">
          <li>
            <a href="#" className="icon fa-twitter">
              <span className="label">Twitter</span>
            </a>
          </li>
          <li>
            <a href="#" className="icon fa-facebook">
              <span className="label">Facebook</span>
            </a>
          </li>
          <li>
            <a href="#" className="icon fa-youtube">
              <span className="label">Youtube</span>
            </a>
          </li>
          <li>
            <a href="#" className="icon fa-github">
              <span className="label">Github</span>
            </a>
          </li>
        </ul>

        <ul className="copyright">
          <li>&copy; 2018, San Francisco Gay Men's Chorus. All rights reserved.</li>
          <li>
            Powered by Contentful
              </li>
          <li>All Materials published herein, unless otherwise specified, is published under Fair Use, for the sole
            purposes of educational, instructional, and archival backup. Copying and redistribution for any other
            purpose is strictly prohibited. If you find material within this archive that requires additional
                attribution or licensing, please let us know and we will make the needed adjustments.</li>
        </ul>
      </div>
    </div>
  )
}