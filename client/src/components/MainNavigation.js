import React from 'react';
import {Link} from 'react-router-dom';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';

class MainNavigation extends React.Component {
  render() {
    return (
      <Appbar>
         <Link className="navigation" to='/products'>
          <Button>Prodotti</Button>
        </Link>
        <Link className="navigation" to='/customers'>
          <Button>Clienti</Button>
        </Link>
      </Appbar>
    );
  }
}

export default MainNavigation;
