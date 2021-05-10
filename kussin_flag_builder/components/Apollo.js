import React, {useCallback, useState} from 'react';
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { Card, DataTable, Layout, Button, TextStyle, IndexTable, useIndexResourceState, ButtonGroup, TextField, FormLayout } from '@shopify/polaris'

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

    mutation ($input: CollectionInput!) {

        collectionUpdate(input: $input) {
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
  
    const [valueName, setValueName] = useState('First Flag');

    const [valueColor, setValueColor] = useState('red');

    const [valueFontColor, setValueFontColor] = useState('white');

    const [valueBorderRadius, setValueBorderRadius] = useState('0');

    const changeName = useCallback((newValue) => setValueName(newValue), []);

    const changeColor = useCallback((newValue) => setValueColor(newValue), []);

    const changeFontColor = useCallback((newValue) => setValueFontColor(newValue), []);

    const changeBorderRadius = useCallback((newValue) => setValueBorderRadius(newValue), []);
  
  return (
      <Mutation mutation={CREATE_FLAG}>
        {(createFlag, {error, dataMutation}) => {
      return(
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
            createFlag ({
                variables: { 
                    input: 
                        {
                            id: data.data.collectionByHandle.id,
                            metafields: [
                                {
                                    namespace: valueName,
                                    key: valueName,
                                    value: valueName,
                                    valueType: 'STRING',
                                    description: 'Color ' + valueColor + ' FontColor ' + valueFontColor + ' BorderRadius ' + valueBorderRadius
                                }
                            ]
                        }
                    },
            })
            window.location.reload(false)
        }}>Add</Button>

        <Button destructive onClick = {() => {
            console.log('hi')
        }}>Delete</Button>
        </ButtonGroup>
    
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField label="Name" value={valueName} onChange={changeName} />
            <TextField label="Color" value={valueColor} onChange={changeColor} />
            <TextField label="Font Color" value={valueFontColor} onChange={changeFontColor} />
            <TextField label="Border Radius in %" value={valueBorderRadius} onChange={changeBorderRadius} />
          </FormLayout.Group>
        </FormLayout>
</div>
)
}
}
</Mutation>
  )
}

class ApolloIO extends React.Component {
    
    render() {
        return (
            <Mutation mutation={CREATE_COLLECTION}>
            {(createCollection, {error, data}) => {
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
                                    createCollection()
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