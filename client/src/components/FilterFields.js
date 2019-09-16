import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
// import { useArchiveStore, availableFilterTypes } from '../lib/ArchiveStore';
import {
  Button,
  Heading,
  Icon,
  IconButton,
  SelectMenu,
  Switch
} from 'evergreen-ui';
import { Block, Col, Row } from 'jsxstyle';
import { cloneDeep, filter as lodashFilter, reject } from 'lodash';
import moment from 'moment';
import React, { Fragment, useReducer, useState } from 'react';
import './FilterFields.css';
import { Spacer } from './Spacer';

const omitType = null;
const contentTypes = null;
const tags = null;

const defaultForm = {};
const reducer = (state, action) => ({ ...state, [action.field]: action.value });
const removeItem = (items, i) =>
  items.slice(0, i).concat(items.slice(i + 1, items.length));

const blacklists = {
  fields: [
    'snaps',
    'md5sum',
    'isAdminEntry',
    'alumniLocations',
    'externalUrl',
    'file',
    'date',
    'hasBeenProcessed',
    'title',
    'name',
    'locationName',
    'geolocation',
    'barObituaryLink',
    'headshot',
    'stories',
    'media'
  ],
  contentTypes: ['tags', 'suggestedEdits', 'collection'],
  tags: []
};

export const availableFilterTypes = {
  contentTypes: 'Content Types',
  tags: 'Tags',
  shouldIncludeAdmin: 'Admin Entries',
  dateRange: 'Date Range'
};

const Text = props => <Heading size={100} {...props} />;

/* <DateRangePicker
            value={archive.settings.filterByDateRange}
            onChange={results => {
              archive.settings.setFilterByDateRange(results);
              archive.methods.retrieveResults();
            }}
            disabled={!archive.settings.shouldFilterByDate}
          /> */

