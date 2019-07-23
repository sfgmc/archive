/* @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useGetContentTypes } from '../../services/api/hooks';
import { RecordList } from './RecordList';
import { Sidebar } from './Sidebar';

export const Dashboard = ({ onLogout }) => {
  const { contentTypes, error, loading } = useGetContentTypes();
  const _ = React.useState();
  return (
    <div>
      {loading && <div>Loading</div>}
      {error && <div>Error {error.message}</div>}
      {Boolean(contentTypes.length) && (
        <div>
          <Sidebar
            sections={contentTypes.map(type => ({
              name: type.name,
              path: `/dashboard/contribute/${type.name}`
            }))}
          />
          <Switch>
            {contentTypes.map(type => (
              <Route
                path={`/dashboard/contribute/${type.name}`}
                component={() => <RecordList contentType={type} />}
              />
            ))}
            <Route path="/dashboard/" component={() => <div>none</div>} />
          </Switch>
        </div>
      )}
    </div>
  );
};
