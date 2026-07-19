import React, { useState, useRef } from 'react';
import { CheckSquare, Flame, Award, Zap, Coins, Trophy, User, Edit2, Check, X, Camera } from 'lucide-react';
import type { Achievement } from '../utils/achievements';
import { resizeAvatar } from '../utils/cookies';

interface SidebarLeftProps {
  username: string;
  avatar: string;
  onUpdateProfile: (name: string, avatar: string) => void;
  level: number;
  xp: number;
  xpNeeded: number;
  totalCredits: number;
  achievements: Achievement[];
  unlockedIds: string[];
  userEmail: string;
  onLoginClick: () => void;
  onLogout: () => void;
  syncStatus: 'synced' | 'syncing' | 'simulation' | 'offline';
}

const renderIcon = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'CheckSquare': return <CheckSquare size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'Award': return <Award size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Coins': return <Coins size={size} />;
    case 'Trophy': return <Trophy size={size} />;
    default: return <Award size={size} />;
  }
};

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  username,
  avatar,
  onUpdateProfile,
  level,
  xp,
  xpNeeded,
  totalCredits,
  achievements,
  unlockedIds,
  userEmail,
  onLoginClick,
  onLogout,
  syncStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(username);
  const [editAvatar, setEditAvatar] = useState(avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  const handleSave = () => {
    if (!editName.trim()) return;
    onUpdateProfile(editName.trim(), editAvatar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(username);
    setEditAvatar(avatar);
    setIsEditing(false);
  };

  // Handle image upload and convert to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Image must be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeAvatar(reader.result as string);
        setEditAvatar(resized);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar-wrapper">
      
      {/* App Branding */}
      <div className="glow-card logo-card">
        <img 
          src={`${import.meta.env.BASE_URL}logo.jpg`} 
          alt="HT Habit Tracker Logo" 
          className="logo-img"
        />
        <h1 className="logo-text">Habit Tracker</h1>
      </div>

      {/* User Stats Card */}
      <div className="glow-card profile-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Profile Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          
          {/* Avatar Container */}
          <div 
            onClick={() => isEditing && fileInputRef.current?.click()}
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              flexShrink: 0,
              overflow: 'hidden',
              cursor: isEditing ? 'pointer' : 'default',
              backgroundColor: 'rgba(239, 68, 68, 0.05)'
            }}
          >
            {isEditing ? (
              <>
                {editAvatar ? (
                  <img src={editAvatar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={20} style={{ color: 'var(--primary-red)' }} />
                )}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <Camera size={14} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </>
            ) : (
              avatar ? (
                <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={20} style={{ color: 'var(--primary-red)' }} />
              )
            )}
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 0 }}>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={20}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--primary-red)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700
                }}
                placeholder="Name"
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                <button onClick={handleSave} style={{ background: 'var(--primary-red)', border: 'none', borderRadius: '4px', padding: '0.15rem 0.35rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
                  <Check size={12} />
                </button>
                <button onClick={handleCancel} style={{ background: '#27272a', border: 'none', borderRadius: '4px', padding: '0.15rem 0.35rem', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, minWidth: 0, paddingRight: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {username}
              </h4>
              <span style={{ 
                fontSize: '0.65rem', 
                color: userEmail ? 'var(--primary-red)' : 'var(--difficulty-easy)', 
                display: 'block', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }} title={userEmail || 'Guest Mode'}>
                {userEmail ? `Google: ${userEmail}` : 'Guest Mode (Local)'}
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem' }}>
                {userEmail ? (
                  <button 
                    onClick={onLogout}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.6rem',
                      fontWeight: 850,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    Logout
                  </button>
                ) : (
                  <button 
                    onClick={onLoginClick}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.6rem',
                      fontWeight: 850,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    Sign In
                  </button>
                )}

                <span style={{ color: 'var(--text-dark)', fontSize: '0.6rem' }}>|</span>

                {/* Cloud Sync Status Indicator */}
                <div style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.2rem',
                  color: syncStatus === 'synced' ? 'var(--difficulty-easy)' : 
                         syncStatus === 'syncing' ? 'var(--difficulty-medium)' : 
                         syncStatus === 'simulation' ? '#38bdf8' : 'var(--text-dark)'
                }}>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: syncStatus === 'synced' ? 'var(--difficulty-easy)' : 
                                     syncStatus === 'syncing' ? 'var(--difficulty-medium)' : 
                                     syncStatus === 'simulation' ? '#38bdf8' : 'var(--text-dark)',
                    display: 'inline-block',
                    boxShadow: syncStatus === 'synced' ? '0 0 4px var(--difficulty-easy)' : 'none'
                  }}></span>
                  {syncStatus === 'synced' && 'Synced'}
                  {syncStatus === 'syncing' && 'Syncing...'}
                  {syncStatus === 'simulation' && 'Simulated'}
                  {syncStatus === 'offline' && 'Offline'}
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dark)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
                title="Edit Profile"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '0' }} />

        {/* Level Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Level</span>
          <span className="badge badge-hard" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--primary-red)' }}>
            Lvl {level}
          </span>
        </div>

        {/* XP Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>PROGRESS TO NEXT LEVEL</span>
            <span>{xp}/{xpNeeded} XP</span>
          </div>
          <div className="xp-progress-container">
            <div className="xp-progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Total Credits */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Coins size={14} style={{ color: 'var(--difficulty-medium)' }} /> Total Credits
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-red)' }}>
            {totalCredits} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>CR</span>
          </span>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '0' }} />

      </div>

      {/* Achievements Shelf */}
      <div className="glow-card achievements-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Achievements</h3>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Earn medals by checking habits</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginTop: '0.25rem' }}>
          {achievements.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className="achievement-badge"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.65rem 0.25rem',
                  borderRadius: '8px',
                  backgroundColor: isUnlocked ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.01)',
                  border: isUnlocked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.03)',
                  transition: 'all 0.2s ease',
                  opacity: isUnlocked ? 1 : 0.4,
                  cursor: 'help'
                }}
                title={`${ach.title}: ${ach.description} (+${ach.xpReward} XP)`}
              >
                <div style={{
                  color: isUnlocked ? 'var(--primary-red)' : 'var(--text-muted)',
                  filter: isUnlocked ? 'drop-shadow(0 0 4px var(--primary-red))' : 'none',
                  marginBottom: '0.35rem'
                }}>
                  {renderIcon(ach.icon, 22)}
                </div>
                <span style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 700, 
                  textAlign: 'center',
                  color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%'
                }}>
                  {ach.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
