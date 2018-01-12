import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import { Wrapper } from 'modules/layout/components';
import {
  Pagination,
  ModalTrigger,
  Button,
  Table,
  Icon,
  ShowData,
  FormControl,
  DropdownToggle,
  TaggerPopover
} from 'modules/common/components';
import { router, confirm } from 'modules/common/utils';
import { BarItems } from 'modules/layout/styles';
import Sidebar from './Sidebar';
import CompanyRow from './CompanyRow';
import { CompanyForm } from '../';
import { ManageColumns } from '../../../fields/containers';

const propTypes = {
  companies: PropTypes.array.isRequired,
  counts: PropTypes.object.isRequired,
  columnsConfig: PropTypes.array.isRequired,
  addCompany: PropTypes.func.isRequired,
  history: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  toggleBulk: PropTypes.func.isRequired,
  toggleAll: PropTypes.func.isRequired,
  bulk: PropTypes.array.isRequired,
  emptyBulk: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  removeCompanies: PropTypes.func.isRequired,
  loadingTags: PropTypes.bool.isRequired
};

class CompaniesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue
    };

    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
    this.removeCompanies = this.removeCompanies.bind(this);
  }

  onChange() {
    const { toggleAll, companies } = this.props;
    toggleAll(companies, 'companies');
  }

  search(e) {
    if (this.timer) clearTimeout(this.timer);
    const { history } = this.props;
    const searchValue = e.target.value;
    this.setState({ searchValue });

    this.timer = setTimeout(() => {
      router.setParams(history, { searchValue });
    }, 500);
  }

  removeCompanies(companies) {
    const companyIds = [];

    companies.forEach(company => {
      companyIds.push(company._id);
    });
    this.props.removeCompanies({ companyIds });
  }

  render() {
    const {
      columnsConfig,
      companies,
      history,
      loading,
      addCompany,
      counts,
      toggleBulk,
      bulk,
      emptyBulk,
      tags,
      loadingTags
    } = this.props;

    const mainContent = (
      <div>
        <Table whiteSpace="nowrap" bordered hover>
          <thead>
            <tr>
              <th>
                <FormControl
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              {columnsConfig.map(({ name, label }) => (
                <th key={name}>{label}</th>
              ))}
              <th>Tags</th>
            </tr>
          </thead>
          <tbody id="companies">
            {companies.map(company => (
              <CompanyRow
                company={company}
                columnsConfig={columnsConfig}
                key={company._id}
                history={history}
                toggleBulk={toggleBulk}
              />
            ))}
          </tbody>
        </Table>
      </div>
    );

    const addTrigger = (
      <Button btnStyle="success" size="small">
        <Icon icon="plus" /> Add company
      </Button>
    );

    const editColumns = (
      <Button btnStyle="simple" size="small">
        Edit columns
      </Button>
    );

    let actionBarLeft = null;

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle="simple" size="small">
          Tag <Icon icon="ios-arrow-down" />
        </Button>
      );

      actionBarLeft = (
        <BarItems>
          <TaggerPopover
            type="company"
            afterSave={emptyBulk}
            targets={bulk}
            trigger={tagButton}
          />
          <Dropdown id="dropdown-options" pullRight>
            <DropdownToggle bsRole="toggle">
              <Button btnStyle="simple" size="small">
                More <Icon icon="ios-arrow-down" />
              </Button>
            </DropdownToggle>
            <Dropdown.Menu>
              <li>
                <a
                  onClick={() =>
                    confirm().then(() => {
                      this.removeCompanies(bulk);
                    })
                  }
                >
                  Remove
                </a>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        </BarItems>
      );
    }

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder="Type to search.."
          onChange={e => this.search(e)}
          value={this.state.searchValue}
        />
        <ModalTrigger title="Choose which column you see" trigger={editColumns}>
          <ManageColumns contentType="company" />
        </ModalTrigger>
        <ModalTrigger title="New company" trigger={addTrigger}>
          <CompanyForm addCompany={addCompany} />
        </ModalTrigger>
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );
    const breadcrumb = [{ title: `Companies (${counts.all})` }];
    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        actionBar={actionBar}
        footer={<Pagination count={counts.all} />}
        leftSidebar={
          <Sidebar counts={counts} tags={tags} loading={loadingTags} />
        }
        content={
          <ShowData
            data={mainContent}
            loading={loading}
            count={companies.length}
            emptyText="No companies added yet!"
            emptyIcon="ios-list"
          />
        }
      />
    );
  }
}

CompaniesList.propTypes = propTypes;

export default withRouter(CompaniesList);
