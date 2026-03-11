/**
 * Onboarding constants for language learning preferences
 */
import {
  Music, Plane, ChefHat, Trophy, Monitor, Briefcase,
  Clapperboard, FlaskConical, Palette, Newspaper, BookOpen, Leaf,
  Sprout, Zap,
} from "lucide-react";

export const LANGUAGES = [
  { code: 'en', name: 'English',  nativeName: 'English',  flagCode: 'gb' },
  { code: 'fr', name: 'French',   nativeName: 'Français', flagCode: 'fr' },
  { code: 'es', name: 'Spanish',  nativeName: 'Español',  flagCode: 'es' },
];

export const TOPICS = [
  { id: 'music',         name: 'Music',           icon: Music },
  { id: 'travel',        name: 'Travel',          icon: Plane },
  { id: 'food',          name: 'Food & Cooking',  icon: ChefHat },
  { id: 'sports',        name: 'Sports',          icon: Trophy },
  { id: 'technology',    name: 'Technology',      icon: Monitor },
  { id: 'business',      name: 'Business',        icon: Briefcase },
  { id: 'entertainment', name: 'Entertainment',   icon: Clapperboard },
  { id: 'science',       name: 'Science',         icon: FlaskConical },
  { id: 'culture',       name: 'Culture',         icon: Palette },
  { id: 'news',          name: 'News',            icon: Newspaper },
  { id: 'education',     name: 'Education',       icon: BookOpen },
  { id: 'lifestyle',     name: 'Lifestyle',       icon: Leaf },
];

export const LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner',
    icon: Sprout,
    description: 'Just starting out, learning basic vocabulary and phrases',
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    icon: Zap,
    description: 'Can understand everyday conversations and common topics',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: Trophy,
    description: 'Comfortable with complex topics and nuanced language',
  },
];
