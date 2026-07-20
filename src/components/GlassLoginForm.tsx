import React, { useState, useRef } from 'react';
import { Eye, EyeOff, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  saveUserData 
} from '../utils/firebase';

interface GlassLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin?: () => void;
  onSuccessLogin?: (email: string) => void;
}

export const GlassLoginForm: React.FC<GlassLoginFormProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onSuccessLogin,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Firebase Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      triggerError('Please enter both Email and Password.');
      return;
    }

    if (isSignUp && !username.trim()) {
      triggerError('Please enter a Username.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // 1. Register new user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        
        // 2. Update user profile display name if username provided
        if (username.trim()) {
          await updateProfile(userCredential.user, {
            displayName: username.trim()
          });
        }

        // 3. Save initial user record in Firebase Firestore database
        try {
          await saveUserData(userCredential.user.uid, {
            email: cleanEmail,
            habits: [],
            completions: {},
            stats: {
              xp: 0,
              level: 1,
              totalCredits: 0,
              unlockedAchievements: [],
              username: username.trim() || cleanEmail.split('@')[0] || 'Player',
              avatar: ''
            },
            startDate: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn("Firestore initial document creation warning:", dbErr);
        }

        setToastMessage({
          type: 'success',
          text: 'Account registered in Firebase! Opening app...'
        });
      } else {
        // Sign In existing user with Firebase Authentication
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        
        setToastMessage({
          type: 'success',
          text: 'Signed in successfully! Opening app...'
        });
      }

      if (onSuccessLogin) {
        onSuccessLogin(cleanEmail);
      }

      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 800);

    } catch (err: any) {
      setIsLoading(false);
      console.error('Firebase Auth Error:', err.code, err.message);

      // Map Firebase Auth error codes to user-friendly messages
      let errorText = 'Authentication failed. Please try again.';
      
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email'
      ) {
        errorText = 'Wrong Email ID or Password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorText = 'An account with this Email already exists.';
      } else if (err.code === 'auth/weak-password') {
        errorText = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/too-many-requests') {
        errorText = 'Too many failed attempts. Please try again later.';
      } else if (err.message) {
        errorText = err.message.replace('Firebase: ', '');
      }

      triggerError(errorText);
    }
  };

  const triggerError = (msg: string) => {
    setIsShaking(true);
    setToastMessage({ type: 'error', text: msg });
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="glass-page-overlay animate-fade-in">
      
      {/* Subtle Ambient Background Orbs */}
      <div className="glass-bg-orbs">
        <div className="glass-orb glass-orb-1"></div>
        <div className="glass-orb glass-orb-2"></div>
      </div>

      {/* Main Dark Red Glass Card */}
      <div 
        ref={cardRef}
        className={`glass-card-image2 ${isShaking ? 'glass-card-shake' : ''}`}
      >
        {/* Close Button X */}
        <button className="glass-img2-close-btn" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        {/* Habit Tracker Logo & Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src={`${import.meta.env.BASE_URL}logo.jpg`} 
            alt="Habit Tracker Logo" 
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '16px', 
              objectFit: 'cover', 
              border: '2px solid rgba(239, 68, 68, 0.5)', 
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
              marginBottom: '0.65rem' 
            }} 
          />
          <h1 style={{ 
            fontSize: '1.35rem', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            color: 'var(--text-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem' 
          }}>
            HABIT TRACKER
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Track habits, build streaks & gain XP
          </span>
        </div>

        {/* Card Title "Login" / "Register" */}
        <h2 className="glass-img2-title">
          {isSignUp ? 'Register' : 'Login'}
        </h2>

        {/* Toast Alert Feedback */}
        {toastMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            background: toastMessage.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
            border: `1px solid ${toastMessage.type === 'success' ? '#34d399' : '#f87171'}`,
            color: '#ffffff'
          }}>
            {toastMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          
          {/* Username Field (Sign Up mode only) */}
          {isSignUp && (
            <div className="glass-img2-field">
              <label className="glass-img2-label">Username</label>
              <input 
                type="text" 
                className="glass-img2-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="glass-img2-field">
            <label className="glass-img2-label">Email</label>
            <input 
              type="email" 
              className="glass-img2-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="glass-img2-field">
            <label className="glass-img2-label">Password</label>
            <div className="glass-img2-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="glass-img2-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="glass-img2-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forget Password Row (Login mode) */}
          {!isSignUp && (
            <div className="glass-img2-options-row">
              <label className="glass-img2-remember">
                <input 
                  type="checkbox" 
                  className="glass-img2-checkbox"
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <a 
                href="#forgot" 
                className="glass-img2-forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link sent to your email.');
                }}
              >
                Forget Password
              </a>
            </div>
          )}

          {/* Primary Red Gradient Submit Button */}
          <button type="submit" className="glass-img2-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Authenticating...
              </>
            ) : (
              isSignUp ? 'Register' : 'Log in'
            )}
          </button>
        </form>

        {/* Firebase Google Sign In Pill Button */}
        {onGoogleLogin && (
          <button 
            type="button"
            className="glass-img2-google-btn"
            onClick={() => {
              onGoogleLogin();
              onClose();
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign In with Google
          </button>
        )}

        {/* Footer Link ("Don't have a account Register") */}
        <div className="glass-img2-footer-text">
          {!isSignUp ? (
            <>
              Don't have a account
              <span 
                className="glass-img2-footer-link"
                onClick={() => { setIsSignUp(true); setToastMessage(null); }}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?
              <span 
                className="glass-img2-footer-link"
                onClick={() => { setIsSignUp(false); setToastMessage(null); }}
              >
                Log in
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
