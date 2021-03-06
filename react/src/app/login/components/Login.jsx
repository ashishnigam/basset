import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Button, Form, FormField, Text } from 'grommet';
import { Alert } from 'grommet-icons';

import Link from '../../../components/Link/Link.jsx';
import Logo from '../../../components/Logo/Logo.jsx';
import Notification from '../../../components/Notification/Notification.jsx';
import GithubLogin from '../../../components/LoginButtons/GithubLogin.jsx';
import BitbucketLogin from '../../../components/LoginButtons/BitbucketLogin.jsx';
import GitLabLogin from '../../../components/LoginButtons/GitLabLogin.jsx';
import SamlLogin from '../../../components/LoginButtons/SamlLogin.jsx';

const LogoContainer = styled(Box)`
  min-height: 64px;
  min-width: 64px;
`;
const BoxContainer = styled(Box)`
  min-height: 328px;
`;

export default class LoginPage extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string.isRequired,
    redirect: PropTypes.string,
    email: PropTypes.string.isRequired,
    emailError: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    passwordError: PropTypes.string.isRequired,
    onChangeEmail: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    requestError: PropTypes.string.isRequired,
  };

  static defaultProps = {
    redirect: null,
  };

  renderError = () => (
    <Box
      direction="row"
      align="center"
      gap="small"
      margin={{ vertical: 'medium' }}
    >
      <Alert color="status-critical" />
      <Text data-test-id="login-error" color="status-critical">
        {this.props.error}
      </Text>
    </Box>
  );

  renderRequestError = () => (
    <Notification type="error" message="There was an error trying to login." />
  );

  render() {
    return (
      <Box basis="80%" direction="column" align="center" justify="center" style={{minHeight: '100%'}}>
        {this.props.requestError && this.renderRequestError()}
        <LogoContainer margin="medium">
          <Logo size="64px" />
        </LogoContainer>
        <BoxContainer
          elevation="small"
          width="medium"
          pad="medium"
          gap="medium"
          justify="center"
          margin={{bottom: 'medium'}}
        >
          <Form onSubmit={this.props.onSubmit}>
            <FormField
              data-test-id="test-email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={this.props.email}
              onChange={this.props.onChangeEmail}
              error={this.props.emailError}
            />
            <FormField
              data-test-id="test-password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={this.props.password}
              onChange={this.props.onChangePassword}
              error={this.props.passwordError}
            />
            <Box
              direction="row"
              align="center"
              justify="between"
              margin={{ top: 'medium' }}
            >
              <Link href="/forgot/" label="Forgot Password" />
              <Button
                data-test-id="test-submit"
                type="submit"
                label="Login"
                primary
              />
            </Box>
            {this.props.error && this.renderError()}
          </Form>
          <Link alignSelf="center" href="/signup/" label="Sign up" />
          <Box gap="small">
            <GithubLogin
              label="Login with GitHub"
              redirect={this.props.redirect}
            />
            <BitbucketLogin
              label="Login with Bitbucket"
              redirect={this.props.redirect}
            />
            <GitLabLogin
              label="Login with GitLab"
              redirect={this.props.redirect}
            />
            <SamlLogin
              label="Login with SAML"
              redirect={this.props.redirect}
            />
          </Box>
          <Box pad={{top: 'small'}}>
            <Text>
              By logging in you are agreeing to our <a rel="noopener noreferrer" target="_blank" href="https://basset.io/terms">Terms of Service</a> and <a rel="noopener noreferrer" target="_blank" href="https://basset.io/privacy-policy">Privacy Policy</a>
            </Text>
          </Box>
        </BoxContainer>
      </Box>
    );
  }
}
