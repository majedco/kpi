import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';
import Dropzone from '../libs/dropzone';
import Select from 'react-select';
import mdl from '../libs/rest_framework/material';

import {dataInterface} from '../dataInterface';
import actions from '../actions';
import stores from '../stores';
import bem from '../bem';
import searches from '../searches';
import ui from '../ui';
import mixins from '../mixins';

import LibrarySidebar from '../components/librarySidebar';

import {
  t,
  assign,
  getAnonymousUserPermission,
  anonUsername,
  supportUrl
} from '../utils';

import SidebarFormsList from '../lists/sidebarForms';

var leaveBetaUrl = stores.pageState.leaveBetaUrl;

var FormSidebar = React.createClass({
  mixins: [
    searches.common,
    mixins.droppable,
    Reflux.connect(stores.session, 'session'),
    Reflux.connect(stores.pageState, 'pageState')
  ],
  componentDidMount () {
    this.searchDefault();
  },
  getInitialState () {
    return assign({
      currentAssetId: false
    }, stores.pageState.state);
  },
  componentWillMount() {
    this.setStates();
  },
  setStates() {
    this.setState({
      headerFilters: 'forms',
      searchContext: searches.getSearchContext('forms', {
        filterParams: {
          assetType: 'asset_type:survey',
        },
        filterTags: 'asset_type:survey',
      })
    });
  },
  newFormModal (evt) {
    evt.preventDefault();
    stores.pageState.showModal({
      type: 'new-form'
    });
  },
  render () {
    return (
      <bem.FormSidebar__wrapper>
        {this.state.currentAssetId}
        <ui.PopoverMenu type='new-menu' 
            triggerLabel={t('new')}>
            <bem.PopoverMenu__link onClick={this.newFormModal}>
              <i className="k-icon-projects" />
              {t('Project')}
            </bem.PopoverMenu__link>
            <Dropzone onDropFiles={this.dropFiles} params={{destination: false}} fileInput>
              <bem.PopoverMenu__link>
                <i className="k-icon-upload" />
                {t('upload')}
              </bem.PopoverMenu__link>
            </Dropzone>
        </ui.PopoverMenu>
        <SidebarFormsList/>
      </bem.FormSidebar__wrapper>
    );
  },
  componentWillReceiveProps() {
    this.setStates();
  }

});

class DrawerLink extends React.Component {
  onClick (evt) {
    if (!this.props.href) {
      evt.preventDefault();
    }
    if (this.props.onClick) {
      this.props.onClick(evt);
    }
  }
  render () {
    var icon_class = (this.props['ki-icon'] == undefined ? `fa fa-globe` : `k-icon-${this.props['ki-icon']}`);
    var icon = (<i className={icon_class}></i>);
    var classNames = [this.props.class, 'k-drawer__link'];

    var link;
    if (this.props.linkto) {
      link = (
        <Link to={this.props.linkto}
            className={classNames.join(' ')}
            activeClassName='active'
            data-tip={this.props.label}>
          {icon}
        </Link>
      );
    } else {
      link = (
        <a href={this.props.href || '#'}
            className={classNames.join(' ')}
            onClick={this.onClick}
            data-tip={this.props.label}>
            {icon}
        </a>
      );
    }
    return link;
  }
}

var Drawer = React.createClass({
  mixins: [
    searches.common,
    mixins.droppable,
    Reflux.connect(stores.session, 'session'),
    Reflux.connect(stores.pageState, 'pageState'),
    mixins.contextRouter
  ],
  toggleFixedDrawer() {
    stores.pageState.toggleFixedDrawer();
  },
  render () {
    return (
      <bem.Drawer className='k-drawer'>
        <nav className='k-drawer__icons'>
          <DrawerLink label={t('Projects')} linkto='/forms' ki-icon='projects' class='projects'/>
          <DrawerLink label={t('Library')} linkto='/library' ki-icon='library' class='library' />
        </nav>

        <div className="drawer__sidebar">
          <button className="mdl-button mdl-button--icon k-drawer__close" onClick={this.toggleFixedDrawer}>
            <i className="k-icon-close"></i>
          </button>
          { this.isLibrary()
            ? <LibrarySidebar />
            : <FormSidebar />
          }
        </div>

        <div className='k-drawer__icons-bottom'>
          { stores.session.currentAccount &&
            <a href={stores.session.currentAccount.projects_url} 
               className='k-drawer__link' 
               target="_blank"
               data-tip={t('Projects (legacy)')}>
              <i className="k-icon k-icon-globe" />
            </a>
          }
          <a href='https://github.com/kobotoolbox/' className='k-drawer__link' target="_blank" data-tip={t('source')}>
            <i className="k-icon k-icon-github" />
          </a>
          { stores.session.currentAccount &&
            <a href={supportUrl()} className='k-drawer__link' target="_blank" data-tip={t('help')}>
              <i className="k-icon k-icon-help" />
            </a>
          }
        </div>
      </bem.Drawer>
      );
  },
  componentDidUpdate() {
    mdl.upgradeDom();
  }
});

export default Drawer;