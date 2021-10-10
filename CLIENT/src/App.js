import { BrowserRouter, Route,Switch, Redirect } from "react-router-dom";
import MainPage from "./components/pages/MainPage";
import { useAuth0 } from "@auth0/auth0-react";
import  MyNavbar  from "./components/MyNavbar"
import AccountPage from "./components/pages/AccountPage";
import DataSetPage from "./components/pages/DataSetPage";


const App = () => {
  const { loginWithPopup, loginWithRedirect, logout, user, isAuthenticated } =
          useAuth0();
return(
  <BrowserRouter>
   
   <MyNavbar loginWithPopup={loginWithPopup} loginWithRedirect={loginWithRedirect} logout={logout} user={user} isAuthenticated={isAuthenticated}/>
     <Switch>
     <Route exact path = "/">
      <MainPage user={user} isAuthenticated={isAuthenticated}/>
    </Route>
    <Route exact path = "/:name">
      <AccountPage user={user}/>
    </Route>
    <Route exact  path = "/main/:name">
      <DataSetPage/>
    </Route>
     
            </Switch>
    <Redirect to  = "/"/>
  </BrowserRouter>
)
}

export default App;
