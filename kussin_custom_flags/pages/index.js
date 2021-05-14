import ApolloClient from "apollo-boost";
import React, {useCallback, useState} from 'react';
import { Heading, Page, Button, Card, DataTable, AppProvider, TextField } from "@shopify/polaris"
import { ResourcePicker } from "@shopify/app-bridge-react"

import FlagList from "../components/FlagList"

function PlaceholderExample() {
  const [textFieldValue, setTextFieldValue] = useState('');

  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    [],
  );

  return (
      <div>
    <TextField
      label="Name"
      value={textFieldValue}
      onChange={handleTextFieldChange}
      placeholder="..."
    />
    
      <p>{textFieldValue}</p>
      </div>
  );
}

class Index extends React.Component {
    
    state = { open: false }

    render() {
        return (
            <Page 
                title='Kussin Flag Builder'
                primaryAction={{
                    content: 'Produkt waehlen',
                    onAction: () => this.setState({ open: true })
                }}
            >   
                
                <ResourcePicker 
                    resourceType='Product'
                    open = { this.state.open }
                    onCancel = { () => this.setState({ open: false }) }
                    onSelection= { (resources) => this.printSelection(resources) }
                />
                        
                <FlagList />
                
                
                        
            </Page>
        )
    }
    
    printSelection = (resources) => {
        const idsFromResources = resources.selection.map((product) => product.id);
        this.setState({ open: false });
        store.set('ids', idsFromResources);
    }
}

export default Index
