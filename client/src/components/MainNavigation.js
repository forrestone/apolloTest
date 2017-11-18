import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';

class MainNavigation extends React.Component {
  render() {
    return (
      <Appbar>
         <Link to='/products'>
          <Button>Prodotti</Button>
        </Link>
        <Link to='/customers'>
          <Button>Clienti</Button>
        </Link>
      </Appbar>
    );
  }
}

export default MainNavigation;
