import React, { Component } from 'react'
import { Card, Icon, Image, Rating } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'


class CountryCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      starred: false
    }
  }

  componentDidMount(){
    this.checkIfStarred()
  }

  handleStar = () => {
    //post to user_starred_projects here
    const userId = localStorage.userid
    const projectId = this.props.id
    const url = `http://localhost:3000/api/v1/user_starred_projects`
    const headers = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_id: userId, project_id: projectId})
    }
    fetch(url, headers)
      .then(res=>res.json())
      .then(json => {
        if(!json.error){
          this.setState({starred: true})
        }
      })
  }

  checkIfStarred = () => {
    let starred = false
    const userId = localStorage.userid
    const projectId = this.props.id
    const url = `http://localhost:3000/api/v1/check_star`
    const headers = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_id: userId, project_id: projectId})
    }
    fetch(url, headers)
    .then(res=>res.json())
    .then(json => {
        if(json["status"] === "Star"){
          starred = true
          this.setState({starred:true})
        }
    })
  }

  handleDollar = (project) => {
    this.props.handleDonate(project)
    this.props.history.push("/donate")
  }

  render(){
    return(
    <Card>
    <Image src={this.props.image} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{this.props.title}</Card.Header>
      <Card.Meta>{this.props.theme} | {this.props.country}</Card.Meta>
      <Card.Meta> <a className="org-link" href={this.props.orgUrl} target="_blank">{this.props.organization}</a></Card.Meta>
      <Card.Meta>${this.props.funding.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} / ${this.props.goal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Card.Meta>
      <Card.Description>
        {this.props.name}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a onClick={this.handleStar}>
        {this.state.starred ? <Icon className="active" name='star' /> : <Icon name='star' />}
      </a>
      <a onClick={()=>this.handleDollar(this.props)}>
        <Icon name='dollar sign' />
      </a>
    </Card.Content>
  </Card>
    )
  }
}

export default withRouter(CountryCard)
