import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Fade,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  QuestionMark as QuestionIcon,
  TrendingUp as TrendingIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import questionSuggestionService from '../services/questionSuggestionService';
import staticSuggestionsService from '../services/staticSuggestionsService';

const QuestionAutocomplete = ({
  inputValue,
  onQuestionSelect,
  onClose,
  onMouseEnter,
  onMouseLeave,
  isVisible = false,
  maxSuggestions = 5,
  currentLanguage,
  darkMode
}) => {
  // Use passed language or fallback to context
  const { language: contextLanguage } = useLanguage();
  const language = currentLanguage || contextLanguage;
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef(null);
  const debounceRef = useRef(null);

  // Translations for the component
  const translations = {
    fr: {
      staticSuggestions: "Suggestions du moment",
      suggestions: "Suggestions",
      noSuggestions: "Aucune suggestion trouvée",
      loading: "Recherche...",
      selectQuestion: "Sélectionner cette question",
      startTyping: "Commencez à taper pour voir les suggestions...",
      helpText: "Essayez de poser des questions sur les programmes, installations ou admissions ENIAD",
      refreshed: "Actualisé"
    },
    en: {
      staticSuggestions: "Featured Questions",
      suggestions: "Suggestions",
      noSuggestions: "No suggestions found",
      loading: "Searching...",
      selectQuestion: "Select this question",
      startTyping: "Start typing to see suggestions...",
      helpText: "Try asking about ENIAD programs, facilities, or admissions",
      refreshed: "Refreshed"
    },
    ar: {
      staticSuggestions: "أسئلة مميزة",
      suggestions: "اقتراحات",
      noSuggestions: "لم يتم العثور على اقتراحات",
      loading: "جاري البحث...",
      selectQuestion: "اختر هذا السؤال",
      startTyping: "ابدأ بالكتابة لرؤية الاقتراحات...",
      helpText: "جرب السؤال عن برامج أو مرافق أو قبول ENIAD",
      refreshed: "محدث"
    }
  };

  const t = translations[language] || translations.fr;
  const isRTL = language === 'ar';

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      console.log('🔍 Searching for:', searchTerm, 'in language:', language);
      setLoading(true);
      try {
        const results = await questionSuggestionService.getSuggestions(
          searchTerm,
          language,
          maxSuggestions
        );
        console.log('📝 Search results:', results);
        setSuggestions(results);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('❌ Error getting suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [language, maxSuggestions]);

  // Initialize static suggestions on first load
  useEffect(() => {
    staticSuggestionsService.forceRefresh();
  }, []);

  // Update suggestions when input changes or language changes
  useEffect(() => {
    console.log('🔄 useEffect triggered:', { isVisible, inputValue, language, currentLanguage, contextLanguage });

    if (!isVisible) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      setLoading(true);
      try {
        // Ensure questions are loaded
        await questionSuggestionService.loadQuestions();

        if (!inputValue || inputValue.length < 2) {
          // Show static suggestions when no input
          const staticSuggestions = staticSuggestionsService.getSuggestionsWithMetadata(language, maxSuggestions);
          console.log('📋 Static suggestions:', staticSuggestions);
          setSuggestions(staticSuggestions);
        } else {
          // Search for matching questions
          const results = await questionSuggestionService.getSuggestions(
            inputValue,
            language,
            maxSuggestions
          );
          console.log('🔍 Search results:', results);
          setSuggestions(results);
        }
        setSelectedIndex(-1);
      } catch (error) {
        console.error('❌ Error loading suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [inputValue, isVisible, language, maxSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isVisible || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleQuestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose?.();
        break;
    }
  }, [isVisible, suggestions, selectedIndex, onClose]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle question selection
  const handleQuestionSelect = (question) => {
    onQuestionSelect?.(question.question);
    onClose?.();
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  console.log('🎯 Autocomplete render check:', {
    isVisible,
    inputValue,
    suggestions: suggestions.length,
    language,
    loading
  });

  if (!isVisible) {
    console.log('🚫 Autocomplete not visible');
    return null;
  }

  console.log('✅ Rendering autocomplete component');

  return (
    <Fade in={isVisible}>
      <Paper
        elevation={8}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          zIndex: 9999,
          maxHeight: 400,
          overflow: 'hidden',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 10px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)'
            : '0 10px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
          direction: isRTL ? 'rtl' : 'ltr',
          mb: 2,
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(26, 29, 26, 0.9)'
              : 'rgba(245, 248, 245, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {loading ? (
              <CircularProgress size={16} color="primary" />
            ) : (
              <SearchIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            )}
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.025em'
              }}
            >
              {inputValue && inputValue.length >= 2 ? t.suggestions : t.staticSuggestions}
            </Typography>
            <Chip
              label={language.toUpperCase()}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 600,
                ml: 1
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '11px',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              ↑↓ Navigate • Enter Select • Esc Close
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'text.primary'
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{
          maxHeight: 280,
          overflow: 'auto',
          bgcolor: 'background.paper',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'action.disabled',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            bgcolor: 'action.hover',
          }
        }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                gap: 2
              }}
            >
              <CircularProgress size={20} color="primary" />
              <Typography variant="body2" color="text.secondary">
                {t.loading}
              </Typography>
            </Box>
          ) : suggestions.length > 0 ? (
            <List ref={listRef} sx={{ p: 0 }}>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={suggestion.id || index}
                  button
                  selected={index === selectedIndex}
                  onClick={() => handleQuestionSelect(suggestion)}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderBottom: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: isRTL ? 'translateX(-2px)' : 'translateX(2px)'
                    },
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      borderLeft: isRTL ? 'none' : 3,
                      borderRight: isRTL ? 3 : 'none',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'action.selected'
                      }
                    },
                    cursor: 'pointer',
                    direction: isRTL ? 'rtl' : 'ltr',
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: '100%' }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: index === selectedIndex ? 'primary.main' : 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease-in-out'
                      }}
                    >
                      <QuestionIcon
                        sx={{
                          color: index === selectedIndex ? 'primary.contrastText' : 'primary.main',
                          fontSize: 16
                        }}
                      />
                    </Box>
                    <ListItemText
                      primary={suggestion.question}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: index === selectedIndex ? 600 : 500,
                        color: index === selectedIndex ? 'text.primary' : 'text.secondary',
                        sx: {
                          textAlign: isRTL ? 'right' : 'left',
                          lineHeight: 1.4,
                          fontSize: '14px'
                        }
                      }}
                    />
                    {suggestion.score > 80 && (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: 'secondary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Typography sx={{ color: 'secondary.contrastText', fontSize: '12px', fontWeight: 600 }}>
                          ★
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                px: 3,
                textAlign: 'center'
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <SearchIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '14px',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                {inputValue && inputValue.length >= 2 ? t.noSuggestions : t.startTyping}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.disabled',
                  fontSize: '12px',
                  fontWeight: 400
                }}
              >
                {t.helpText}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Fade>
  );
};

export default QuestionAutocomplete;
