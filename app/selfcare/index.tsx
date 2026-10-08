import { Redirect } from 'expo-router';

/**
 * The "What do you need right now?" picker is retired — tools live directly on
 * the Hub pane of the home pager now. This redirect keeps any stale
 * /selfcare links working.
 */
export default function SelfcareRedirect() {
  return <Redirect href="/" />;
}
