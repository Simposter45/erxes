import React, { PropTypes, Component } from 'react';
import { Button, Label, Dropdown, MenuItem } from 'react-bootstrap';
import moment from 'moment';
import { Wrapper } from '/imports/react-ui/layout/components';
import { NameCard } from '/imports/react-ui/common';
import TaggerSection from './TaggerSection.jsx';


const propTypes = {
  customer: PropTypes.object.isRequired,
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTaggerVisible: false,
    };

    this.state = {};
  }

  render() {
    const { customer } = this.props;

    return (
      <Wrapper.Sidebar>
        <div className="action-btn">
          <Dropdown id="contact-user" pullRight>
            <Button bsStyle="success">
              <i className="icon ion-chatbox" /> Send an In App Message
            </Button>
            <Dropdown.Toggle bsStyle="success" />
            <Dropdown.Menu>
              <MenuItem header>Twitter</MenuItem>
              <MenuItem eventKey="1">Mention</MenuItem>
              <MenuItem eventKey="2">Send a direct message</MenuItem>
              <MenuItem header>Facebook</MenuItem>
              <MenuItem eventKey="3">Send a message</MenuItem>
              <MenuItem eventKey="4" divider />
              <MenuItem eventKey="3">Block</MenuItem>
              <MenuItem eventKey="3">Delete</MenuItem>
              <MenuItem eventKey="3">Resubscribe to email</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Wrapper.Sidebar.Section>
          <h3>Customer details</h3>
          <ul className="filters no-link">
            <li>
              <NameCard customer={customer} avatarSize={50} />
            </li>
            <li>
              Created
              <span className="counter">
                {moment(customer.createdAt).fromNow()}
              </span>
            </li>
          </ul>
        </Wrapper.Sidebar.Section>
        <Wrapper.Sidebar.Section>
          <h3>In app messaging</h3>
          <ul className="filters no-link">
            <li>
              Status
              <span className="counter">
                {customer.inAppMessagingData.isActive
                  ? <Label bsStyle="success">Online</Label>
                  : <Label>Offline</Label>
                }
              </span>
            </li>
            <li>
              Last online
              <span className="counter">
                {moment(customer.inAppMessagingData.lastSeenAt).fromNow()}
              </span>
            </li>
            <li>
              Session count
              <span className="counter">
                {customer.inAppMessagingData.sessionCount}
              </span>
            </li>
          </ul>
        </Wrapper.Sidebar.Section>
        {<TaggerSection customer={customer} />}
      </Wrapper.Sidebar>
    );
  }
}

Sidebar.propTypes = propTypes;

export default Sidebar;
