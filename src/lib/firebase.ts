import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { QuizLead } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const provider = new GoogleAuthProvider();
// Request Google Sheets and Calendar scopes
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/calendar');

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token in memory.
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If we don't have a cached token, we'll need to sign in again or prompt
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Firestore error handling according to firebase-integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Firestore helper functions
export interface GoogleConfig {
  accessToken: string;
  spreadsheetId: string;
  updatedAt: number;
  adminEmail: string;
}

export const saveGoogleConfig = async (accessToken: string, spreadsheetId: string, adminEmail: string): Promise<void> => {
  const path = 'config/google';
  try {
    await setDoc(doc(db, 'config', 'google'), {
      accessToken,
      spreadsheetId,
      updatedAt: Date.now(),
      adminEmail
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const subscribeToGoogleConfig = (callback: (config: GoogleConfig | null) => void) => {
  const path = 'config/google';
  return onSnapshot(doc(db, 'config', 'google'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as GoogleConfig);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const saveLeadToFirestore = async (lead: QuizLead): Promise<void> => {
  const path = `leads/${lead.id}`;
  try {
    // Sanitize any undefined properties recursively to prevent setDoc errors
    const cleanedLead = JSON.parse(JSON.stringify(lead));
    await setDoc(doc(db, 'leads', lead.id), cleanedLead);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteLeadFromFirestore = async (id: string): Promise<void> => {
  const path = `leads/${id}`;
  try {
    await deleteDoc(doc(db, 'leads', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const listenToLeads = (callback: (leads: QuizLead[]) => void) => {
  const path = 'leads';
  const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const leads: QuizLead[] = [];
    snapshot.forEach((doc) => {
      leads.push(doc.data() as QuizLead);
    });
    callback(leads);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

