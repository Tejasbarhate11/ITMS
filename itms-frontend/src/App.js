import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import HomePage from './components/HomePage';
import StartPage from './components/StartPage';
import TestPage from './components/TestPage';
import NotFound from './components/NotFound';
import Header from './components/Header';


function App() {
  return (  
    <Router>
      <Header/>
      <div className="content">
        <Switch>
          <Route exact path="/" component={ HomePage }/>
          <Route path="/index/:id" component={ StartPage }/>
          <PrivateRoute path="/start">
            <TestPage/>
          </PrivateRoute>
          <Route path="*" component={ NotFound }/>
        </Switch>
      </div>
    </Router>
  );
}

function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = sessionStorage.getItem('auth');
  return (
    <Route {...rest} render={({ location }) =>
        isAuthenticated ? (children) :
        (<Redirect to={{ pathname: '/', state: { from: location } }} />)
      }
    />
  )
}

export default App;
