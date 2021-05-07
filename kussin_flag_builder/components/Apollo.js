import React, {useCallback, useState} from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Card, DataTable, Layout, Button, Checkbox } from '@shopify/polaris'

const hasCollection = (data) => 
    data.collectionByHandle != null 

const GET_COLLECTION = gql`

    query {
      collectionByHandle(handle: "flags") {
        id
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

class ApolloIO extends React.Component {
    
    render() {
        return (
          <Query query={GET_COLLECTION}>
            {({ data, loading, error }) => {
              if (loading) return <div>Loading…</div>
              if (error) return <div>{error.message}</div>
              if (hasCollection(data))
                  return (
                    <Query query={GET_FLAGS}>
                        {({ data, loading, error }) => {
                          if (loading) return <div>Loading…</div>
                          if (error) return <div>{error.message}</div>
                            console.log(data)
                          return (
                              <div>
                                  {data.collectionByHandle.metafields.edges.map(renderNodes)}
                              </div>
                          )
                        }}
                      </Query>
                  )
                return (
                  <p>no Collection</p>
                )
            }}
          </Query>
        )
    }
}

export default ApolloIO