import React, { Component } from 'react'
import { Image, List, Button, Icon } from 'semantic-ui-react'

export default class DonationOptionsList extends Component {
  constructor(props){
    super(props)
  }

  handleClick = (amount) => {
    this.props.updateChosenAmount(amount)
  }

  render(){
    return(
      <List divided verticalAlign='middle'>
      {this.props.donationOptions.map((option, idx) => {
        return (<List.Item key={option.id} className="donation options">
          <List.Content className="donation amount">
          <Button onClick={() => this.handleClick(option.amount)} circular>${option.amount}</Button>
          </List.Content>
          <List.Content className="donation description">
            <List.Header> {option.description} </List.Header>
          </List.Content>
        </List.Item>)
      })}
      </List>
    )
  }
}
