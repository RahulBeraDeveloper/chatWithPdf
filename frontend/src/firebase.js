import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAuoZZ2uwyCe6srX65QiHDVNg0Drh-8HTU",
  authDomain: "chatwithmypdf.firebaseapp.com",
  projectId: "chatwithmypdf",
  storageBucket: "chatwithmypdf.firebasestorage.app",
  messagingSenderId: "184736211609",
  appId: "1:184736211609:web:64ac3760c0e6a95f1f0e08",
  measurementId: "G-7QZ9F2E2DK",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
