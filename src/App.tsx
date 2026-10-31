import { Reader } from './components/Reader'
import { VoiceProvider } from './components/Voice'

export function App() {
  return (
    <VoiceProvider>
      <Reader />
    </VoiceProvider>
  )
}
