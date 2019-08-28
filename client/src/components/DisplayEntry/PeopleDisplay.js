import { Heading } from 'evergreen-ui';
import { Block, Col, Row } from 'jsxstyle';
import React from 'react';
import { Spacer } from '../Spacer';
import { headshot, log } from './index';
import moment from 'moment';
export const PeopleDisplay = ({ entry, fields, meta }) => {
  log('PeopleDisplay render', fields);
  // const { file: headshot } = useFile(fields.headshot);
  log('headshot', headshot);
  return (
    <Row>
      <Col alignItems="center" justifyContent="center" flexShrink={0}>
        <Block
          width={200}
          height={200}
          backgroundColor="#ddd"
          borderRadius={5}
          backgroundImage={`url(${headshot.url ||
            '/static/images/generic-profile.svg'})`}
          backgroundSize={fields.headshot ? 'cover' : '75%'}
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        />
      </Col>
      <Spacer size={18} />
      <Col flexShrink={0} flex={1}>
        <Heading size={600}>{fields.name}</Heading>
        <Block flex={1} />
        <Row justifyContent="space-between">
          <Block>Status:</Block>
          <Block>{fields.status}</Block>
        </Row>
        {fields.dateOfJoin && (
          <Row justifyContent="space-between">
            <Block>Date of Join: </Block>
            <Block>{moment(fields.dateOfJoin).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {fields.dateOfLeave && (
          <Row justifyContent="space-between">
            <Block>Date of Leave: </Block>
            <Block>{moment(fields.dateOfLeave).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {fields.dateOfDeath && (
          <Row justifyContent="space-between">
            <Block>Date of Death: </Block>
            <Block>{moment(fields.dateOfDeath).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {fields.barObituaryLink && (
          <Row justifyContent="space-between">
            <Block>
              <a target="_blank" href={fields.barObituaryLink}>
                BAR Obituary
              </a>
            </Block>
          </Row>
        )}
        {fields.isFifthSection && fields.chorusNumber && (
          <Row justifyContent="space-between">
            <Block>Chorus Number: </Block>
            <Block>{fields.chorusNumber}</Block>
          </Row>
        )}
        <Row />
      </Col>
      <Spacer />
    </Row>
  );
};
