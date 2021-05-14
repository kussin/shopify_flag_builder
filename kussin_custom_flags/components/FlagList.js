import React from 'react'
import ApolloIO from "../components/Apollo"
import { Query } from 'react-apollo'
import { Card, DataTable, Layout, Button } from '@shopify/polaris'



class FlagList extends React.Component {
    
    render() {
        
        return (
            
            <Layout>
                <Layout.Section>  
                 <Card title="Dashboard">
                      <Card.Section>
                      </Card.Section>

                      <Card.Section>
                                  
                            <ApolloIO />
                      </Card.Section>
                  </Card>
                </Layout.Section>    
            </Layout>
            
        )
    }
}

export default FlagList