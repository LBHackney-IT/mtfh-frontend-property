import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

export const PropertyTree = (props) => {
  const {asset, childAssets, parentAssets} = props;

  const excludedTreeAssets = "656feda1-896f-b136-da84-163ee4f1be6c"

  console.log(`My details are: ${JSON.stringify(asset)}`)
  console.log(`My children details are: ${JSON.stringify(childAssets)}`)
  console.log(`My parent details are: ${JSON.stringify(asset.assetLocation.parentAssets)}`)

  const childNodes = [];

  // Add children
  if (childAssets) {
    for (const [i, v] of childAssets.entries()) {
      
       if (i < 5) {
        console.log(`Adding regular child prompt: ${JSON.stringify(v.id)}`)
        childNodes.push(generateNode(v.assetAddress.addressLine1, [], v.id))
        //childNodes.push({ title: v.assetAddress.addressLine1, children: [] })
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
  var principle = { title: 'Principle', children: [{ title: `${asset.assetAddress.addressLine1} (this asset)`, children: [...childNodes], expanded: true}], expanded: true }

  // Add parents and principle
  if (asset.assetLocation.parentAssets) {

    
    let validParents = asset.assetLocation.parentAssets.filter((el) => !excludedTreeAssets.includes(el.id)) 
    
    for (const [i, v] of validParents.entries()) {
      console.log(`Processing parents: ${i} of ${validParents.length}`)
      if (i === validParents.length - 1) {
        console.log(`Adding principle parent: ${JSON.stringify(v.id)}`)
        principle.title = <a href={`/property/${v.id}`}>{v.name}</a>;
        treeData.push(principle)
      }
      else 
      {
        console.log(`Adding parent: ${JSON.stringify(v.id)}`)
        treeData.push(generateNode(v.name, [], v.id))
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

const generateNode = (name, childList, id) => {
  let node =  <a href={`/property/${id}`}>{name}</a>

  return { title: node, children: [childList] }
}