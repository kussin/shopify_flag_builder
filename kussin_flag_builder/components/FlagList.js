import React from 'react'
import ApolloIO from "../components/Apollo"
import { Query } from 'react-apollo'
import { Card, DataTable, Layout, Button } from '@shopify/polaris'



class FlagList extends React.Component {
    
    render() {
        
        return (
            
            <Layout>
                <Layout.Section>  
                 <Card title="Dashboard für die Flaggen">
                      <Card.Section>
                      </Card.Section>

                      <Card.Section>
                        <span style={
                            
                            {marginRight: "0px"}
                        
                        }>
                                  
                            <ApolloIO />
                        </span>
                        <Button primary>Create Flag</Button>
                      </Card.Section>
                  </Card>
                </Layout.Section>    
            </Layout>
            
        )
    }
}

export default FlagList