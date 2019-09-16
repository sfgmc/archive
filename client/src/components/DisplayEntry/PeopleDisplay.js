import { Heading } from 'evergreen-ui';
import { Block, Col, Row } from 'jsxstyle';
import moment from 'moment';
import React from 'react';
import genericProfilePic from '../../images/generic-profile.svg';
import { Spacer } from '../Spacer';
export const PeopleDisplay = ({ entry, meta }) => {
  console.log('PeopleDisplay render', entry);
  // const { file: headshot } = useFile(entry.headshot);
  // console.log('headshot', headshot);
  return (
    <Row>
      <Col alignItems="center" justifyContent="center" flexShrink={0}>
        <Block
          width={200}
          height={200}
          backgroundColor="#ddd"
          borderRadius={5}
          backgroundImage={`url(${(entry.headshot && entry.headshot.url) ||
            genericProfilePic})`}
          backgroundSize={entry.headshot ? 'cover' : '75%'}
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        />
      </Col>
      <Spacer size={18} />
      <Col flexShrink={0} flex={1}>
        <Heading size={600}>{entry.name}</Heading>
        <Block flex={1} />
        <Row justifyContent="space-between">
          <Block>Status:</Block>
          <Block>{entry.status}</Block>
        </Row>
        {entry.dateOfJoin && (
          <Row justifyContent="space-between">
            <Block>Date of Join: </Block>
            <Block>{moment(entry.dateOfJoin).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {entry.dateOfLeave && (
          <Row justifyContent="space-between">
            <Block>Date of Leave: </Block>
            <Block>{moment(entry.dateOfLeave).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {entry.dateOfDeath && (
          <Row justifyContent="space-between">
            <Block>Date of Death: </Block>
            <Block>{moment(entry.dateOfDeath).format('MMMM YYYY')}</Block>
          </Row>
        )}
        {entry.barObituaryLink && (
          <Row justifyContent="space-between">
            <Block>
              <a target="_blank" href={entry.barObituaryLink}>
                BAR Obituary
              </a>
            </Block>
          </Row>
        )}
        {entry.isFifthSection && entry.chorusNumber && (
          <Row justifyContent="space-between">
            <Block>Chorus Number: </Block>
            <Block>{entry.chorusNumber}</Block>
          </Row>
        )}
        <Row />
      </Col>
      <Spacer />
    </Row>
  );
};
