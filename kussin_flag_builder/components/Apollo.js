import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Card, DataTable, Layout, Button } from '@shopify/polaris'

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
    <p>{node.node.key}</p>

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
                            <Card>
                              {data.collectionByHandle.metafields.edges.map(renderNodes)}
                            </Card>
                          )
                        }}
                      </Query>
                  )
                return (
                    <Card>
                      <p>no Collection</p>
                    </Card>
                )
            }}
          </Query>
        )
    }
}

export default ApolloIO