import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CreateProjectPage from './CreateProject.jsx';

import ApolloClient from '../../../graphql/client.js';
import addProjectMutation from '../../../graphql/mutate/addProject.js';

import { getCurrentOrganization } from '../../../redux/organizations/selectors.js';
import { addProject } from '../../../redux/projects/actions.js';
import { goHome } from '../../../redux/router/actions.js';
import { projectTypeOptions } from '../helper.js'



export class CreateProject extends React.PureComponent {
  static propTypes = {
    onAddProject: PropTypes.func.isRequired,
    organization: PropTypes.object.isRequired,
  };

  state = {
    name: '',
    type: projectTypeOptions[0],
    nameError: '',
    isRequesting: false,
    error: '',
    requestError: '',
  };

  handleAddProject = async () => {
    this.setState(state => ({
      ...state,
      isRequesting: true,
      error: '',
      requestError: '',
    }));
    const { name, type } = this.state;
    try {
      const { data } = await ApolloClient.mutate({
        mutation: addProjectMutation,
        variables: {
          name,
          type: type.value,
          organizationId: this.props.organization.id,
        },
      });
      if (data.createProject) {
        this.setState(state => ({
          ...state,
          isRequesting: false,
        }));
        this.props.onAddProject(data.createProject);
      }
    } catch (error) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        this.setState(state => ({
          ...state,
          isRequesting: false,
          error: error.graphQLErrors[0].message,
          requestError: '',
        }));
      } else {
        this.setState(state => ({
          ...state,
          isRequesting: false,
          requestError: 'There was an error trying to login.',
        }));
      }
    }
  };

  handleSubmit = () => {
    if (this.state.isRequesting || this.state.error) {
      return;
    }

    let nameError = '';

    if (this.state.name.trim() === '') {
      nameError = 'You must enter a name.';
    }

    if (nameError) {
      this.setState(state => ({
        ...state,
        nameError,
        error: '',
      }));
    } else {
      this.handleAddProject();
    }
  };

  handleChangeName = event => {
    const name = event.target.value;
    this.setState(state => ({
      ...state,
      name,
      nameError: '',
      error: '',
    }));
  };

  handleChangeType = event => {
    const { value } = event;
    const type = projectOptions.find(o => o.value === value.value)
    this.setState(state => ({
      ...state,
      type,
    }));
  };

  render() {
    return (
      <CreateProjectPage
        error={this.state.error}
        requestError={this.state.requestError}
        name={this.state.name}
        type={this.state.type}
        projectTypes={projectTypeOptions}
        nameError={this.state.nameError}
        onChangeName={this.handleChangeName}
        onChangeType={this.handleChangeType}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const mapState = state => ({
  organization: getCurrentOrganization(state),
});

const mapActions = dispatch => ({
  onAddProject: project => {
    dispatch(addProject(project));
    goHome();
  },
});

export default connect(
  mapState,
  mapActions,
)(CreateProject);
