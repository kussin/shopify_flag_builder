import React, {useCallback, useState} from 'react';
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { Card, DataTable, Layout, Button, Checkbox } from '@shopify/polaris'

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
            namespace: "flag",
            key: "name",
              value: "FirstFlag",
              valueType: STRING
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
        metafields(first: 10) {
          edges {
            node {
              id,
              namespace,
              key,
              value
            }
          }
        }
      }
    }
`

const renderNodes = (node, index) => 
    <div>
    <FlagCheckbox />
        <p>{node.node.id}</p>
        <p>{node.node.namespace}</p>
        <p>{node.node.key}</p>
        <p>{node.node.value}</p>
    </div>

const FlagCheckbox = () => {
    
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
    />
  )
}

const renderFlags = (data) => 
    <div>
        {data.collectionByHandle.metafields.edges.map(renderNodes)}

        <Button primary >createFlag</Button>
    </div>

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
                                      <div>
                                          {renderFlags(data)}
                                      </div>
                                  )

                            return (
                                <div>
                                    <Button primary onClick = {() => {
                                        callMutation()
                                        window.location.reload(false)
                                    }}>Add collection</Button>
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