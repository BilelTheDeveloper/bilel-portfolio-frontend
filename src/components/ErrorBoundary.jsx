import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('Page rendering failed:', error); }
  render() {
    if (this.state.failed) return <main className="min-h-screen grid place-items-center p-6 text-center"><div><h1 className="text-3xl font-bold mb-4">Something went wrong.</h1><p className="text-slate-300 mb-6">Please reload the page or contact me directly.</p><button className="rounded-xl bg-blue-600 px-6 py-3" onClick={() => window.location.reload()}>Reload page</button><a className="block mt-4 underline" href="mailto:bilel.thedeveloper@gmail.com">Email Bilel</a></div></main>;
    return this.props.children;
  }
}
