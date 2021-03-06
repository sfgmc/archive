import { Heading, Switch, TextInput } from 'evergreen-ui';
// Look into ag-grid for the actual table
//github.com/ag-grid/ag-grid
import { Col, Row } from 'jsxstyle';
import React from 'react';
import { Spacer } from '../components/Spacer';
import { DisplayCard } from './DisplayCard';

const resolvefield = (fieldName, field) => {
  let element;
  switch (fieldName) {
    case 'alumni':
      return (
        <Row flex={1}>
          {field.map(alumni => (
            <DisplayCard isInDialog entry={alumni} onClick={() => null} />
          ))}
        </Row>
      );
    case 'locations':
      return (
        <Row flex={1}>
          {field.map(location => (
            <DisplayCard isInDialog entry={location} onClick={() => null} />
          ))}
        </Row>
      );
    case 'stories':
      return (
        <Row flex={1}>
          {field.map(story => (
            <DisplayCard isInDialog entry={story} onClick={() => null} />
          ))}
        </Row>
      );
  }
  switch (typeof field) {
    case 'string':
      return <TextInput onChange={value => console.log(value)} value={field} />;
    case 'boolean':
      return (
        <Switch
          marginBottom={16}
          checked={field}
          onChange={value => console.log(value)}
        />
      );
    default:
      return JSON.stringify(field);
  }

  return element;
};

const shouldNullField = fieldName => {
  return (
    fieldName === 'meta' ||
    fieldName === 'contentType' ||
    fieldName === 'hasBeenProcessed' ||
    fieldName === 'md5sum' ||
    fieldName === 'shouldFilterOut'
  );
};

export const EditBody = ({ entry, exitEntryMode }) => {
  return (
    <Col
      width="100%"
      minHeight={50}
      background="rgba(200,200,0,0.25)"
      border="solid dashed #eee"
      borderRadius={5}
    >
      <Heading>EDIT MODE</Heading>
      {Object.keys(entry).map(fieldName =>
        shouldNullField(fieldName) ? null : (
          <Row>
            {fieldName}:
            <Spacer />
            {resolvefield(fieldName, entry[fieldName])}
            {}
          </Row>
        )
      )}
    </Col>
  );
};
