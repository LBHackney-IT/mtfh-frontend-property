import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
 
export default class Tree extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      treeData: [{ title: 'src/', children: [{ title: 'index.js' }] }],
    };
  }
 
  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          theme={FileExplorerTheme}
        />
      </div>
    );
  }
}