import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted: false,
      subreddit: "",
      numPosts: 10,
    };

    this.handleSubreddit = this.handleSubreddit.bind(this);
    this.handleNumPosts = this.handleNumPosts.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleSubreddit(event) {
    this.setState({ subreddit: event.target.value });
  }

  handleNumPosts(event) {
    this.setState({ numPosts: event.target.value });
  }

  submitForm(event) {
    console.log("Fetching posts from the subreddit " + this.state.subreddit);
    this.setState({
      isSubmitted: true,
    });
  }

  resetForm(event) {
    this.setState({
      isSubmitted: false,
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Find Top Posts from Reddit</h1>
        <div className="row">
          <label>Enter Number of Posts to Display:</label>
          <div className="form-group">
            <input
              type="text"
              value={this.state.numPosts}
              onChange={this.handleNumPosts}
            />
          </div>
        </div>

        <div className="row">
          <label>Enter Subreddit:</label>

          <div className="form-group">
            <input
              type="text"
              value={this.state.subreddit}
              onChange={this.handleSubreddit}
            />
          </div>
        </div>

        <div>
          <button onClick={this.submitForm} disabled={this.state.isSubmitted}>
            Submit
          </button>
        </div>
        {this.state.isSubmitted ? (
          <FetchReddit
            subreddit={this.state.subreddit}
            numPosts={this.state.numPosts}
          />
        ) : null}
        <button
          onClick={this.resetForm}
          style={{ visibility: this.state.isSubmitted ? "visible" : "hidden" }}
        >Reset</button>
      </div>
    );
  }
}

class FetchReddit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: null,
    };
    this.numPosts = props.numPosts;
    this.subreddit = props.subreddit;
    this.link =
      "https://www.reddit.com/r/" +
      props.subreddit +
      "/top/.json?t=all&limit=" +
      this.numPosts;
  }

  componentDidMount() {
    fetch(this.link)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            posts: result.data ? result.data.children : null,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, posts } = this.state;
    if (error) {
      return <div className="ErrorMessage">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h2>
            Displaying Top {this.numPosts} Posts from r/{this.subreddit} of All Time
          </h2>
          <div className="RedditContainer">
            <ol type="1">
              {this.state.posts === null ? (
                <div className="ErrorMessage">Error: Subreddit not found.</div>
              ) : (
                posts.map((post) => (
                  <li key={post.data.id}>
                    <a href={"https://reddit.com" + post.data.permalink}>
                      {post.data.title}
                    </a>
                    <p>
                      Description: {post.data.selftext.substring(0, 100)}...
                    </p>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      );
    }
  }
}

export default App;
