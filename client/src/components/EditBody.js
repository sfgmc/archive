import React from "react";

import { Block, Col, Row } from "jsxstyle";
import * as moment from "moment";
import {
  Alert,
  Icon,
  Popover,
  Menu,
  Position,
  toaster,
  Tooltip,
  Heading,
  TextInput,
  Switch
} from "evergreen-ui";
import { Badge } from "../components/Badge";
import { Pin } from "../components/Pin";
import { Spacer } from "../components/Spacer";
import { Card } from "../components/Card";

const resolvefield = (fieldName, field) => {
  let element;
  switch (fieldName) {
    case "alumni":
      return (
        <Row flex={1}>
          {field.map(alumni => (
            <Card isInDialog entry={alumni} onClick={() => null} />
          ))}
        </Row>
      );
    case "locations":
      return (
        <Row flex={1}>
          {field.map(location => (
            <Card isInDialog entry={location} onClick={() => null} />
          ))}
        </Row>
      );
    case "stories":
      return (
        <Row flex={1}>
          {field.map(story => (
            <Card isInDialog entry={story} onClick={() => null} />
          ))}
        </Row>
      );
  }
  switch (typeof field) {
    case "string":
      return <TextInput onChange={value => console.log(value)} value={field} />;
    case "boolean":
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
    fieldName === "meta" ||
    fieldName === "contentType" ||
    fieldName === "hasBeenProcessed" ||
    fieldName === "md5sum" ||
    fieldName === "shouldFilterOut"
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
