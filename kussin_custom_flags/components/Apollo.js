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
        title: "flags"
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

const DELETE_FLAG = gql`

     mutation ($input: MetafieldDeleteInput!) {
        metafieldDelete(input: $input) {
          deletedId
        } 
    }
`

const SCRIPT_TAG = gql`

mutation {
    scriptTagCreate(input: {
        src: "https://cdn.jsdelivr.net/gh/kussin/shopify_flag_builder@main/kussin_flag_builder/js/flag.js",
        displayScope: ONLINE_STORE
    }) {
    scriptTag {
     id
    }
  }
}
`

const SimpleIndexTableExample = (data) => {

  const flags = data.data.collectionByHandle.metafields.edges
  
  const resourceName = {
    singular: 'flag',
    plural: 'flags',
  }

    const resourceIDResolver = (flags) => {
        return flags.node.id;
    }
  
    const {
        selectedResources,
        allResourcesSelected,
        handleSelectionChange,
    } = useIndexResourceState(flags, {resourceIDResolver})
  
    const rowMarkup = flags.map(
        (node, index) => {
            
            const [color, fontColor, borderRadius] = node.node.description.split(',') 
            
            return(
          <IndexTable.Row
            id={node.node.id}
            key={node.node.id}
            selected={selectedResources.includes(node.node.id)}
            position={index}
          >
            <IndexTable.Cell>
              <TextStyle variation="strong">{node.node.value}</TextStyle>
            </IndexTable.Cell>
            <IndexTable.Cell>{color}</IndexTable.Cell>
            <IndexTable.Cell>{fontColor}</IndexTable.Cell>
            <IndexTable.Cell>{borderRadius}</IndexTable.Cell>
          </IndexTable.Row>
        )
    }
    )
  
    const [valueName, setValueName] = useState();

    const [valueColor, setValueColor] = useState();

    const [valueFontColor, setValueFontColor] = useState();

    const [valueBorderRadius, setValueBorderRadius] = useState();

    const changeName = useCallback((newValue) => setValueName(newValue), []);

    const changeColor = useCallback((newValue) => setValueColor(newValue), []);

    const changeFontColor = useCallback((newValue) => setValueFontColor(newValue), []);

    const changeBorderRadius = useCallback((newValue) => setValueBorderRadius(newValue), []);
  
  return (
      <Mutation mutation={CREATE_FLAG}>
        {(createFlag, {error, dataMutation}) => {
      return(
      <Mutation mutation={DELETE_FLAG}>
        {(deleteFlag, {error, dataMutation}) => {
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
                                    namespace: "flags",
                                    key: valueName,
                                    value: valueName,
                                    valueType: 'STRING',
                                    description: valueColor + ',' + valueFontColor + ',' + valueBorderRadius
                                }
                            ]
                        }
                    },
            })
            setTimeout(window.location.reload(false), 1000)
        }}>Add</Button>

        <Button destructive onClick = {() => {
            if(selectedResources != []) {
                selectedResources.map((id, index) => deleteFlag({variables: {input: {id: id}}}))
                setTimeout(window.location.reload(false), 1000)
            }
        }}>Delete</Button>

        <Button onClick = {() => {
            data.data.collectionByHandle.metafields.edges.map(
                (node, index) => {
                    selectedResources.map(
                        (selected, _index) => {
                            if(node.node.id == selected) {
                                const [color, fontColor, borderRadius] = node.node.description.split(',')
                                changeName(node.node.value)
                                changeColor(color)
                                changeFontColor(fontColor)
                                changeBorderRadius(borderRadius)
                            }
                        }
                    )          
                }     
            )
        }}>Preview</Button>
        </ButtonGroup>
    
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField label="Name" value={valueName} onChange={changeName} />
            <TextField label="Color" value={valueColor} onChange={changeColor} />
            <TextField label="Font Color" value={valueFontColor} onChange={changeFontColor} />
            <TextField label="Border Radius" value={valueBorderRadius} onChange={changeBorderRadius} />
          </FormLayout.Group>
        </FormLayout>
    <div className="kussin-flag-container">
        <div className="kussin-flag" style={{
                                            background: valueColor,
                                            borderTopRightRadius: valueBorderRadius,
                                            borderBottomRightRadius: valueBorderRadius,
                                            color: valueFontColor,
                                           }}>{valueName}</div>
    </div>
</div>
)
}
}
</Mutation>
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
                                    <div>
                                    <SimpleIndexTableExample data={data} />
                                    
                                    <Mutation mutation={SCRIPT_TAG}>
                                    {(includeScript, {error, data}) => {
                                        return(
                                            <Button primary onClick = {() => {
                                                includeScript()
                                            }}>Add script</Button>
                                        )
                                    }
                                    }
                                    </Mutation>
                                    </div>
                                )

                        return (
                            <div>
                                <Button primary onClick = {() => {
                                    createCollection()
                                    setTimeout(window.location.reload(false), 500)
                                }}>Add</Button>
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