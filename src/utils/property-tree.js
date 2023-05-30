import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import 'react-sortable-tree/style.css';

export const PropertyTree = (props) => {
  const {asset, childAssets} = props;

  console.log(`My details are: ${JSON.stringify(asset)}`)
  console.log(`My children details are: ${JSON.stringify(childAssets)}`)

  const childNodes = [];

  // Add children
  if (childAssets) {
    for (const [i, v] of childAssets.entries()) {
      console.log(`Adding child: ${JSON.stringify(v.id)}`)
       if (i < 5) {
        console.log(`Adding regular child prompt: ${JSON.stringify(v.id)}`)
        childNodes.push({ title: v.assetAddress.addressLine1, children: [] })
        continue;
      }
      if (i === 5) {
        console.log(`Adding MORE prompt: ${JSON.stringify(v.id)}`)
        childNodes.push({ title: '<< MORE.... >>', children: [] })
        continue;
      }
      if (i > 5) {
        console.log(`Too many children, not adding prompt: ${JSON.stringify(v.id)}`)
        continue;
      }
    }
  }

  const treeData = [];

  //Generate me
  var principle = { title: 'Principle', children: [{ title: asset.assetAddress.addressLine1, children: [...childNodes], expanded: true}], expanded: true }

  // Add parents and principle
  if (asset?.parentAssetIds) {
    var parents = asset?.parentAssetIds.split('#')
    for (const [i, v] of parents.entries()) {
      if (i === parents.length - 1) {
        console.log(`Adding final: ${JSON.stringify(v)}`)
        principle.title = v;
        treeData.push(principle)
      }
      else 
      {
        console.log(`Adding parent: ${JSON.stringify(v)}`)
        treeData.push({ title: v, children: [] })
      }
    }
  }

  const onChangeHander = (e) => {
    console.log(e)
  }
    return (
      <div style={{ height: 800 }}> 
        <SortableTree
          treeData={treeData}
          onChange={onChangeHander}
          //theme={FileExplorerTheme}
        />
      </div>
    ); 
}

const generateNode = (name, childList) => {
  return { title: name, children: [childList]  }
}