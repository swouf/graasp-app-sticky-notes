import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { withTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { DEFAULT_MODE, TEACHER_MODES } from '../../config/settings';
import { getAppInstanceResources, getUsers } from '../../actions';

class Header extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      grow: PropTypes.string,
      logo: PropTypes.string,
    }).isRequired,
    mode: PropTypes.string,
  };

  static styles = (theme) => ({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    logo: {
      height: '48px',
      marginRight: theme.spacing.unit * 2,
    },
  });

  static defaultProps = {
    mode: DEFAULT_MODE,
  };

  handleRefresh = () => {
    const { dispatchGetAppInstanceResources, dispatchGetUsers } = this.props;
    dispatchGetAppInstanceResources();
    dispatchGetUsers();
  };

  renderViewButtons() {
    const { mode } = this.props;

    if (TEACHER_MODES.includes(mode)) {
      const buttons = [
        <IconButton onClick={this.handleRefresh} key="refresh">
          <RefreshIcon />
        </IconButton>,
      ];

      return buttons;
    }
    return null;
  }

  render() {
    const { t, classes } = this.props;
    return (
      <header>
        <AppBar position="static">
          <Toolbar>
            <Logo className={classes.logo} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {t('Sticky Notes')}
            </Typography>
            {this.renderViewButtons()}
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

const mapStateToProps = ({ context }) => ({
  appInstanceId: context.appInstanceId,
  spaceId: context.spaceId,
  mode: context.mode,
  view: context.view,
});

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchGetUsers: getUsers,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Header);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(Header.styles)(TranslatedComponent);
