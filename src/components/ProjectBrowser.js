import React, { Component } from 'react';
import { Grid, Dropdown, Header, Icon, Loader } from 'semantic-ui-react';
import '../App.css';
import CountryCard from './CountryCard.js';
import ThemesDropdownMultiple from './ThemesDropdownMultiple';
import Navbar from './Navbar.js';
import Footer from './Footer';
import { withRouter } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import config from 'react-global-configuration';

class ProjectBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      selectedCountry: this.props.appSelectedCountry,
      projectThemes: this.props.userThemes,
      countryProjects: [],
      themesUpdated: false,
      countryUpdated: this.props.updatedSelectedCountry,
    };
  }

  componentDidMount() {
    this.fetchCountries();
    this.fetchThemeProjects();
    scroll.scrollTo(200);
  }

  componentDidUpdate() {
    scroll.scrollTo(200);
  }

  setSelectedCountry = () => {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.countryCode
    ) {
      if (this.state.selectedCountry === '') {
        this.setState(
          { selectedCountry: this.props.location.state.countryCode },
          this.fetchThemeProjects
        );
      }
    }
  };

  fetchCountries = () => {
    const url = `${config.get('API_URL')}/api/v1/countries`;
    const getCountryISO2 = require('country-iso-3-to-2');
    let countryArray = [];
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        json.forEach((country, idx) => {
          let iso2 = getCountryISO2(country.iso3166CountryCode);
          if (iso2 && country.name) {
            countryArray.push({
              key: iso2.toLowerCase(),
              value: country.iso3166CountryCode,
              flag: iso2.toLowerCase(),
              text: country.name,
            });
          }
        });
        const sortJsonArray = require('sort-json-array');
        if (
          this.props.location &&
          this.props.location.state &&
          this.props.location.state.countryCode
        ) {
          // if(this.state.selectedCountry === ""){
          this.setState(
            {
              countryList: sortJsonArray(countryArray, 'text'),
            },
            this.setSelectedCountry
          );
          // }
        } else {
          this.setState({ countryList: sortJsonArray(countryArray, 'text') });
        }
      });
  };

  fetchProjects = () => {
    const countryCode = this.state.selectedCountry;
    const url = `${config.get(
      'API_URL'
    )}/api/v1/get_projects?countryCode=${countryCode}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ countryProjects: json });
      });
  };

  fetchThemeProjects = () => {
    const countryCode = this.state.selectedCountry;
    // const [theme1, theme2, theme3, theme4, theme5, theme6, theme7, theme8, theme9, theme10, theme11, theme12, theme13, theme14, theme15, theme16, theme17, theme18] = this.state.projectThemes
    const url = `${config.get('API_URL')}/api/v1/get_theme_projects`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        themes: this.state.projectThemes,
        countryCode: countryCode,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState(
          {
            countryProjects: json,
          },
          this.setState({ themesUpdated: true })
        );
      });
  };

  handleChange = (ev, data) => {
    this.setState({ selectedCountry: data.value }, this.fetchThemeProjects);
  };

  // logout = () => {
  //   localStorage.setItem('userid', '')
  //   localStorage.setItem('jwt', '')
  //   localStorage.setItem('username', '')
  //   localStorage.setItem('email_address', '')
  //   localStorage.setItem('first_name', '')
  //   localStorage.setItem('last_name', '')
  //   this.props.history.push("/")
  //   return false
  // }

  updateProjectThemes = (themes) => {
    this.props.updateAppThemes(themes);
    this.setState({ projectThemes: themes }, this.fetchThemeProjects);
  };

  render() {
    return (
      <div className='app-div'>
        <Navbar activeItem='projects' logout={this.props.logout} />
        <div className='header-under-nav'>
          <Header as='h2' icon textAlign='center'>
            <Icon name='tasks' circular />
          </Header>
        </div>
        <Grid>
          <Grid.Row className='project-dropdown-row' columns={2}>
            <Grid.Column>
              <Header as='h3' textAlign='center'>
                <Header.Content>Country</Header.Content>
              </Header>
              <Dropdown
                className='country-drop'
                fluid
                search
                selection
                placeholder='Country'
                fetchThemeProjects={this.fetchThemeProjects}
                onProjectBrowser={true}
                options={this.state.countryList}
                onChange={this.handleChange}
                value={this.state.selectedCountry}
              />
            </Grid.Column>
            <Grid.Column className='theme-dropdown-div'>
              <Header as='h3' textAlign='center'>
                <Header.Content>Themes</Header.Content>
              </Header>
              <ThemesDropdownMultiple
                updateMapThemes={this.updateProjectThemes}
                themes={this.props.themes}
                mapThemes={this.state.projectThemes}
              />
            </Grid.Column>
          </Grid.Row>
          {this.state.themesUpdated && !this.state.countryProjects['error'] ? (
            <Grid>
              {/* made another grid and created a new row with only one column for mobile */}
              <Grid.Row className='card-row' columns={1} only='mobile'>
                {this.state.countryProjects.map((project) => {
                  return (
                    <div className='column card-div'>
                      {' '}
                      <CountryCard
                        id={project.id}
                        projectLink={project.project_link}
                        handleDonate={this.props.handleDonate}
                        orgUrl={project.organization.url}
                        organization={project.organization.name}
                        funding={project.funding}
                        longTermImpact={project.long_term_impact}
                        activities={project.activities}
                        summary={project.summary}
                        goal={project.goal}
                        key={project.id}
                        image={project.image_url}
                        theme={project.theme.name}
                        title={project.title}
                        country={project.country.name}
                      />
                    </div>
                  );
                })}
              </Grid.Row>
              <Grid.Row className='card-row' columns={4} only='computer tablet'>
                {this.state.countryProjects.map((project) => {
                  return (
                    <div className='column card-div'>
                      {' '}
                      <CountryCard
                        id={project.id}
                        projectLink={project.project_link}
                        handleDonate={this.props.handleDonate}
                        orgUrl={project.organization.url}
                        organization={project.organization.name}
                        funding={project.funding}
                        longTermImpact={project.long_term_impact}
                        activities={project.activities}
                        summary={project.summary}
                        goal={project.goal}
                        key={project.id}
                        image={project.image_url}
                        theme={project.theme.name}
                        title={project.title}
                        country={project.country.name}
                      />
                    </div>
                  );
                })}
              </Grid.Row>
            </Grid>
          ) : (
            <Loader active inline='centered' />
          )}
        </Grid>
        <div id='footer-div'>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectBrowser);
