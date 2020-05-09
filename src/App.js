import React, { Component } from 'react';
import './App.css';
import { Header, Grid, Segment, Button, List, TextArea } from 'semantic-ui-react'
import { convertStringsToTabText, convertTabTextToStrings, handleTabEdit, tabHeight } from './tabEdit';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabText: "",
      currentStrings: [],
      editModeInsert:false,
      cursorPosition: -1,
      lineLength: 65,
      songs: []
    };

    this.handleEditModeChange = this.handleEditModeChange.bind(this);
    this.handleTabEdit = this.handleTabEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleTabEdit(event) {
    const cursorPosition = document.getElementById("tab-text").firstElementChild.selectionStart;

    this.setState({
      cursorPosition: cursorPosition
    });

    const lineLength = this.state.lineLength;
    const strings = this.state.currentStrings;
    console.log(strings);
    const editModeInsert = this.state.editModeInsert;
    const newTab = event.target.value;

    this.setState({
      currentStrings: handleTabEdit(newTab, cursorPosition, strings, lineLength, editModeInsert)
    });
  }


  handleSave(event) {
  }

  handleLoad(event) {
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
            <Segment>
              <Button.Group>
                {this.buildEditButton('Insert', this.state.editModeInsert)}
                <Button.Or />
                {this.buildEditButton('Replace', !this.state.editModeInsert)}
              </Button.Group>
            </Segment>
            <Segment id="tab-text">
              <TextArea rows={tabHeight(this.state.currentStrings, this.state.lineLength)} value={convertStringsToTabText(this.state.currentStrings, this.state.lineLength)} onChange={this.handleTabEdit}/>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  componentDidUpdate() {
    const cursorPosition = this.state.cursorPosition;
    if ( cursorPosition !== -1) {
      document.getElementById("tab-text").firstElementChild.selectionStart = cursorPosition
      document.getElementById("tab-text").firstElementChild.selectionEnd = cursorPosition
      this.setState({
        cursorPosition: -1
      });
    }
  }
}

export default App;
