import React, {useCallback, useState} from 'react';
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { Card, DataTable, Layout, Button, TextStyle, IndexTable, useIndexResourceState, ButtonGroup } from '@shopify/polaris'

const hasData = (data) => 
    data != undefined

const hasCollection = (data) => 
    data.collectionByHandle != null 

const GET_COLLECTION = gql`

    query {
      collectionByHandle(handle: "flags") {
        id
      }
    }
`

const CREATE_COLLECTION = gql`

     mutation {

        collectionCreate(input: {
        title: "flags",
          metafields: [
          {
            namespace: "FirstFlag",
            key: "FirstFlag",
            value: "FirstFlag",
            valueType: STRING,
            description: "color red fontcolor white borderradius 0%"
          }
        ]
      }) {
        collection {
          id
        }
      }

    }
`

const CREATE_FLAG = gql`

    mutation {

        collectionUpdate(input: {
            id: "gid://shopify/Collection/266603528364",
            metafields: [
                {
                    namespace: "flag2",
                    key: "SecondFlag",
                    value: "SecondFlag",
                    valueType: STRING,
                    description: "color brown fontcolor white borderradius 0%"
                }
            ]
        }) {
            collection {
                id
            }
        }

    }
`

const GET_FLAGS = gql`

    query {
      collectionByHandle(handle: "flags") {
        id,
        title,
        metafields(first: 100) {
          edges {
            node {
              id,
              namespace,
              key,
              value,
              description
            }
          }
        }
      }
    }
`

const renderNodes = (node, index) => 
    <Layout>
        <Layout.Section oneThird>
            <p>{node.node.namespace}</p>
        </Layout.Section>

        <Layout.Section oneThird>
            <p>{node.node.key}</p>
        </Layout.Section>

        <Layout.Section oneThird>
            <p>{node.node.value}</p>
        </Layout.Section>
    </Layout>

const testCheck = (value) => {
    console.log(value)
}

const renderFlags = (data) => 
    <div>
        {data.collectionByHandle.metafields.edges.map(renderNodes)}

        <Button primary >Add flag</Button>
    </div>

const rows = [
    ["FirstFlag", "red", "white"],
    ["SecondFlag", "red", "white"],
    ["ThirdFlag", "red", "white"],
]

const SimpleIndexTableExample = (data) => {

  const flags = data.data.collectionByHandle.metafields.edges
  
  const resourceName = {
    singular: 'flag',
    plural: 'flags',
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(flags)

  const rowMarkup = flags.map(
    (node, index) => (
      <IndexTable.Row
        id={node.node.id}
        key={node.node.id}
        selected={selectedResources.includes(node.node.id)}
        position={index}
      >
        <IndexTable.Cell>
          <TextStyle variation="strong">{node.node.key}</TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>{node.node.key}</IndexTable.Cell>
        <IndexTable.Cell>{node.node.value}</IndexTable.Cell>
        <IndexTable.Cell>{node.node.description}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  )
  
  
  const multipleRowsMarkup = (row) => {
      
  }
  
  return (
      <div>
      <IndexTable
        resourceName={resourceName}
        itemCount={flags.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'Name'},
          {title: 'Color'},
          {title: 'Font Color'},
          {title: 'Border Radius'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
      <ButtonGroup>
        <Button primary onClick = {() => {
            console.log(selectedResources)
        }}>Add</Button>
        
        <Button destructive onClick = {() => {
            console.log(selectedResources)
        }}>Delete</Button>
        </ButtonGroup>
    </div>
  );
}

class ApolloIO extends React.Component {
    
    render() {
        return (
            <Mutation mutation={CREATE_COLLECTION}>
            {(callMutation, {error, data}) => {
                return (
                    <Query query={GET_FLAGS}>
                        {({ data, loading, error }) => {
                            if (loading) return <div>Loading…</div>
                            if (error) return <div>{error.message}</div>
                            if(hasCollection(data))
                                return (
                                    
                                    <SimpleIndexTableExample data={data} />
                                )

                        return (
                            <div>
                                <Button primary onClick = {() => {
                                    callMutation()
                                    window.location.reload(false)
                                }}>Add flag</Button>
                            </div>
                        )
                        }}
                      </Query>
                )
            }
            }
            </Mutation>
        )
    }
}

export default ApolloIO