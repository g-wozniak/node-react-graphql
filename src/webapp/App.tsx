import * as React from 'react'
import * as ReactDOM from 'react-dom'

class App extends React.Component<any, any> {
  public render(): JSX.Element {
    return <img src="/images/jedno.jpg" alt="Test" />
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app') as HTMLElement
)