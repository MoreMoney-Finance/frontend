import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMsg: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('error', error, errorInfo);
    this.setState({ hasError: true, errorMsg: error.toString() });
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Something went wrong.</h1>
          <br />
          <br />
          <br />
          {this.state.errorMsg}
        </>
      );
    }

    return this.props.children;
  }
}
