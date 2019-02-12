import { Fragment } from 'react';

import { Dialog } from 'evergreen-ui';
import Component from '@reactions/component'
import { Card } from '../components/Card';
import { EntryBody } from '../components/EntryBody';
import {
  normalizeEntry,
} from '../lib/searchState';

export const Entry = ({ entry, open, clearInitial, setInitial }) => {
  // For rich text rendering api info: https://www.contentful.com/developers/docs/tutorials/general/getting-started-with-rich-text-field-type/
  entry = normalizeEntry(entry)

  return (
    <Component initialState={{ isShown: !!open }}>
      {({ state, setState }) => (
        <Fragment>
          <Dialog
            isShown={state.isShown}
            title={entry.locationName || entry.name || entry.title}
            onCloseComplete={() => {
              setState({ isShown: false })
              clearInitial()
            }}
            hasFooter={false}
          >
            <EntryBody
              entry={entry}
              closeEntry={async () => {
                setState({ isShown: false })
                await clearInitial()
              }}
              setInitial={setInitial}
            />
          </Dialog>
          {!open && <Card entry={entry} onClick={(e) => setState({ isShown: true })} />}
        </Fragment>
      )}
    </Component>
  )
}