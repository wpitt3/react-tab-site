import React, { Component } from 'react';
import './App.css';
import { Header, Grid, Segment, Button, List, TextArea } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabText: "",
      editModeInsert:false,
      songs: []
    };

    this.handleEditModeChange = this.handleEditModeChange.bind(this);
  }

  buildEditButton(name, positive) {
    if (positive) {
      return ( <Button positive >{name}</Button>)
    } else {
      return ( <Button onClick={this.handleEditModeChange}>{name}</Button>)
    }
  }

  handleEditModeChange(event) {
    this.setState({editModeInsert: !this.state.editModeInsert});
  }

  render() {
    return (
      <div className="App">
        <Grid container columns={1} stackable>
          <Header as='h1'>React Tab Editor </Header>
          <Grid.Column>
            <Segment className="action-buttons">
            <List link className="tab-links">
            </List>
            <Button.Group>
               <Button content='Save' onClick={this.handleSave}/>
               <Button content='Load' onClick={this.handleLoad}/>
              </Button.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <Button.Group>
                {this.buildEditButton('Insert', this.state.editModeInsert)}
                <Button.Or />
                {this.buildEditButton('Replace', !this.state.editModeInsert)}
              </Button.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment id="tab-text">
              <TextArea autoHeight />
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
