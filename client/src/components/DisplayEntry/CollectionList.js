import { SidebarTab } from 'evergreen-ui';
import { Block } from 'jsxstyle';
import React, { Fragment } from 'react';
import { Spacer } from '../Spacer';
import { TabCol } from './index';
export const CollectionList = ({
  collections,
  onCollectionSelect,
  currentId
}) => {
  console.log('CollectionList', { collections });
  return (
    <Fragment>
      <TabCol height="100%" width={200} padding={4} overflowY="auto">
        <SidebarTab
          display="block"
          key="CollectionTitle"
          id="CollectionTitle"
          aria-controls={`panel-collectiontitle`}
          pointerEvents="none"
        >
          <Block
            fontSize={15}
            fontWeight="bold"
            whiteSpace="nowrap"
            width="100%"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Collections
          </Block>
        </SidebarTab>
        {collections.map(collection => (
          <Fragment>
            <SidebarTab
              display="block"
              key={collection.sys.id}
              id={collection.sys.id}
              aria-controls={`panel-${collection.sys.id}`}
              pointerEvents="none"
            >
              <Block
                fontWeight="bold"
                whiteSpace="nowrap"
                width="100%"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {collection.title}
              </Block>
            </SidebarTab>
            {collection.children.map(child => (
              <SidebarTab
                width="100%"
                key={child.sys.id}
                id={child.sys.id}
                onSelect={() => onCollectionSelect(child.sys.id)}
                isSelected={child.sys.id === currentId}
                aria-controls={`panel-${child.sys.id}`}
                pointerEvents={child.sys.id === currentId ? 'none' : undefined}
              >
                <Block
                  whiteSpace="nowrap"
                  width="100%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  padding={4}
                >
                  {child.fields.title}
                </Block>
              </SidebarTab>
            ))}
          </Fragment>
        ))}
      </TabCol>
      <Spacer />
    </Fragment>
  );
};