const FilterField = ({
  filter,
  onRemove,
  onSave,
  filterLists,
  isFirst,
  omitType = {}
}) => {
  let [isEditing, setIsEditing] = useState(false);
  const [filterForm, dispatch] = useReducer(reducer, defaultForm);
  if (filter.isEditing) {
    isEditing = true;
  }
  const filterType = filterForm.type || filter.type;
  const filterValue = filterForm.hasOwnProperty('value')
    ? filterForm.value
    : filter.value;
  const fieldsList = omitType.contentTypes
    ? (
        lodashFilter(
          filterLists.contentTypes,
          type => type.sys.id === omitType.contentTypes
        )[0] || {}
      ).fields || []
    : [];
  const optionsForTypeDropdown = reject(
    [
      ...Object.keys(availableFilterTypes),
      ...(Boolean(omitType.contentTypes)
        ? fieldsList.map(field => ({ id: field.id, name: field.name }))
        : [])
    ],
    key =>
      !!key.id
        ? blacklists.fields.includes(key.id)
        : typeof availableFilterTypes[key] !== 'string' ||
          Boolean(omitType[key])
  );

  return (
    <Row width="100%" alignItems="center">
      {isFirst && <Text>Filter By</Text>}
      {!isFirst && <Text>AND</Text>}
      {!isEditing && (
        <Fragment>
          <Spacer size="xxs" />
          {filterType === 'contentTypes' && (
            <Text>
              {
                lodashFilter(
                  filterLists.contentTypes,
                  c => c.sys.id === filterValue
                )[0].name
              }{' '}
              in Content Types
            </Text>
          )}
          {filterType === 'tags' && (
            <Text>
              {
                lodashFilter(filterLists.tags, t => t.sys.id === filterValue)[0]
                  .fields.label
              }{' '}
              in Tags
            </Text>
          )}
          {filterType === 'dateRange' && (
            <Text>
              Dates: {moment(filterValue[0]).format('MMM YYYY')} to{' '}
              {moment(filterValue[1]).format('MMM YYYY')}
            </Text>
          )}
          {filterType === 'shouldIncludeAdmin' && (
            <Text>
              {filterValue && 'including admin entries'}
              {!filterValue && 'excluding admin entries'}
            </Text>
          )}
          <Block flex={1} />
          <IconButton
            appearance="minimal"
            icon="edit"
            onClick={() => setIsEditing(true)}
          />
        </Fragment>
      )}
      {isEditing && (
        <Fragment>
          <Spacer />
          <SelectMenu
            title="Select type of filter"
            options={optionsForTypeDropdown.map(key => {
              if (key.id) {
                return { label: key.name, value: key.id };
              }

              return { label: availableFilterTypes[key], value: key };
            })}
            selected={filterType}
            onSelect={item => dispatch({ field: 'type', value: item.value })}
          >
            <Button>
              {filterType
                ? availableFilterTypes[filterType]
                : 'Select type of filter...'}
            </Button>
          </SelectMenu>
          {filterType === 'contentTypes' && (
            <Fragment>
              <Spacer />
              <SelectMenu
                title="Select type of content"
                options={reject(filterLists.contentTypes, contentType =>
                  blacklists.contentTypes.includes(contentType.sys.id)
                ).map(contentType => {
                  return { label: contentType.name, value: contentType.sys.id };
                })}
                selected={filterValue}
                onSelect={item =>
                  dispatch({ field: 'value', value: item.value })
                }
              >
                <Button flex={1}>
                  {filterValue
                    ? lodashFilter(
                        filterLists.contentTypes,
                        c => c.sys.id === filterValue
                      )[0].name
                    : 'Select type of content...'}
                </Button>
              </SelectMenu>
            </Fragment>
          )}
          {filterType === 'tags' && (
            <Fragment>
              <Spacer />
              <SelectMenu
                title="Select tag to filter by"
                options={reject(filterLists.tags, tag =>
                  blacklists.tags.includes(tag.sys.id)
                ).map(tag => {
                  return { label: tag.fields.label, value: tag.sys.id };
                })}
                selected={filterValue}
                onSelect={item =>
                  dispatch({ field: 'value', value: item.value })
                }
              >
                <Button flex={1}>
                  {filterValue
                    ? lodashFilter(
                        filterLists.tags,
                        t => t.sys.id === filterValue
                      )[0].fields.label
                    : 'Select tag to filter by...'}
                </Button>
              </SelectMenu>
            </Fragment>
          )}
          {filterType === 'dateRange' && (
            <Fragment>
              <Spacer />
              <DateRangePicker
                value={filterValue}
                maxDetail="year"
                minDetail="century"
                format="MM Y"
                showNeighboringMonth
                calendarIcon={<Icon icon="calendar" color="rgb(7, 136, 222)" />}
                clearIcon={<Icon icon="remove" color="rgb(234, 53, 48)" />}
                onChange={results => {
                  dispatch({ field: 'value', value: results });
                }}
              />
              <Block flex={1} />
            </Fragment>
          )}
          {filterType === 'shouldIncludeAdmin' && (
            <Fragment>
              <Spacer />
              <Text>Include Admin Entries?</Text>
              <Spacer size="xs" />
              <Switch
                height={24}
                checked={filterValue}
                onChange={e => {
                  dispatch({ field: 'value', value: e.target.checked });
                }}
              />
              <Block flex={1} />
            </Fragment>
          )}
          {!filterType && <Block flex={1} />}
          {(filterForm.hasOwnProperty('value') || filter.value) && (
            <IconButton
              appearance="minimal"
              icon="floppy-disk"
              intent="primary"
              onClick={() => {
                setIsEditing(false);
                onSave(filterForm);
              }}
            />
          )}
        </Fragment>
      )}
      <IconButton
        appearance="minimal"
        icon="trash"
        intent="danger"
        onClick={onRemove}
      />
    </Row>
  );
};
export const FilterFields = ({
  filters = [],
  filterLists = { contentTypes: [], tags: [] },
  onFilterAdd = filters => null,
  onFilterRemove = filters => null
}) => {
  const [counter, setCounter] = useState(0);

  return (
    <Col width="100%">
      {!filters.length && (
        <Fragment>
          <Row>
            <Text>No Filters Selected.</Text>
          </Row>
          <Spacer size="xs" />
        </Fragment>
      )}
      {filters.map((filter, index) => (
        <Fragment>
          <FilterField
            key={filter.id}
            isFirst={index === 0}
            filterLists={filterLists}
            filter={filter}
            onRemove={() => {
              let newFilters = cloneDeep(filters);
              newFilters = removeItem(newFilters, index);
              onFilterRemove(newFilters);
            }}
            onSave={filter => {
              const newFilters = cloneDeep(filters);
              newFilters[index] = {
                ...newFilters[index],
                ...filter
              };
              if (newFilters[index].isEditing) {
                delete newFilters[index].isEditing;
              }
              onFilterAdd(newFilters);
            }}
          />
          <Spacer size="xxs" />
        </Fragment>
      ))}
      <Spacer size="xxs" />
      <Row
        props={{
          onClick: () => {
            const newFilters = cloneDeep(filters);
            newFilters.push({ isEditing: true, id: counter });
            setCounter(counter + 1);
            onFilterAdd(newFilters);
          }
        }}
      >
        <Button intent="success" height={24} flex={1} iconBefore="plus">
          Add New Filter
        </Button>
      </Row>
    </Col>
  );
};
