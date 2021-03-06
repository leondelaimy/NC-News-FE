import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { Navbar, Container, Row, Col, ProgressBar } from "react-materialize";
import Articles from "./components/Articles";
import Article from "./components/Article";
import Search from "./components/Search";
import UserLogin from "./components/UserLogin";
import * as API from "./API";

class App extends Component {
  state = {
    articles: [],
    loading: true,
    searchTerm: "",
    currentUser: {},
    loggedIn: false
  };

  componentDidMount() {
    API.getArticles().then(articles => {
      this.setState({
        articles,
        loading: false
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    API.getArticles().then(articles => {
      this.setState({
        articles,
        loading: false
      });
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="React-logo" alt="logo" />
          </header>

          <Navbar brand="Northcoders News" right>
            <li>
              <Search
                articles={this.state.articles}
                onSearchChange={this.onSearchChange}
              />
            </li>
            <li>
              <NavLink to="/topics/coding">Coding</NavLink>
            </li>
            <li>
              <NavLink to="/topics/football">Football</NavLink>
            </li>
            <li>
              <NavLink to="/topics/cooking">Cooking</NavLink>
            </li>
            <li>
              <UserLogin
                loginUser={this.loginUser}
                currentUser={this.state.currentUser}
                loggedIn={this.state.loggedIn}
                logoutUser={this.logoutUser}
              />
            </li>
          </Navbar>

          {this.state.loading ? (
            <Row>
              <Col s={12}>
                <ProgressBar />
              </Col>
            </Row>
          ) : (
            <Container>
              <Route
                exact
                path="/"
                render={props => (
                  <Articles
                    {...props}
                    articles={this.state.articles}
                    searchTerm={this.state.searchTerm}
                  />
                )}
              />
              <Route
                path="/topics/:topic_id"
                render={props => (
                  <Articles
                    {...props}
                    articles={this.state.articles}
                    searchTerm={this.state.searchTerm}
                  />
                )}
              />
              <Route
                path="/articles/:article_id"
                render={props => (
                  <Article
                    {...props}
                    articles={this.state.articles}
                    currentUser={this.state.currentUser}
                    loginUser={this.loginUser}
                  />
                )}
              />
            </Container>
          )}
        </div>
      </Router>
    );
  }

  onSearchChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  loginUser = username => {
    API.getUser(username).then(user => {
      this.setState({
        currentUser: user,
        loggedIn: true
      });
    });
  };

  logoutUser = () => {
    this.setState({
      currentUser: {},
      loggedIn: false
    });
  };
}

export default App;
