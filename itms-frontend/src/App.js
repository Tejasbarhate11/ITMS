import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import HomePage from './components/HomePage'
import StartPage from './components/StartPage'
import TestPage from './components/TestPage'
import NotFound from './components/NotFound'
import LoadTest from './components/LoadTest'
import SubmitPage from './components/SubmitPage'
import secureStorage from './Utils/secureStorage'


function App() {
  return (  
    <Router>
      <Switch>
        <Route exact path="/" component={ HomePage }/>
        <Route path="/index/:id" component={ StartPage }/>
        <PrivateRoute path="/test/submit">
          <SubmitPage/>
        </PrivateRoute>
        <PrivateRoute path="/test/load">
          <LoadTest/>
        </PrivateRoute>
        <PrivateRoute path="/test/start">
          <TestPage/>
        </PrivateRoute>
        <Route path="*" component={ NotFound }/>
      </Switch>
    </Router>
  )
}

function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = secureStorage.getItem(process.env.REACT_APP_AUTH)
  return (
    <Route {...rest} render={({ location }) =>
        isAuthenticated ? (children) :
        (<Redirect to={{ pathname: '/', state: { from: location } }} />)
      }
    />
  )
}

export default App
