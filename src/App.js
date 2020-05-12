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
      insertMode:false,
      cursorPosition: -1,
      lineLength: 6,
      songs: []
    };

    this.handleEditModeChange = this.handleEditModeChange.bind(this);
    this.handleTabEdit = this.handleTabEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleTabEdit(event) {
    const cursorPosition = document.getElementById("tab-text").firstElementChild.selectionStart;
    const lineLength = this.state.lineLength;
    const strings = this.state.currentStrings;
    const insertMode = this.state.insertMode;
    const newTab = event.target.value;

    const { newStrings, newCursor } = handleTabEdit(convertTabTextToStrings(newTab), strings, cursorPosition, lineLength, insertMode)

    this.setState({
      currentStrings: newStrings,
      cursorPosition: newCursor
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
    this.setState({insertMode: !this.state.insertMode});
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
                {this.buildEditButton('Insert', this.state.insertMode)}
                <Button.Or />
                {this.buildEditButton('Replace', !this.state.insertMode)}
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
    let {cursorPosition, lineLength} = this.state;
    if ( cursorPosition !== -1) {
      const textArea = document.getElementById("tab-text").firstElementChild;

      if (cursorPosition > textArea.value.length) {
        cursorPosition -= (lineLength + 1) * 6 + 1 - lineLength
      }

      textArea.selectionStart = cursorPosition
      textArea.selectionEnd = cursorPosition
      this.setState({
        cursorPosition: -1
      });
    }
  }
}

export default App;
