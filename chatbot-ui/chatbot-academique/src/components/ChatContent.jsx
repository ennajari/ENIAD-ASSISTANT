import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon
} from '@mui/icons-material';
import { translations } from '../constants/config';
import FloatingIcons from './FloatingIcons';
import MessageBubble from './MessageBubble';
import MessageMetadata from './MessageMetadata';

const ChatContent = ({
  messages,
  isLoading,
  currentLanguage,
  darkMode,
  editingMessageId,
  editedMessageContent,
  setEditedMessageContent,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onQuestionClick,
  onSpeakText,
  isSpeaking,
  supported,
  messagesEndRef,
  refreshTrigger, // New prop to trigger suggestions refresh
  user // Add user prop for avatar
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key];

  // State for dynamic suggestions
  const [dynamicSuggestions, setDynamicSuggestions] = useState([]);

  // Dynamic suggestions with larger pool
  const getSimpleSuggestions = (lang) => {
    const suggestions = {
      fr: [
        "Quels sont les programmes de formation disponibles à l'ENIAD ?",
        "Comment puis-je m'inscrire à l'ENIAD ?",
        "Quelles sont les conditions d'admission à l'ENIAD ?",
        "Qu'est-ce que l'intelligence artificielle ?",
        "Quels sont les frais de scolarité ?",
        "Y a-t-il des bourses d'études disponibles ?",
        "Quelle est la durée des études à l'ENIAD ?",
        "Comment accéder au campus ENIAD ?",
        "Y a-t-il une bibliothèque sur le campus ?",
        "Quels sont les horaires des cours ?",
        "Comment contacter les professeurs ?",
        "Y a-t-il des stages obligatoires ?",
        "Qu'est-ce que le machine learning ?",
        "Quels langages de programmation sont enseignés ?",
        "Y a-t-il des clubs étudiants ?",
        "Comment s'inscrire aux cours ?",
        "Où trouver les supports de cours ?",
        "Comment réserver une salle d'étude ?",
        "Y a-t-il des cours en ligne ?",
        "Quels sont les débouchés professionnels ?"
      ],
      en: [
        "What training programs are available at ENIAD?",
        "How can I enroll at ENIAD?",
        "What are the admission requirements for ENIAD?",
        "What is artificial intelligence?",
        "What are the tuition fees?",
        "Are there scholarships available?",
        "What is the duration of studies at ENIAD?",
        "How to access the ENIAD campus?",
        "Is there a library on campus?",
        "What are the class schedules?",
        "How to contact professors?",
        "Are there mandatory internships?",
        "What is machine learning?",
        "What programming languages are taught?",
        "Are there student clubs?",
        "How to register for courses?",
        "Where to find course materials?",
        "How to book a study room?",
        "Are there online courses?",
        "What are the career opportunities?"
      ],
      ar: [
        "ما هي البرامج التدريبية المتاحة في ENIAD؟",
        "كيف يمكنني التسجيل في ENIAD؟",
        "ما هي شروط القبول في ENIAD؟",
        "ما هو الذكاء الاصطناعي؟",
        "ما هي الرسوم الدراسية؟",
        "هل توجد منح دراسية متاحة؟",
        "ما هي مدة الدراسة في ENIAD؟",
        "كيف أصل إلى حرم ENIAD؟",
        "هل توجد مكتبة في الحرم؟",
        "ما هي مواعيد الفصول؟",
        "كيف أتواصل مع الأساتذة؟",
        "هل هناك تدريبات إجبارية؟",
        "ما هو التعلم الآلي؟",
        "ما هي لغات البرمجة التي يتم تدريسها؟",
        "هل توجد نوادي طلابية؟",
        "كيف أسجل في المقررات؟",
        "أين أجد مواد الدورة؟",
        "كيف أحجز غرفة دراسة؟",
        "هل توجد دورات عبر الإنترنت؟",
        "ما هي الفرص المهنية؟"
      ]
    };

    const allSuggestions = suggestions[lang] || suggestions.en;
    // Shuffle and return 3 random ones
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Load dynamic suggestions when component mounts, language changes, or refresh is triggered
  useEffect(() => {
    const loadSuggestions = () => {
      console.log('🔄 Loading suggestions for language:', currentLanguage);

      try {
        // Use simple suggestions for now
        const suggestions = getSimpleSuggestions(currentLanguage);
        setDynamicSuggestions(suggestions);
        console.log('🎯 Loaded simple suggestions:', suggestions);
      } catch (error) {
        console.error('❌ Error loading suggestions:', error);
        setDynamicSuggestions([]);
      }
    };

    loadSuggestions();

    // Set up interval to refresh suggestions every 30 seconds
    const interval = setInterval(loadSuggestions, 30000);

    return () => clearInterval(interval);
  }, [currentLanguage, refreshTrigger]);



  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <FloatingIcons darkMode={darkMode} />
        
        <Container
          maxWidth="md"
          disableGutters
          sx={{
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'text.secondary',
              gap: 2,
              px: 2
            }}
          >
            <Box
              component="a"
              href="https://eniad.ump.ma/fr"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                mb: 2,
                borderRadius: '50%',
                bgcolor: 'rgba(16, 163, 127, 0.1)',
                p: 1,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 25px rgba(16, 163, 127, 0.3)',
                }
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="ENIAD Logo - Visit Website"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {t('assistant')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
              {t('startPrompt')}
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 'lg', px: { xs: 2, sm: 3 } }}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} justifyContent="center" alignItems="stretch">
                {(() => {
                  // Determine which suggestions to use
                  let suggestionsToShow = [];

                  if (dynamicSuggestions && dynamicSuggestions.length > 0) {
                    suggestionsToShow = dynamicSuggestions;
                    console.log('📋 Using dynamic suggestions:', suggestionsToShow);
                  } else if (translations[currentLanguage] && translations[currentLanguage].suggestions) {
                    suggestionsToShow = translations[currentLanguage].suggestions;
                    console.log('📋 Using fallback suggestions:', suggestionsToShow);
                  } else {
                    // Ultimate fallback
                    suggestionsToShow = [
                      "Quels sont les programmes de formation disponibles à l'ENIAD ?",
                      "Comment puis-je m'inscrire à l'ENIAD ?",
                      "Quelles sont les conditions d'admission à l'ENIAD ?"
                    ];
                    console.log('📋 Using ultimate fallback suggestions');
                  }

                  return suggestionsToShow.map((question, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={0}
                        onClick={() => onQuestionClick(question)}
                        sx={{
                          p: { xs: 2.5, sm: 3 }, // Increased padding
                          borderRadius: '16px', // More rounded corners
                          border: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          minHeight: { xs: 80, sm: 90, md: 100 }, // Minimum height to accommodate text
                          height: 'auto', // Allow height to grow with content
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: darkMode ? '#1a202c' : '#ffffff',
                          '&:hover': {
                            borderColor: darkMode ? '#4a5568' : '#cbd5e0',
                            transform: 'translateY(-3px)',
                            boxShadow: darkMode
                              ? '0 8px 25px rgba(0,0,0,0.3)'
                              : '0 8px 25px rgba(0,0,0,0.1)',
                            backgroundColor: darkMode ? '#2d3748' : '#f7fafc'
                          }
                        }}
                      >
                        <Typography sx={{
                          fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }, // Responsive font size
                          lineHeight: 1.5, // Better line height for readability
                          textAlign: 'center', // Center align for better appearance
                          fontWeight: 500,
                          color: darkMode ? '#e2e8f0' : '#2d3748',
                          wordBreak: 'break-word', // Handle long words
                          hyphens: 'auto', // Enable hyphenation
                          padding: '4px 0', // Small vertical padding
                        }}>
                          {question || 'Loading...'}
                        </Typography>
                      </Paper>
                    </Grid>
                  ));
                })()}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        bgcolor: darkMode ? '#0a0a0a' : '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
          '&:hover': {
            bgcolor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          }
        }
      }}
    >
      <Container
        maxWidth="4xl"
        disableGutters
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2, sm: 4 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {/* Message Header with Avatar and Role */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 1
              }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: msg.role === 'user'
                      ? 'transparent'
                      : 'rgba(16, 163, 127, 0.1)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: msg.role === 'user' && user?.photoURL
                      ? '2px solid rgba(16, 163, 127, 0.3)'
                      : 'none',
                  }}
                >
                  {msg.role === 'user' ? (
                    user?.photoURL ? (
                      <Box
                        component="img"
                        src={user.photoURL}
                        alt={user.displayName || user.email || 'User'}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <PersonIcon fontSize="small" sx={{ color: '#10a37f' }} />
                    )
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        p: 0.5
                      }}
                    >
                      <Box
                        component="img"
                        src="/logo_icon.png"
                        alt="ENIAD Assistant"
                        onError={(e) => {
                          // Fallback to SVG if PNG fails
                          e.target.src = "/logo_icon.svg";
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  )}
                </Avatar>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  textTransform: 'capitalize'
                }}>
                  {msg.role === 'user' ? t('you') || 'You' : t('assistant') || 'Assistant'}
                </Typography>
              </Box>

              {/* Message Content */}
              <MessageBubble
                message={msg}
                darkMode={darkMode}
                currentLanguage={currentLanguage}
                isEditing={editingMessageId === msg.id}
                editedContent={editedMessageContent}
                onEditStart={onEditMessage}
                onEditSave={onSaveEdit}
                onEditCancel={onCancelEdit}
                onEditChange={setEditedMessageContent}
                onSpeakText={onSpeakText}
                isSpeaking={isSpeaking[msg.id]}
                supported={supported}
                t={t}
              />

              {/* Métadonnées du message (modèle, sources, etc.) */}
              {msg.role === 'assistant' && (
                <MessageMetadata
                  message={msg}
                  currentLanguage={currentLanguage}
                />
              )}
            </Box>
          ))}

          {isLoading && (
            <Box sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {/* Loading Message Header */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 1
              }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(16, 163, 127, 0.1)',
                    color: '#fff',
                    p: 0.5,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box
                    component="img"
                    src="/logo_icon.png"
                    alt="ENIAD Assistant"
                    onError={(e) => {
                      // Fallback to SVG if PNG fails
                      e.target.src = "/logo_icon.svg";
                    }}
                    sx={{
                      width: 20,
                      height: 20,
                      objectFit: 'contain'
                    }}
                  />
                </Avatar>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                }}>
                  {t('assistant') || 'Assistant'}
                </Typography>
              </Box>

              {/* Loading Message Content */}
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '20px',
                  padding: { xs: '16px 20px', sm: '20px 24px' },
                  backgroundColor: darkMode
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: darkMode
                    ? '0 4px 20px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minHeight: '60px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <CircularProgress
                  size={20}
                  sx={{
                    color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                  }}
                />
                <Typography sx={{
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  fontStyle: 'italic'
                }}>
                  {t('thinking')}
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Container>
    </Box>
  );
};

export default ChatContent;
